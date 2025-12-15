import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PlatformManager } from "./publisher/PlatformManager.js";
import { loadConfigFromStorage, saveConfigToStorage, deleteToken, Config } from "./config.js";
import { demoHtml } from "../public/demo.js";
import { tokenPageHtml } from "../public/tokenPage.js";
import { getOrCreateSessionKey, validateSessionKey, generateSessionKey } from "./utils/session.js";

// Main MCP Class
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "blogcaster-mcp",
    version: "0.1.0",
  });

  private doState: DurableObjectState;
  private kv?: KVNamespace;
  private mcpEnv: any;

  constructor(state: DurableObjectState, env: any) {
    super(state, env);
    this.doState = state;
    this.mcpEnv = env;
    this.kv = env.BlogMCP;
  }

  // Helper to get config from linked Session DO or fallback to local
  private async getConfig(): Promise<Config> {
    const activeSessionKey = await this.doState.storage.get<string>("active_session_key");
    if (activeSessionKey) {
        try {
            const id = this.mcpEnv.MCP_OBJECT.idFromName(activeSessionKey);
            const stub = this.mcpEnv.MCP_OBJECT.get(id);
            const response = await stub.fetch("http://internal/internal/get-config"); 
            if (response.ok) return await response.json() as Config;
        } catch (e) {
            console.error("Failed to fetch from Session DO", e);
        }
    }
    return loadConfigFromStorage(this.doState.storage);
  }

  // Internal Fetch Handler (runs inside the specific DO instance)
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Initialize Session (Route to link DO)
    if (url.pathname === "/init-session") {
      try {
        const body = await request.json() as { sessionKey: string };
        await this.doState.storage.put("user-session-key", body.sessionKey);
        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' }});
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
    }

    // Get Config (Internal Bridge)
    if (url.pathname === "/internal/get-config") {
      try {
        const config = await loadConfigFromStorage(this.doState.storage);
        return new Response(JSON.stringify(config), { headers: { 'Content-Type': 'application/json' }});
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
    }

    // Save Config (New Internal Handler)
    if (url.pathname === "/internal/save-token") {
       try {
         const body = await request.json() as { platform: string, token: string };
         const config = await loadConfigFromStorage(this.doState.storage);
         config.tokens = config.tokens || {};
         config.tokens[body.platform] = body.token;
         await saveConfigToStorage(config, this.doState.storage);
         return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' }});
       } catch (error: any) {
         return new Response(JSON.stringify({ error: error.message }), { status: 500 });
       }
    }
    
    // Delete Token (New Internal Handler)
    if (url.pathname.startsWith("/internal/delete-token")) {
       try {
         // Assuming URL format: /internal/delete-token?platform=...
         const p = url.searchParams.get("platform");
         if(!p) throw new Error("Missing platform");
         await deleteToken(p, this.doState.storage);
         return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' }});
       } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
       }
    }

    return super.fetch(request);
  }

  async init(env?: any) {
    if (env?.BlogMCP) this.kv = env.BlogMCP;

    // Tool: Get Management Link
    this.server.tool(
      "getTokenManagementLink",
      "Get a secure link to manage your platform tokens on the web",
      {},
      async () => {
        try {
          // 1. Generate new session key
          const sessionKey = generateSessionKey();
          
          // 2. Link this MCP connection to that session key
          await this.doState.storage.put("active_session_key", sessionKey);
          
          // 3. Initialize the Session DO (so it's ready)
          const id = this.mcpEnv.MCP_OBJECT.idFromName(sessionKey);
          const stub = this.mcpEnv.MCP_OBJECT.get(id);
          await stub.fetch("http://internal/init-session", {
              method: "POST",
              body: JSON.stringify({ sessionKey }),
              headers: {'Content-Type': 'application/json'}
          });

          // 4. Return the production URL
          const productionUrl = `https://blogcaster-mcp.rrpb2580.workers.dev/tokens?session=${sessionKey}`;
          
          return {
            content: [{ type: "text", text: `Manage your tokens here:\n${productionUrl}` }]
          };
        } catch (error: any) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }] };
        }
      }
    );

    // Tool: Set Token (Legacy)
    this.server.tool(
      "setPlatformToken",
      { platform: z.string(), token: z.string() },
      async ({ platform, token }) => {
        try {
          const config = await loadConfigFromStorage(this.doState.storage);
          config.tokens = config.tokens || {};
          config.tokens[platform] = token;
          await saveConfigToStorage(config, this.doState.storage);
          return { content: [{ type: "text", text: `Token saved (Legacy Mode).` }] };
        } catch (err: any) {
            return { content: [{ type: "text", text: `Error: ${err.message}` }] };
        }
      }
    );

    // Tool: Publish Post
    this.server.tool(
      "publishPost",
      {
        title: z.string(),
        contentMarkdown: z.string(),
        platforms: z.array(z.string()),
        coverImageURL: z.string().optional(),
      },
      async ({ title, contentMarkdown, platforms, coverImageURL }) => {
        try {
          const config = await this.getConfig(); // USE BRIDGE
          config.tokens = config.tokens || {};
          const results: any[] = [];

          for (const platformName of platforms) {
            const token = config.tokens[platformName];
            if (!token) {
              results.push({ platform: platformName, error: "Token missing" });
              continue;
            }
            try {
                const platform = PlatformManager.getPlatform(platformName as any);
                const result = await platform.publishPost(token, { title, contentMarkdown, coverImageURL });
                results.push({ platform: platformName, success: true, result });
            } catch (e: any) {
                results.push({ platform: platformName, error: e.message });
            }
          }
          return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
        } catch (err: any) {
          return { content: [{ type: "text", text: `Error: ${err.message}` }] };
        }
      }
    );

    // Tool: Update Post
    this.server.tool(
      "updatePost",
      {
        postId: z.string(),
        title: z.string(),
        contentMarkdown: z.string(),
        platforms: z.array(z.string()),
        coverImageURL: z.string().optional(),
      },
      async ({ postId, title, contentMarkdown, platforms, coverImageURL }) => {
        try {
          const config = await this.getConfig(); // USE BRIDGE
          config.tokens = config.tokens || {};
          const results: any[] = [];

          for (const platformName of platforms) {
            const token = config.tokens[platformName];
            if (!token) {
              results.push({ platform: platformName, error: "Token missing" });
              continue;
            }
            try {
                const platform = PlatformManager.getPlatform(platformName as any);
                const result = await platform.updatePost(token, postId, { title, contentMarkdown, coverImageURL });
                results.push({ platform: platformName, success: true, result });
            } catch (e: any) {
                results.push({ platform: platformName, error: e.message });
            }
          }
          return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
        } catch (err: any) {
          return { content: [{ type: "text", text: `Error: ${err.message}` }] };
        }
      }
    );
    this.server.tool(
      "getBlogs",
      { platforms: z.array(z.string()) },
      async ({ platforms }) => {
        try {
           const config = await this.getConfig(); // USE BRIDGE
           config.tokens = config.tokens || {};
           const result: any[] = [];
           for(const p of platforms) {
               const token = config.tokens[p];
               if(!token) { result.push({platform: p, error: "Token missing"}); continue; }
               try {
                 const platform = PlatformManager.getPlatform(p as any);
                 const blogs = await platform.getAllBlogs(token);
                 result.push({platform: p, success: true, blogs});
               } catch(e:any) { result.push({platform: p, error: e.message}); }
           }
           return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (err: any) { return { content: [{ type: "text", text: `Error: ${err.message}` }] }; }
      }
    );

    // Tool: Delete Post
    this.server.tool(
      "deletePost",
      { platforms: z.array(z.string()), postId: z.string() },
      async ({ platforms, postId }) => {
         try {
            const config = await this.getConfig(); // USE BRIDGE
            config.tokens = config.tokens || {};
            const result: any[] = [];
            for (const p of platforms) {
                const token = config.tokens[p];
                if (!token) { result.push({platform: p, error: "Missing token"}); continue; }
                try {
                    const platform = PlatformManager.getPlatform(p as any);
                    await platform.deletePost(token, postId);
                    result.push({platform: p, success: true});
                } catch(e:any) { result.push({platform: p, error: e.message}); }
            }
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
         } catch(e:any) { return { content: [{ type: "text", text: `Error: ${e.message}` }] }; }
      }
    );
  }
}

