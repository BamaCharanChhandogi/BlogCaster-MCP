# 🚀 BlogCaster MCP — Your Blog Ecosystem, One MCP Server

Cloud-hosted MCP server that lets you **publish, list, and delete posts across multiple blogging platforms** from any MCP-enabled client (Claude Desktop, Cursor/Cline, etc.). No local installs — just point your client at the URL. More management tools are on the way (updates, richer metadata, platform expansions).

## MCP Endpoint

```
https://blogcaster-mcp.rrpb2580.workers.dev/mcp
```

Replace `blogcaster-mcp.rrpb2580` with your Worker URL if you self-host.

## Connect from MCP clients

### Claude Desktop

```json
{
  "mcpServers": {
    "blogcaster": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://blogcaster-mcp.rrpb2580.workers.dev/mcp"]
    }
  }
}
```

### Cursor / Cline

```json
{
  "blogcaster": {
    "url": "https://blogcaster-mcp.rrpb2580.workers.dev/mcp"
  }
}
```

Restart the client after saving the config.

## Tools you can call

- `setPlatformToken(platform, token)` — store per-platform auth.
- `publishPost(title, contentMarkdown, platforms, coverImageURL?)` — publish to one or many blogs.
- `getBlogs(platforms)` — list recent posts per platform.
- `deletePost(platforms, postId)` — delete by ID on one or many platforms.

All tokens and state stay in Durable Object storage per user/instance. Update/edit tools are planned next.

## Quickstart flow

1) Save tokens  
   - Hashnode: `setPlatformToken("hashnode", "<HASHNODE_API_TOKEN>")`  
   - Dev.to: `setPlatformToken("devto", "<DEVTO_API_KEY>")`  
   - WordPress (JSON token):
     - Self-hosted + app password:
       ```json
       {
         "siteBaseUrl": "https://your-site.com",
         "username": "admin",
         "appPassword": "xxxx xxxx xxxx xxxx"
       }
       ```
     - WordPress.com OAuth:
       ```json
       { "site": "yoursite.wordpress.com", "token": "<oauth_access_token>" }
       ```
   - Then run `setPlatformToken("wordpress", "<stringified JSON above>")`

2) Publish a post

```javascript
publishPost(
  title: "My First BlogCaster Demo",
  contentMarkdown: "# Hello World\nPublished via MCP!",
  platforms: ["hashnode", "devto", "wordpress"],
  coverImageURL: "https://example.com/cover.jpg"
)
```

3) List posts

```javascript
getBlogs({ platforms: ["hashnode", "devto", "wordpress"] })
```

4) Delete a post by ID

```javascript
deletePost({ platforms: ["devto", "wordpress"], postId: "12345" })
```

## Platform support

| Platform   | Status | Notes |
|------------|--------|-------|
| Hashnode   | ✅     | Cover images ignored (API limitation) |
| Dev.to     | ✅     | Cover image URL supported |
| WordPress  | ✅     | Supports self-hosted + WordPress.com |
| Medium     | 🔜     | Planned |

## FAQ

- **Do I install anything?** No — everything runs on Cloudflare Workers.  
- **Where are tokens stored?** Durable Object storage scoped per user instance.  
- **Can I self-host?** Yes, deploy the Worker and point your MCP client to your URL.  
- **Does BlogCaster store my posts?** Only temporarily to publish; no retention.
