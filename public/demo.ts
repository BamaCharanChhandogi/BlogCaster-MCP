export const demoHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BlogCaster MCP — Docs</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    pre, code { font-family: ui-monospace, SFMono-Regular, SFMono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
  </style>
</head>
<body class="bg-white text-gray-900">
  <header class="border-b border-gray-200 bg-white">
    <div class="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 bg-black rounded flex items-center justify-center text-white font-semibold text-sm">BC</div>
        <div>
          <p class="text-lg font-bold">BlogCaster MCP</p>
          <p class="text-sm text-gray-500">Your blog ecosystem via MCP</p>
        </div>
      </div>
      <a class="inline-flex items-center px-4 py-2 border border-gray-900 rounded hover:bg-gray-50 transition" target="_blank" href="https://github.com/BamaCharanChhandogi/BlogCaster-MCP">View on GitHub</a>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-6 py-10 space-y-12">
    <section class="space-y-4">
      <h1 class="text-3xl font-bold">One place for your blog ecosystem</h1>
      <p class="text-lg text-gray-600 max-w-3xl">
        BlogCaster runs in the cloud. Connect once, add your blog tokens, and manage posts from your AI tools (publish, list, delete today; more tools coming).
        Works with any MCP-enabled client like Claude Desktop and Cursor/Cline.
      </p>
      <div class="flex flex-wrap gap-3">
        <a href="#quickstart" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">Quick start</a>
        <a href="#tools" class="px-4 py-2 border border-gray-900 rounded hover:bg-gray-50 transition">What it can do</a>
        <a href="#tokens" class="px-4 py-2 border border-gray-200 rounded hover:border-gray-300 transition">Platform setup</a>
      </div>
    </section>

    <section id="endpoint" class="space-y-3">
      <h2 class="text-xl font-semibold">MCP Endpoint</h2>
      <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <p class="font-mono text-sm break-all">https://blogcaster-mcp.rrpb2580.workers.dev/mcp</p>
        <p class="text-sm text-gray-600 mt-2">Replace with your Worker URL if self-hosting.</p>
      </div>
    </section>

    <section id="quickstart" class="space-y-6">
      <h2 class="text-xl font-semibold">Quick start</h2>
      <div class="grid md:grid-cols-2 gap-5 md:items-start">
        <div class="border border-gray-200 rounded-lg p-5 bg-white shadow-sm space-y-3 w-full min-w-0">
          <p class="font-semibold">Simple steps</p>
          <ol class="list-decimal list-inside text-sm text-gray-700 space-y-2">
            <li>Open your AI tool (Claude Desktop, Cursor/Cline).</li>
            <li>When asked for the server, use: <span class="font-mono text-xs bg-gray-100 px-1 rounded break-all">https://blogcaster-mcp.rrpb2580.workers.dev/mcp</span></li>
            <li>Add your tokens (see platform steps below).</li>
            <li>Ask things like: “Publish this markdown to Hashnode and Dev.to” or “List my WordPress posts.”</li>
          </ol>
          <p class="text-xs text-gray-600">Tokens stay private inside BlogCaster’s secure storage.</p>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 bg-white shadow-sm space-y-3 w-full min-w-0">
          <p class="font-semibold">Config snippets</p>
          <div class="grid gap-3">
            <div>
              <p class="text-sm font-semibold mb-2">Claude Desktop</p>
              <pre class="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto whitespace-pre-wrap break-words">{
  "mcpServers": {
    "blogcaster": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://blogcaster-mcp.rrpb2580.workers.dev/mcp"]
    }
  }
}</pre>
            </div>
            <div>
              <p class="text-sm font-semibold mb-2">Cursor / Cline</p>
              <pre class="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto whitespace-pre-wrap break-words">{
  "blogcaster": {
    "url": "https://blogcaster-mcp.rrpb2580.workers.dev/mcp"
  }
}</pre>
            </div>
          </div>
        </div>
      </div>

      <div class="border border-gray-200 rounded-lg p-5 bg-gray-50 space-y-3">
        <p class="font-semibold">Examples (run inside your MCP-enabled AI chat after tokens are saved)</p>
        <p class="text-sm text-gray-700 font-semibold">Publish</p>
        <pre class="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto">publishPost({
  title: "My BlogCaster demo",
  contentMarkdown: "# Hello world\\nShipped from MCP!",
  platforms: ["hashnode", "devto", "wordpress"],
  coverImageURL: "https://example.com/cover.jpg"
})</pre>
        <p class="text-sm text-gray-700 font-semibold">List recent posts</p>
        <pre class="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto">getBlogs({ platforms: ["hashnode", "devto", "wordpress"] })</pre>
        <p class="text-sm text-gray-700 font-semibold">Delete by ID</p>
        <pre class="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto">deletePost({ platforms: ["devto", "wordpress"], postId: "12345" })</pre>
        <p class="text-xs text-gray-600">Update/edit tools are planned; today you can publish, list, and delete.</p>
      </div>
    </section>

    <section id="tools" class="space-y-4">
      <h2 class="text-xl font-semibold">What BlogCaster can do</h2>
      <div class="grid md:grid-cols-2 gap-5">
        <div class="border border-gray-200 rounded-lg p-5 space-y-3">
          <div class="flex items-center justify-between">
            <p class="font-semibold">setPlatformToken</p>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">auth</span>
          </div>
          <p class="text-sm text-gray-600">Persist platform credentials.</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li><code class="bg-gray-100 px-1 rounded">platform</code> — "hashnode" | "devto" | "wordpress"</li>
            <li><code class="bg-gray-100 px-1 rounded">token</code> — API token (WordPress requires JSON string)</li>
          </ul>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3">
          <div class="flex items-center justify-between">
            <p class="font-semibold">publishPost</p>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">publish</span>
          </div>
          <p class="text-sm text-gray-600">Publish one markdown post to many platforms.</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li><code class="bg-gray-100 px-1 rounded">title</code>, <code class="bg-gray-100 px-1 rounded">contentMarkdown</code></li>
            <li><code class="bg-gray-100 px-1 rounded">platforms</code>: string[]</li>
            <li><code class="bg-gray-100 px-1 rounded">coverImageURL</code>: optional</li>
          </ul>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3">
          <div class="flex items-center justify-between">
            <p class="font-semibold">getBlogs</p>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">fetch</span>
          </div>
          <p class="text-sm text-gray-600">List your recent posts per platform.</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li><code class="bg-gray-100 px-1 rounded">platforms</code>: string[]</li>
          </ul>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3">
          <div class="flex items-center justify-between">
            <p class="font-semibold">deletePost</p>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">cleanup</span>
          </div>
          <p class="text-sm text-gray-600">Delete a post by ID on each platform.</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li><code class="bg-gray-100 px-1 rounded">platforms</code>: string[]</li>
            <li><code class="bg-gray-100 px-1 rounded">postId</code>: string</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="tokens" class="space-y-4">
      <h2 class="text-xl font-semibold">Platform setup (click to view steps)</h2>
      <div class="grid md:grid-cols-2 gap-5">
        <div class="border border-gray-200 rounded-lg p-5 space-y-3 bg-white shadow-sm">
          <div class="flex items-center justify-between">
            <p class="font-semibold">Hashnode</p>
            <button class="text-sm text-blue-600 hover:underline" onclick="togglePanel('hashnode')">View steps</button>
          </div>
          <div id="hashnode" class="space-y-3 hidden">
            <ol class="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Open Hashnode → <span class="font-mono text-xs bg-gray-100 px-1 rounded">Account Settings → Developer Settings</span></li>
              <li>Generate a Personal Access Token with <span class="font-mono text-xs bg-gray-100 px-1 rounded">publish</span> scope.</li>
              <li>Copy the token (keep it secret).</li>
              <li>Run inside MCP client:</li>
            </ol>
            <pre class="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-auto">setPlatformToken("hashnode", "HASHNODE_API_TOKEN")</pre>
            <p class="text-xs text-gray-600">Hashnode currently ignores cover images.</p>
          </div>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3 bg-white shadow-sm">
          <div class="flex items-center justify-between">
            <p class="font-semibold">Dev.to</p>
            <button class="text-sm text-blue-600 hover:underline" onclick="togglePanel('devto')">View steps</button>
          </div>
          <div id="devto" class="space-y-3 hidden">
            <ol class="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Go to dev.to → <span class="font-mono text-xs bg-gray-100 px-1 rounded">Settings → Extensions → DEV API Keys</span>.</li>
              <li>Create an API key with write permissions.</li>
              <li>Copy the key.</li>
              <li>Run:</li>
            </ol>
            <pre class="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-auto">setPlatformToken("devto", "DEVTO_API_KEY")</pre>
            <p class="text-xs text-gray-600">Cover image URL is supported.</p>
          </div>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3 bg-white shadow-sm md:col-span-2">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <p class="font-semibold">WordPress</p>
            <div class="space-x-2">
              <button class="text-sm text-blue-600 hover:underline" onclick="togglePanel('wp-basic')">Self-hosted (App Password)</button>
              <button class="text-sm text-blue-600 hover:underline" onclick="togglePanel('wp-oauth')">WordPress.com OAuth</button>
            </div>
          </div>

          <div id="wp-basic" class="space-y-3 hidden">
            <p class="text-sm text-gray-700 font-semibold">Self-hosted + App Password</p>
            <ol class="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Ensure your site uses HTTPS and supports Application Passwords.</li>
              <li>In WordPress admin: <span class="font-mono text-xs bg-gray-100 px-1 rounded">Users → Profile → Application Passwords</span>.</li>
              <li>Create a password, copy it once.</li>
              <li>Build the JSON token and pass it as a string:</li>
            </ol>
            <pre class="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-auto">setPlatformToken("wordpress", "{ \\"siteBaseUrl\\": \\"https://your-site.com\\", \\"username\\": \\"admin\\", \\"appPassword\\": \\"xxxx xxxx xxxx xxxx\\" }")</pre>
            <p class="text-xs text-gray-600">Uses basic auth to your self-hosted REST API.</p>
          </div>

          <div id="wp-oauth" class="space-y-3 hidden">
            <p class="text-sm text-gray-700 font-semibold">WordPress.com OAuth</p>
            <ol class="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Create an app in WordPress.com Developer settings.</li>
              <li>Request an OAuth access token with <span class="font-mono text-xs bg-gray-100 px-1 rounded">posts</span> scope.</li>
              <li>Note your site slug (e.g., <span class="font-mono text-xs bg-gray-100 px-1 rounded">yoursite.wordpress.com</span>).</li>
              <li>Store the token:</li>
            </ol>
            <pre class="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-auto">setPlatformToken("wordpress", "{ \\"site\\": \\"yoursite.wordpress.com\\", \\"token\\": \\"OAUTH_ACCESS_TOKEN\\" }")</pre>
            <p class="text-xs text-gray-600">Uses WordPress.com REST with bearer auth.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Routes</h2>
      <div class="border border-gray-200 rounded-lg">
        <div class="p-4 border-b border-gray-200 flex items-start space-x-3">
          <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">GET</span>
          <div>
            <code class="font-mono">/</code>
            <p class="text-sm text-gray-600">This demo docs page.</p>
          </div>
        </div>
        <div class="p-4 flex items-start space-x-3">
          <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">POST</span>
          <div>
            <code class="font-mono">/mcp</code>
            <p class="text-sm text-gray-600">MCP endpoint used by clients.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">Notes</h2>
      <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1">
        <li>Tokens are stored per Durable Object instance and not logged.</li>
        <li>Hashnode ignores cover images (API limitation); Dev.to and WordPress support them.</li>
        <li>Use <code class="bg-gray-100 px-1 rounded">getBlogs</code> before deleting to confirm post IDs.</li>
        <li>Roadmap: edit/update posts and more management tools.</li>
      </ul>
    </section>
  </main>

  <footer class="border-t border-gray-200 bg-gray-50">
    <div class="max-w-5xl mx-auto px-6 py-6 text-sm text-gray-600 flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
      <span>BlogCaster MCP — Cloudflare Workers</span>
      <span class="text-gray-500">MCP compatible · Manage your blog ecosystem</span>
    </div>
  </footer>
  <script>
    function togglePanel(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.toggle("hidden");
      }
    }
  </script>
</body>
</html>`;