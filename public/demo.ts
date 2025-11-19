export const demoHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlogCaster MCP - Multi-Platform Blog Publishing</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
</head>
<body class="bg-white text-gray-900 min-h-screen">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white">
        <div class="max-w-4xl mx-auto px-6 py-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-black rounded flex items-center justify-center">
                        <span class="text-white font-bold text-sm">BC</span>
                    </div>
                    <h1 class="text-xl font-bold">BlogCaster MCP</h1>
                </div>
                 <a href="https://github.com/BamaCharanChhandogi/BlogCaster-MCP" target="_blank" class="inline-flex items-center px-6 py-2 border border-black rounded hover:bg-gray-50 transition-colors">
                <span class="mr-2">⭐</span> View on GitHub
            </a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-6 py-8">
        <!-- Hero Section -->
        <section class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">Publish Your Blog Everywhere With One Command</h2>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Cloud-hosted MCP server for multi-platform blog publishing. Connect once, publish everywhere.
            </p>
            <div class="flex justify-center space-x-4">
                <a href="#routes" class="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">View Routes</a>
                <a href="#tools" class="px-6 py-2 border border-black rounded hover:bg-gray-50 transition-colors">MCP Tools</a>
            </div>
        </section>

        <!-- Server Info -->
        <section class="mb-12">
            <h3 class="text-xl font-bold mb-6">Server Information</h3>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="border border-gray-200 rounded-lg p-6">
                    <h4 class="font-semibold mb-3">Platform</h4>
                    <p class="text-gray-600">Cloudflare Workers</p>
                    <p class="text-sm text-gray-500 mt-1">Version 0.1.0</p>
                </div>
                <div class="border border-gray-200 rounded-lg p-6">
                    <h4 class="font-semibold mb-3">MCP Endpoint</h4>
                    <p class="font-mono text-sm bg-gray-100 p-2 rounded">POST /mcp</p>
                    <p class="text-sm text-gray-500 mt-1">Model Context Protocol</p>
                </div>
                <div class="border border-gray-200 rounded-lg p-6">
                    <h4 class="font-semibold mb-3">Storage</h4>
                    <p class="text-gray-600">Durable Objects + KV</p>
                    <p class="text-sm text-gray-500 mt-1">Per-user isolation</p>
                </div>
            </div>
        </section>

        <!-- Available Routes -->
        <section id="routes" class="mb-12">
            <h3 class="text-xl font-bold mb-6">Available Routes</h3>
            <div class="border border-gray-200 rounded-lg">
                <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded mr-3">GET</span>
                            <code class="font-mono">/</code>
                            <p class="text-sm text-gray-600 mt-1">Demo dashboard page</p>
                        </div>
                    </div>
                </div>
                <div class="p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded mr-3">POST</span>
                            <code class="font-mono">/mcp</code>
                            <p class="text-sm text-gray-600 mt-1">MCP server endpoint</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- MCP Tools -->
        <section id="tools" class="mb-12">
            <h3 class="text-xl font-bold mb-6">MCP Tools</h3>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="border border-gray-200 rounded-lg p-6">
                    <h4 class="font-semibold mb-3">setPlatformToken</h4>
                    <p class="text-gray-600 mb-4">Store API tokens for blogging platforms</p>
                    <div class="bg-gray-50 p-4 rounded text-sm">
                        <p class="font-mono mb-2">Parameters:</p>
                        <ul class="space-y-1 text-gray-700">
                            <li><code class="bg-white px-1 rounded">platform</code>: string (hashnode, devto)</li>
                            <li><code class="bg-white px-1 rounded">token</code>: string (API token)</li>
                        </ul>
                    </div>
                </div>
                <div class="border border-gray-200 rounded-lg p-6">
                    <h4 class="font-semibold mb-3">publishPost</h4>
                    <p class="text-gray-600 mb-4">Publish to multiple platforms</p>
                    <div class="bg-gray-50 p-4 rounded text-sm">
                        <p class="font-mono mb-2">Parameters:</p>
                        <ul class="space-y-1 text-gray-700">
                            <li><code class="bg-white px-1 rounded">title</code>: string</li>
                            <li><code class="bg-white px-1 rounded">contentMarkdown</code>: string</li>
                            <li><code class="bg-white px-1 rounded">platforms</code>: array[string]</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Supported Platforms -->
        <section class="mb-12">
            <h3 class="text-xl font-bold mb-6">Supported Platforms</h3>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <h4 class="font-semibold mb-2">Hashnode</h4>
                    <p class="text-sm text-gray-600">Developer blogging platform with analytics</p>
                </div>
                <div class="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <h4 class="font-semibold mb-2">Dev.to</h4>
                    <p class="text-sm text-gray-600">Developer community platform</p>
                </div>
            </div>
            <p class="text-center text-gray-500 mt-6">More platforms coming soon...</p>
        </section>

        <!-- Integration Guide -->
        <section class="mb-12">
            <h3 class="text-xl font-bold mb-6">Integration Guide</h3>
            <div class="border border-gray-200 rounded-lg p-6">
                <h4 class="font-semibold mb-4">Claude Desktop</h4>
                <div class="bg-gray-50 p-4 rounded mb-6">
                    <p class="text-sm font-mono mb-2">Add to claude_desktop_config.json:</p>
                    <pre class="text-xs bg-white p-3 rounded border border-gray-200">{
  "mcpServers": {
    "blogcaster": {
      "command": "npx",
      "args": ["-y", "@blogcaster/mcp-server"],
      "env": {
        "BLOGCASTER_URL": "https://your-worker.your-subdomain.workers.dev"
      }
    }
  }
}</pre>
                </div>

                <h4 class="font-semibold mb-4">Cursor</h4>
                <div class="bg-gray-50 p-4 rounded mb-6">
                    <p class="text-sm mb-2">1. Open Cursor Settings → MCP</p>
                    <p class="text-sm mb-2">2. Add new server with URL: <code class="bg-white px-1 rounded">https://your-worker.your-subdomain.workers.dev/mcp</code></p>
                    <p class="text-sm">3. Configure authentication tokens as needed</p>
                </div>

                <h4 class="font-semibold mb-4">Other LLM Platforms</h4>
                <p class="text-sm text-gray-600 mb-2">Any platform supporting MCP can connect using the endpoint URL above. The server follows the Model Context Protocol specification for universal compatibility.</p>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-gray-50">
        <div class="max-w-4xl mx-auto px-6 py-6">
            <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                <div class="flex items-center space-x-2 mb-4 md:mb-0">
                    <span>BlogCaster MCP</span>
                </div>
                <div class="flex space-x-6">
                    <span>Powered by Cloudflare Workers</span>
                    <span>•</span>
                    <span>MCP Protocol</span>
                </div>
            </div>
        </div>
    </footer>

    <script>
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        }

        async function testConnection() {
            const resultDiv = document.getElementById('testResult');
            resultDiv.innerHTML = '<div class="text-blue-600">Testing connection...</div>';
            resultDiv.classList.remove('hidden');

            try {
                const response = await fetch('/mcp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        id: 1,
                        method: "initialize",
                        params: {
                            protocolVersion: "2024-11-05",
                            capabilities: {},
                            clientInfo: {
                                name: "BlogCaster Demo",
                                version: "1.0.0"
                            }
                        }
                    })
                });

                if (response.ok) {
                    resultDiv.innerHTML = '<div class="text-green-600">✓ MCP server is responding correctly!</div>';
                } else {
                    throw new Error('HTTP ' + response.status);
                }
            } catch (error) {
                resultDiv.innerHTML = '<div class="text-red-600">✗ Connection test failed: ' + error.message + '</div>';
            }
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>`;