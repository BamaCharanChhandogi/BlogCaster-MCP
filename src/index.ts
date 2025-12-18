
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PlatformManager } from "./publisher/PlatformManager.js";
import { demoHtml } from "../public/demo.js";
import { tokenPageHtml } from "../public/tokenPage.js";
import { pricingPageHtml } from "../public/pricingPage.js";
import { signLoginToken, verifyLoginToken } from "./auth/auth.js";
import { sendLoginEmail } from "./utils/email.js";
import { UserDO } from "./auth/UserDO.js";
export { UserDO };

interface Env {
  BlogMCP: KVNamespace;
  MCP_OBJECT: DurableObjectNamespace<MyMCP>;
  USER_OBJECT: DurableObjectNamespace<UserDO>;
  ENCRYPTION_KEY: string;
  MAGIC_LINK_SECRET?: string;
  RESEND_API_KEY?: string;
}

// Main MCP Class
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "blogcaster-mcp",
    version: "0.2.0",
  });

  private doState: DurableObjectState;
  public env: Env;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.doState = state;
    this.env = env;
  }

  // Helper to get the linked user's email
  private async getLinkedUser(): Promise<string | null> {
    return await this.doState.storage.get<string>("linked_user_email") || null;
  }

  private getUserStub(email: string): DurableObjectStub<UserDO> {
    const id = this.env.USER_OBJECT.idFromName(email);
    return this.env.USER_OBJECT.get(id);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Internal Endpoint: Link User
    if (url.pathname === "/internal/link-user") {
      const { email } = await request.json() as { email: string };
      await this.doState.storage.put("linked_user_email", email);
      return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
    }

    return super.fetch(request);
  }

  async init() {
    // Tool: Get Login Link
    this.server.tool(
      "getLoginLink",
      "Get a login link to authenticate and manage your tokens",
      {},
      async () => {
        const sessionId = this.doState.id.toString();
        // Assuming dev URL for now, or we could pass HOST in env
        // Using worker.dev url as base
        const loginUrl = `https://blogcaster-mcp.rrpb2580.workers.dev/login?connect_id=${sessionId}`;

        const linkedUser = await this.getLinkedUser();
        const status = linkedUser ? `Already linked to ${linkedUser}` : "Not connected";

        return {
          content: [{ type: "text", text: `Status: ${status}\n\nLogin here: ${loginUrl}` }]
        };
      }
    );

    // Tool: Who Am I
    this.server.tool(
      "whoami",
      "Check current authenticated user",
      {},
      async () => {
        const email = await this.getLinkedUser();
        if (!email) return { content: [{ type: "text", text: "Not logged in." }] };
        return { content: [{ type: "text", text: `Logged in as: ${email}` }] };
      }
    );

    // Tool: Logout
    this.server.tool(
      "logout",
      "Clear current authentication",
      {},
      async () => {
        await this.doState.storage.delete("linked_user_email");
        return { content: [{ type: "text", text: "Logged out." }] };
      }
    );

    // Tool: Publish Post (Auth Aware)
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
          const email = await this.getLinkedUser();
          if (!email) {
            return { content: [{ type: "text", text: "Error: Login required. Run getLoginLink() first." }], isError: true };
          }

          const userStub = this.getUserStub(email);
          const response = await userStub.fetch("http://internal/internal/get-tokens");
          const tokens = await response.json() as Record<string, string>;

          const results: any[] = [];

          for (const platformName of platforms) {
            const token = tokens[platformName];
            if (!token) {
              results.push({ platform: platformName, error: "Token missing. Configure it in the dashboard." });
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
          return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
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
          const email = await this.getLinkedUser();
          if (!email) return { content: [{ type: "text", text: "Error: Login required." }], isError: true };

          const userStub = this.getUserStub(email);
          const response = await userStub.fetch("http://internal/internal/get-tokens");
          const tokens = await response.json() as Record<string, string>;

          const results: any[] = [];

          for (const platformName of platforms) {
            const token = tokens[platformName];
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

    // Tool: Get Blogs
    this.server.tool(
      "getBlogs",
      { platforms: z.array(z.string()) },
      async ({ platforms }) => {
        try {
          const email = await this.getLinkedUser();
          if (!email) return { content: [{ type: "text", text: "Error: Login required." }], isError: true };

          const userStub = this.getUserStub(email);
          const response = await userStub.fetch("http://internal/internal/get-tokens");
          const tokens = await response.json() as Record<string, string>;

          const result: any[] = [];
          for (const p of platforms) {
            const token = tokens[p];
            if (!token) { result.push({ platform: p, error: "Token missing" }); continue; }
            try {
              const platform = PlatformManager.getPlatform(p as any);
              const blogs = await platform.getAllBlogs(token);
              result.push({ platform: p, success: true, blogs });
            } catch (e: any) { result.push({ platform: p, error: e.message }); }
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
          const email = await this.getLinkedUser();
          if (!email) return { content: [{ type: "text", text: "Error: Login required." }], isError: true };

          const userStub = this.getUserStub(email);
          const response = await userStub.fetch("http://internal/internal/get-tokens");
          const tokens = await response.json() as Record<string, string>;

          const result: any[] = [];
          for (const p of platforms) {
            const token = tokens[p];
            if (!token) { result.push({ platform: p, error: "Missing token" }); continue; }
            try {
              const platform = PlatformManager.getPlatform(p as any);
              await platform.deletePost(token, postId);
              result.push({ platform: p, success: true });
            } catch (e: any) { result.push({ platform: p, error: e.message }); }
          }
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (e: any) { return { content: [{ type: "text", text: `Error: ${e.message}` }] }; }
      }
    );
  }
}

// --- Worker Fetch Handler ---

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // 1. Login Page
    if (url.pathname === "/login") {
      return new Response(`
          <!DOCTYPE html>
          <html>
            <head>
               <title>BlogCaster Login</title>
               <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-50 flex items-center justify-center min-h-screen">
               <div class="bg-white p-8 rounded shadow-md max-w-sm w-full">
                  <h1 class="text-xl font-bold mb-4">Login to BlogCaster</h1>
                  <form action="/api/auth/send-link" method="POST" onsubmit="event.preventDefault(); sendLink(this)">
                     <input type="hidden" name="connect_id" value="${url.searchParams.get("connect_id") || ''}" />
                     <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" required class="mt-1 block w-full px-3 py-2 border rounded" placeholder="you@example.com">
                     </div>
                     <button type="submit" class="w-full bg-black text-white py-2 rounded">Send Login Link</button>
                  </form>
                  <p id="status" class="mt-4 text-center text-sm text-gray-600"></p>
               </div>
               <script>
                 async function sendLink(form) {
                    const btn = form.querySelector('button');
                    btn.disabled = true;
                    btn.innerText = "Sending...";
                    const formData = new FormData(form);
                    try {
                      const res = await fetch('/api/auth/send-link', {
                          method: 'POST',
                          body: JSON.stringify(Object.fromEntries(formData)),
                          headers: {'Content-Type': 'application/json'}
                      });
                      const data = await res.json();
                      if (data.verifyUrl) {
                          // Auto-redirect simulation
                          window.location.href = data.verifyUrl;
                          return;
                      }
                      document.getElementById('status').innerText = data.message || data.error;
                      btn.innerText = "Sent";
                    } catch (e) {
                      document.getElementById('status').innerText = "Error sending link";
                      btn.disabled = false;
                      btn.innerText = "Send Magic Link";
                    }
                 }
               </script>
            </body>
          </html>
        `, { headers: { 'Content-Type': 'text/html' } });
    }

    // 2. Auth API: Send Login Link
    if (url.pathname === "/api/auth/send-link" && request.method === "POST") {
      try {
        const { email, connect_id } = await request.json() as any;
        if (!email) throw new Error("Email required");

        const secret = env.MAGIC_LINK_SECRET || "dev-secret-unsafe";
        const token = await signLoginToken(email, secret);

        const verifyUrl = `${url.origin}/verify?token=${encodeURIComponent(token)}&connect_id=${encodeURIComponent(connect_id || '')}`;

        console.log("Login Link:", verifyUrl);

        let message = `Login link sent to ${email} (Check server logs in dev)`;

        if (env.RESEND_API_KEY) {
          try {
            await sendLoginEmail(email, verifyUrl, env.RESEND_API_KEY);
            message = `Login link sent to ${email} (Check your inbox)`;
          } catch (err: any) {
            console.error("Email failed:", err);
            message = `Failed to send email: ${err.message}. Link logged to console.`;
          }
        }

        return new Response(JSON.stringify({
          success: true,
          message: message,
          verifyUrl: verifyUrl // Return for auto-redirect
        }), { headers: { 'Content-Type': 'application/json' } });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 400 });
      }
    }

    // 3. Verify Login Link
    if (url.pathname === "/verify") {
      const token = url.searchParams.get("token");
      const connect_id = url.searchParams.get("connect_id");

      if (!token) return new Response("Missing token", { status: 400 });

      const secret = env.MAGIC_LINK_SECRET || "dev-secret-unsafe";
      const email = await verifyLoginToken(token, secret);

      if (!email) return new Response("Invalid or expired token", { status: 403 });

      const userId = env.USER_OBJECT.idFromName(email);
      const userStub = env.USER_OBJECT.get(userId);
      await userStub.fetch("http://internal/internal/init", {
        method: "POST",
        body: JSON.stringify({ email, id: email }),
        headers: { 'Content-Type': 'application/json' }
      });

      const cookie = `auth_user=${email}; HttpOnly; Secure; SameSite=Lax; Path=/`;

      if (connect_id) {
        await userStub.fetch("http://internal/internal/link-session", {
          method: "POST",
          body: JSON.stringify({ sessionId: connect_id }),
          headers: { 'Content-Type': 'application/json' }
        });

        try {
          const sessionId = env.MCP_OBJECT.idFromString(connect_id);
          const sessionStub = env.MCP_OBJECT.get(sessionId);
          await sessionStub.fetch("http://internal/internal/link-user", {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (e) {
          console.error("Failed to link session", e);
        }
      }

      return new Response(null, {
        status: 302,
        headers: {
          'Set-Cookie': cookie,
          'Location': '/pricing'
        }
      });
    }

    // 4. Pricing Page
    if (url.pathname === "/pricing") {
      const cookie = request.headers.get("Cookie");
      const email = cookie?.match(/auth_user=([^;]+)/)?.[1];

      if (!email) {
        return new Response(null, { status: 302, headers: { 'Location': '/login' } });
      }

      return new Response(pricingPageHtml(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // 5. Dashboard (Protected)
    if (url.pathname === "/dashboard" || url.pathname === "/tokens") {
      const cookie = request.headers.get("Cookie");
      const email = cookie?.match(/auth_user=([^;]+)/)?.[1];

      if (!email) {
        return new Response(null, { status: 302, headers: { 'Location': '/login' } });
      }

      return new Response(tokenPageHtml("") /* No session key needed */, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // 6. User API (Protected)
    if (url.pathname.startsWith("/api/user") || url.pathname.startsWith("/api/tokens")) {
      const cookie = request.headers.get("Cookie");
      const email = cookie?.match(/auth_user=([^;]+)/)?.[1];
      if (!email) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

      const userId = env.USER_OBJECT.idFromName(email);
      const userStub = env.USER_OBJECT.get(userId);

      if (url.pathname === "/api/user/me") {
        const res = await userStub.fetch("http://internal/internal/get-profile");
        return res;
      }

      if (request.method === "GET" && url.pathname === "/api/tokens/status") {
        const tRes = await userStub.fetch("http://internal/internal/get-tokens");
        const tokens = await tRes.json() as Record<string, string>;
        const status = {
          hashnode: !!tokens.hashnode,
          devto: !!tokens.devto,
          wordpress: !!tokens.wordpress
        };
        return new Response(JSON.stringify(status), { headers: { 'Content-Type': 'application/json' } });
      }

      if (request.method === "POST" && url.pathname === "/api/tokens") {
        const body = await request.text();
        return userStub.fetch("http://internal/internal/save-token", {
          method: "POST",
          body,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === "DELETE" && url.pathname.startsWith("/api/tokens/")) {
        const parts = url.pathname.split('/');
        const platform = parts[parts.length - 1];
        return userStub.fetch("http://internal/internal/delete-token", {
          method: "POST",
          body: JSON.stringify({ platform }),
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === "POST" && url.pathname === "/api/user/select-plan") {
        const { plan } = await request.json() as { plan: string };
        return userStub.fetch("http://internal/internal/set-plan", {
          method: "POST",
          body: JSON.stringify({ plan }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 7. Logout
    if (url.pathname === "/logout") {
      return new Response(null, {
        status: 302,
        headers: {
          'Set-Cookie': 'auth_user=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
          'Location': '/login'
        }
      });
    }

    // MCP & SSE Routes
    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }
    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    // Root
    if (url.pathname === "/") {
      return new Response(demoHtml, {
        headers: { 'Content-Type': 'text/html', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};