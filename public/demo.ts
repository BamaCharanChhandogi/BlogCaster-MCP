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
        BlogCaster runs in the cloud. Connect once, securely manage your tokens via our web portal, and publish posts from your AI tools.
        Works with any MCP-enabled client like Claude Desktop and Cursor/Cline.
      </p>
      <div class="flex flex-wrap gap-3">
        <a href="/dashboard" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">Go to Dashboard</a>
        <a href="#quickstart" class="px-4 py-2 border border-gray-900 rounded hover:bg-gray-50 transition">Quick start</a>
        <a href="#tools" class="px-4 py-2 border border-gray-200 rounded hover:border-gray-300 transition">Review Tools</a>
        <a href="#tokens" class="px-4 py-2 border border-gray-200 rounded hover:border-gray-300 transition">Setup Guide</a>
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
            <li>Connect to the MCP Endpoint above.</li>
            <li><strong>Ask: "Give me the component link to manage tokens"</strong></li>
            <li>Click the link, securely save your API keys in the web UI.</li>
            <li>Start publishing! "Publish this to Hashnode", "List my posts".</li>
          </ol>
          <p class="text-xs text-gray-600">Tokens are encrypted and stored in your unique session.</p>
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
        <p class="font-semibold">Examples</p>
        <p class="text-sm text-gray-700 font-semibold">1. Setup (Run this first)</p>
        <pre class="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto">getTokenManagementLink()</pre>
        <p class="text-sm text-gray-700 font-semibold">2. Publish</p>
        <pre class="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto">publishPost({
  title: "My BlogCaster demo",
  contentMarkdown: "# Hello world\\nShipped from MCP!",
  platforms: ["hashnode", "devto", "wordpress"],
  coverImageURL: "https://example.com/cover.jpg"
})</pre>
        <p class="text-sm text-gray-700 font-semibold">3. List & Delete</p>
        <pre class="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto">getBlogs({ platforms: ["hashnode", "devto"] })
deletePost({ platforms: ["devto"], postId: "12345" })</pre>
        <p class="text-sm text-gray-700 font-semibold">4. Update</p>
        <pre class="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto">updatePost({
  postId: "12345",
  title: "Updated Title",
  contentMarkdown: "# Updated Content",
  platforms: ["devto"]
})</pre>
      </div>
    </section>

    <section id="tools" class="space-y-4">
      <h2 class="text-xl font-semibold">Available Tools</h2>
      <div class="grid md:grid-cols-2 gap-5">
        <div class="border border-gray-200 rounded-lg p-5 space-y-3">
          <div class="flex items-center justify-between">
            <p class="font-semibold">getTokenManagementLink</p>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">auth</span>
          </div>
          <p class="text-sm text-gray-600">Generates a secure link to manage your platform tokens.</p>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3">
          <div class="flex items-center justify-between">
            <p class="font-semibold">publishPost</p>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">publish</span>
          </div>
          <p class="text-sm text-gray-600">Publish one markdown post to many platforms.</p>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3">
          <div class="flex items-center justify-between">
            <p class="font-semibold">getBlogs</p>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">fetch</span>
          </div>
          <p class="text-sm text-gray-600">List your recent posts per platform.</p>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3">
          <div class="flex items-center justify-between">
            <p class="font-semibold">updatePost</p>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">edit</span>
          </div>
          <p class="text-sm text-gray-600">Update an existing post.</p>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3">
          <div class="flex items-center justify-between">
            <p class="font-semibold">deletePost</p>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">cleanup</span>
          </div>
          <p class="text-sm text-gray-600">Delete a post by ID on each platform.</p>
        </div>
      </div>
    </section>

    <section id="tokens" class="space-y-4">
      <h2 class="text-xl font-semibold">Platform Setup Guide</h2>
      <p class="text-gray-600">Use the <strong>Token Management Link</strong> to configure these. You don't need to formatted JSON manually anymore.</p>
      
      <div class="grid md:grid-cols-2 gap-5">
        <div class="border border-gray-200 rounded-lg p-5 space-y-3 bg-white shadow-sm">
           <p class="font-semibold">Hashnode</p>
            <ol class="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Open Hashnode → Account Settings → Developer Settings</li>
              <li>Generate a Personal Access Token with <span class="font-mono text-xs bg-gray-100 px-1 rounded">publish</span> scope.</li>
              <li>Paste into the BlogCaster Token Page.</li>
            </ol>
            <p class="text-xs text-gray-500 mt-2">Note: Hashnode API ignores cover images.</p>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3 bg-white shadow-sm">
           <p class="font-semibold">Dev.to</p>
            <ol class="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Go to dev.to → Settings → Extensions → DEV API Keys.</li>
              <li>Create an API key with write permissions.</li>
              <li>Paste into the BlogCaster Token Page.</li>
            </ol>
            <p class="text-xs text-gray-500 mt-2">Supports cover images.</p>
        </div>

        <div class="border border-gray-200 rounded-lg p-5 space-y-3 bg-white shadow-sm md:col-span-2">
            <p class="font-semibold">WordPress (Self-hosted & .com)</p>
            <ul class="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li><strong>Self-hosted:</strong> Use your Site URL + Username + <a href="https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/" target="_blank" class="underline">Application Password</a>.</li>
              <li><strong>WordPress.com:</strong> Use OAuth (create an app in Developer settings).</li>
            </ul>
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
        <li>Tokens are stored securely in your private session (Durable Object).</li>
        <li>Sessions are ephemeral for security. A new chat session = A new secure storage box.</li>
        <li>Keep your "Token Management Link" handy if you want to reuse a session, or just generate a new one.</li>
      </ul>
    </section>
  </main>

  <footer class="border-t border-gray-200 bg-gray-50">
    <div class="max-w-5xl mx-auto px-6 py-6 text-sm text-gray-600 flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
      <span>BlogCaster MCP — Cloudflare Workers</span>
      <span class="text-gray-500">MCP compatible · Manage your blog ecosystem</span>
    </div>
  </footer>
</body>
</html>`;