// Global Routing Handler
// Includes: Persistent Session Logic via ?userId=
async function handleTokenStatus(request: Request, env: any) {
    const url = new URL(request.url);
    const sessionKey = url.searchParams.get("session");
    if (!sessionKey) return new Response(JSON.stringify({ error: "No session key" }), { status: 400 });
    
    // Check Session DO
    const id = env.MCP_OBJECT.idFromName(sessionKey);
    const stub = env.MCP_OBJECT.get(id);
    const response = await stub.fetch("http://internal/internal/get-config");
    
    if(!response.ok) return new Response(JSON.stringify({}), { status: 200 }); // Return empty if new session
    
    const config = await response.json() as Config;
    const status = {
        hashnode: !!(config.tokens?.hashnode),
        devto: !!(config.tokens?.devto),
        wordpress: !!(config.tokens?.wordpress)
    };
    return new Response(JSON.stringify(status), { headers: { 'Content-Type': 'application/json' }});
}

async function handleSaveToken(request: Request, env: any) {
    const url = new URL(request.url);
    const sessionKey = url.searchParams.get("session");
    
    if (!sessionKey) return new Response(JSON.stringify({ error: "No session key" }), { status: 400 });

    try {
        // Fix: Read body once
        const body = await request.text(); // Read raw text to clone it
        
        const id = env.MCP_OBJECT.idFromName(sessionKey);
        const stub = env.MCP_OBJECT.get(id);
        
        // Forward to NEW internal handler
        const response = await stub.fetch("http://internal/internal/save-token", {
             method: "POST",
             body: body, // Reuse body string
             headers: { 'Content-Type': 'application/json' }
        });
        
        return response;

    } catch(e:any) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
}

