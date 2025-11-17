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

	async init() {
		// Save API token for any blogging platform
		this.server.tool(
			"setPlatformToken",
			{
				platform: z.string(),
				token: z.string(),
			},
			async ({ platform, token }) => {
				const config = loadConfig();
				config.tokens = config.tokens || {};
				config.tokens[platform] = token;
				saveConfig(config);

				return {
					content: [
						{ type: "text", text: `Token saved for platform: ${platform}` },
					],
				};
			},
		);

		// Publish blog post to selected platforms
		this.server.tool(
			"publishPost",
			{
				title: z.string(),
				contentMarkdown: z.string(),
				platforms: z.array(z.string()),
			},
			async ({ title, contentMarkdown, platforms }) => {
				const config = loadConfig();
				config.tokens = config.tokens || {};

				const results: any[] = [];

				for (const platformName of platforms) {
					const token = config.tokens[platformName];

					if (!token) {
						results.push({
							platform: platformName,
							error: `Token missing for platform: ${platformName}`,
						});
						continue;
					}

					try {
						const platform = PlatformManager.getPlatform(
							platformName as any,
						);

						// optional: validate token (if platform supports it)
						if (platform.validateToken) {
							const ok = await platform.validateToken(token);
							if (!ok) {
								results.push({
									platform: platformName,
									error: "Invalid token",
								});
								continue;
							}
						}

						const result = await platform.publishPost(token, {
							title,
							contentMarkdown,
						});

						results.push({
							platform: platformName,
							success: true,
							result,
						});
					} catch (err: any) {
						results.push({
							platform: platformName,
							error: err.message,
						});
					}
				}

				return {
					content: [
						{ type: "text", text: JSON.stringify(results, null, 2) },
					],
				};
			},
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
