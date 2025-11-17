import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PlatformManager } from "./publisher/PlatformManager.js";
import { loadConfig, saveConfig } from "./config.js";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "blog-mcp",
    version: "0.1.0",
  });

  private kv?: KVNamespace;
  private env?: any;

  constructor(state: DurableObjectState, env: any) {
    super(state, env);
    // Store env in constructor - this is where Durable Objects receive env
    this.env = env;
    // FIXED: Changed from env.KV to env.BlogMCP to match wrangler.jsonc
    this.kv = env.BlogMCP;
    console.log("[MyMCP Constructor] Env received:", {
      hasBlogMCP: !!env.BlogMCP,
      hasKV: !!env.KV,
      envKeys: Object.keys(env)
    });
  }

  async init(env?: any) {
    // Also try to get env from init parameter
    if (env) {
      console.log("[MyMCP Init] Env parameter provided");
      this.env = env;
      // FIXED: Changed from env.KV to env.BlogMCP
      if (env.BlogMCP) {
        this.kv = env.BlogMCP;
      }
    } else {
      console.log("[MyMCP Init] No env parameter, using constructor env");
    }

    console.log("[MyMCP Init] Final KV status:", !!this.kv);

    // Test KV immediately
    if (this.kv) {
      try {
        await this.kv.put("__test_key__", "test_value");
        const testValue = await this.kv.get("__test_key__");
        console.log("[MyMCP Init] KV test successful:", testValue);
      } catch (err) {
        console.error("[MyMCP Init] KV test failed:", err);
      }
    }

    // Debug tool to check KV status
    this.server.tool(
      "debugKV",
      {},
      async () => {
        const status = {
          hasKV: !!this.kv,
          hasEnv: !!this.env,
          envKeys: this.env ? Object.keys(this.env) : [],
          hasBlogMCP: this.env ? !!this.env.BlogMCP : false
        };
        
        console.log("[debugKV] Status:", status);

        if (!this.kv) {
          return {
            content: [
              { type: "text", text: `KV not available. Debug info:\n${JSON.stringify(status, null, 2)}\n\nMake sure your wrangler.jsonc has "binding": "BlogMCP"` }
            ]
          };
        }

        try {
          await this.kv.put("debug-test", new Date().toISOString());
          const value = await this.kv.get("debug-test");
          return {
            content: [
              { type: "text", text: `✅ KV is working!\n\nTest value: ${value}\n\nDebug info:\n${JSON.stringify(status, null, 2)}` }
            ]
          };
        } catch (err: any) {
          return {
            content: [
              { type: "text", text: `❌ KV error: ${err.message}\n\nDebug info:\n${JSON.stringify(status, null, 2)}` }
            ]
          };
        }
      }
    );

    // Save API token for any blogging platform
    this.server.tool(
      "setPlatformToken",
      {
        platform: z.string().describe("Platform name (e.g., 'hashnode', 'devto')"),
        token: z.string().describe("API token for the platform"),
      },
      async ({ platform, token }) => {
        console.log(`[setPlatformToken] Called for platform: ${platform}`);
        
        if (!this.kv) {
          console.error("[setPlatformToken] KV not available");
          return {
            content: [
              { 
                type: "text", 
                text: "❌ Error: KV namespace not configured.\n\nTry calling the 'debugKV' tool first to see what's wrong.\n\nMake sure your wrangler.jsonc has:\n\"binding\": \"BlogMCP\"" 
              }
            ]
          };
        }

        try {
          const config = await loadConfig(this.kv);
          config.tokens = config.tokens || {};
          config.tokens[platform] = token;
          await saveConfig(config, this.kv);

          console.log(`[setPlatformToken] Token saved for ${platform}`);

          return {
            content: [
              { type: "text", text: `✅ Token saved successfully for platform: ${platform}` }
            ]
          };
        } catch (err: any) {
          console.error("[setPlatformToken] Error:", err);
          return {
            content: [
              { type: "text", text: `❌ Error saving token: ${err.message}` }
            ]
          };
        }
      }
    );

    // Publish blog post to selected platforms
    this.server.tool(
      "publishPost",
      {
        title: z.string().describe("Blog post title"),
        contentMarkdown: z.string().describe("Blog post content in Markdown format"),
        platforms: z.array(z.string()).describe("List of platforms to publish to (e.g., ['hashnode', 'devto'])"),
      },
      async ({ title, contentMarkdown, platforms }) => {
        console.log(`[publishPost] Called for platforms: ${platforms.join(", ")}`);

        if (!this.kv) {
          console.error("[publishPost] KV not available");
          return {
            content: [
              { 
                type: "text", 
                text: "❌ Error: KV namespace not configured.\n\nTry calling 'debugKV' tool first to check status." 
              }
            ]
          };
        }

        try {
          const config = await loadConfig(this.kv);
          config.tokens = config.tokens || {};

          const results: any[] = [];

          for (const platformName of platforms) {
            const token = config.tokens[platformName];

            if (!token) {
              console.warn(`[publishPost] No token found for ${platformName}`);
              results.push({
                platform: platformName,
                error: `Token missing for platform: ${platformName}. Use setPlatformToken first.`
              });
              continue;
            }

            try {
              const platform = PlatformManager.getPlatform(platformName as any);

              if (platform.validateToken) {
                const ok = await platform.validateToken(token);
                if (!ok) {
                  results.push({
                    platform: platformName,
                    error: "Invalid token"
                  });
                  continue;
                }
              }

              const result = await platform.publishPost(token, {
                title,
                contentMarkdown
              });

              console.log(`[publishPost] Success for ${platformName}`);
              results.push({
                platform: platformName,
                success: true,
                result
              });
            } catch (err: any) {
              console.error(`[publishPost] Error for ${platformName}:`, err);
              results.push({
                platform: platformName,
                error: err.message
              });
            }
          }

          return {
            content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
          };
        } catch (err: any) {
          console.error("[publishPost] Error:", err);
          return {
            content: [
              { type: "text", text: `❌ Error: ${err.message}` }
            ]
          };
        }
      }
    );
  }
}

export default {
  fetch(request: Request, env: any, ctx: ExecutionContext) {
    console.log("[Worker fetch] Request received:", request.url);
    console.log("[Worker fetch] Env bindings:", {
      hasBlogMCP: !!env.BlogMCP,
      hasKV: !!env.KV,
      hasMCP_OBJECT: !!env.MCP_OBJECT,
      envKeys: Object.keys(env)
    });

    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  }
};