async function handleDeleteToken(request: Request, env: any) {
     const url = new URL(request.url);
     const sessionKey = url.searchParams.get("session");
     if (!sessionKey) return new Response(JSON.stringify({ error: "No session key" }), { status: 400 });
     
     // Extract platform from URL path: /api/tokens/hashnode
     const parts = url.pathname.split('/');
     const platform = parts[parts.length - 1]; // last segment

     const id = env.MCP_OBJECT.idFromName(sessionKey);
     const stub = env.MCP_OBJECT.get(id);
     
     // Forward to internal delete handler
     return stub.fetch(`http://internal/internal/delete-token?platform=${platform}`, {
         method: "POST" // Internal usage
     });
}


export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if(url.pathname === "/") {
      return new Response(demoHtml, {
        headers: { 'Content-Type': 'text/html', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // Token Management UI
    if (url.pathname === "/tokens") {
         const sessionKey = url.searchParams.get("session");
         return new Response(tokenPageHtml(sessionKey || ""), { headers: {'Content-Type': 'text/html'} });
    }
    
    // API Routes (Forwarding to Session DOs)
    if (url.pathname.startsWith("/api/tokens")) {
        if (request.method === "GET" && url.pathname === "/api/tokens/status") return handleTokenStatus(request, env);
        if (request.method === "POST" && url.pathname === "/api/tokens") return handleSaveToken(request, env);
        if (request.method === "DELETE") return handleDeleteToken(request, env);
    }

    // MCP & SSE Routes
    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
       return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }
    if (url.pathname === "/mcp") {
       return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  }
};