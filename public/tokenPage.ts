export const tokenPageHtml = (sessionKey: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BlogCaster Token Management</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    /* Minimalist transitions */
    .transition-all-200 { transition: all 0.2s ease; }
  </style>
</head>
<body class="bg-white text-gray-900">
  <!-- Header -->
  <header class="border-b border-gray-200 bg-white sticky top-0 z-50">
    <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-semibold text-xs">BC</div>
        <div>
          <p class="font-bold text-sm md:text-base">Token Management</p>
        </div>
      </div>
      <button onclick="loadTokenStatus()" class="text-xs md:text-sm font-medium border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50 transition flex items-center gap-2">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        Refresh
      </button>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-6 py-10 space-y-10">
    <!-- Intro -->
    <section>
      <h1 class="text-2xl font-bold mb-2">Configure Platforms</h1>
      <p class="text-gray-600">Securely save your API tokens. These are stored isolated in your session.</p>
    </section>

    <!-- Status Overview -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4" id="statusContainer">
      <!-- Skeletons -->
      <div class="bg-gray-50 h-24 rounded border border-gray-100 animate-pulse"></div>
      <div class="bg-gray-50 h-24 rounded border border-gray-100 animate-pulse"></div>
      <div class="bg-gray-50 h-24 rounded border border-gray-100 animate-pulse"></div>
    </section>

    <!-- Alert Container -->
    <div id="alertContainer"></div>

    <!-- Forms Container -->
    <div class="grid grid-cols-1 gap-12">
      
      <!-- Hashnode -->
      <section class="border-t border-gray-200 pt-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
             <h2 class="text-lg font-bold">Hashnode</h2>
             <span id="hashnode-badge" class="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-mono">loading...</span>
          </div>
        </div>
        
        <div class="grid md:grid-cols-[1fr_300px] gap-8">
          <form onsubmit="saveToken(event, 'hashnode')" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Personal Access Token</label>
              <input 
                type="password" 
                id="hashnode-token" 
                placeholder="Enter Hashnode token"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all-200"
                required
              />
            </div>
            <div class="flex items-center gap-3">
               <button type="submit" class="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition">Save Token</button>
            </div>
          </form>

          <div class="text-sm text-gray-600 bg-gray-50 p-4 rounded h-fit">
            <p class="font-semibold text-gray-900 mb-2">How to get token</p>
            <ol class="list-decimal list-inside space-y-1.5 text-xs">
              <li>Open <a href="https://hashnode.com/settings/developer" target="_blank" class="underline hover:text-black">Developer Settings</a></li>
              <li>Generate token with <code class="bg-gray-200 px-1 rounded">publish</code> scope</li>
              <li>Hashnode ignores cover images via API</li>
            </ol>
          </div>
        </div>
      </section>

      <!-- Dev.to -->
      <section class="border-t border-gray-200 pt-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
             <h2 class="text-lg font-bold">Dev.to</h2>
             <span id="devto-badge" class="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-mono">loading...</span>
          </div>
        </div>
        
        <div class="grid md:grid-cols-[1fr_300px] gap-8">
          <form onsubmit="saveToken(event, 'devto')" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">API Key</label>
              <input 
                type="password" 
                id="devto-token" 
                placeholder="Enter Dev.to API Key"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all-200"
                required
              />
            </div>
            <div class="flex items-center gap-3">
               <button type="submit" class="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition">Save Token</button>
            </div>
          </form>

          <div class="text-sm text-gray-600 bg-gray-50 p-4 rounded h-fit">
            <p class="font-semibold text-gray-900 mb-2">How to get token</p>
            <ol class="list-decimal list-inside space-y-1.5 text-xs">
              <li>Go to <a href="https://dev.to/settings/extensions" target="_blank" class="underline hover:text-black">Dev.to API Keys</a></li>
              <li>Create key with write permissions</li>
              <li>Supports cover images</li>
            </ol>
          </div>
        </div>
      </section>

      <!-- WordPress -->
      <section class="border-t border-gray-200 pt-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
             <h2 class="text-lg font-bold">WordPress</h2>
             <span id="wordpress-badge" class="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-mono">loading...</span>
          </div>
          
          <div class="flex text-xs border border-gray-200 rounded overflow-hidden">
            <button onclick="switchWordPressMode('basic')" id="wp-basic-btn" class="px-3 py-1.5 bg-gray-100 font-medium">Self-Hosted</button>
            <button onclick="switchWordPressMode('oauth')" id="wp-oauth-btn" class="px-3 py-1.5 hover:bg-gray-50">WordPress.com</button>
          </div>
        </div>
        
        <div class="grid md:grid-cols-[1fr_300px] gap-8">
          
          <!-- Basic Auth Form -->
          <div id="wp-basic-form">
            <form onsubmit="saveWordPressToken(event, 'basic')" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Site URL</label>
                <input type="url" id="wp-site-url" placeholder="https://your-site.com" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all-200" required />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Username</label>
                  <input type="text" id="wp-username" placeholder="admin" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all-200" required />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">App Password</label>
                  <input type="password" id="wp-app-password" placeholder="xxxx xxxx xxxx xxxx" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all-200" required />
                </div>
              </div>
              <div class="flex items-center gap-3 pt-2">
                <button type="submit" class="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition">Save Token</button>
              </div>
            </form>
          </div>

          <!-- OAuth Form -->
          <div id="wp-oauth-form" class="hidden">
            <form onsubmit="saveWordPressToken(event, 'oauth')" class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Site Slug</label>
                  <input type="text" id="wp-site-slug" placeholder="yoursite.wordpress.com" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all-200" required />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">OAuth Token</label>
                  <input type="password" id="wp-oauth-token" placeholder="Access Token" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all-200" required />
                </div>
              <div class="flex items-center gap-3 pt-2">
                <button type="submit" class="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition">Save Token</button>
              </div>
            </form>
          </div>

          <!-- Helper Text -->
          <div class="text-sm text-gray-600 bg-gray-50 p-4 rounded h-fit">
            <p class="font-semibold text-gray-900 mb-2">WordPress Setup</p>
            <div id="wp-basic-help">
              <p class="text-xs text-gray-500 mb-2">Self-Hosted (App Password)</p>
              <ol class="list-decimal list-inside space-y-1.5 text-xs">
                <li>Users → Profile → Application Passwords</li>
                <li>Create new password</li>
                <li>Requires HTTPS</li>
              </ol>
            </div>
            <div id="wp-oauth-help" class="hidden">
               <p class="text-xs text-gray-500 mb-2">WordPress.com (OAuth)</p>
               <ol class="list-decimal list-inside space-y-1.5 text-xs">
                <li>Create App in Developer Settings</li>
                <li>Get token with <code class="bg-gray-200 px-1 rounded">posts</code> scope</li>
               </ol>
            </div>
          </div>

        </div>
      </section>

    </div>
  </main>

  <footer class="border-t border-gray-200 mt-12 py-8">
    <div class="max-w-4xl mx-auto px-6 text-center text-sm text-gray-500">
      <p>Tokens are encrypted and stored in your session. <a href="/" class="text-black underline hover:no-underline">Back to Docs</a></p>
    </div>
  </footer>

  <script>
    const SESSION_KEY = '${sessionKey}';
    
    window.addEventListener('DOMContentLoaded', loadTokenStatus);

    function switchWordPressMode(mode) {
      const basicForm = document.getElementById('wp-basic-form');
      const oauthForm = document.getElementById('wp-oauth-form');
      const basicBtn = document.getElementById('wp-basic-btn');
      const oauthBtn = document.getElementById('wp-oauth-btn');
      const basicHelp = document.getElementById('wp-basic-help');
      const oauthHelp = document.getElementById('wp-oauth-help');

      if (mode === 'basic') {
        basicForm.classList.remove('hidden');
        oauthForm.classList.add('hidden');
        basicHelp.classList.remove('hidden');
        oauthHelp.classList.add('hidden');
        basicBtn.className = 'px-3 py-1.5 bg-gray-100 font-medium';
        oauthBtn.className = 'px-3 py-1.5 hover:bg-gray-50';
      } else {
        basicForm.classList.add('hidden');
        oauthForm.classList.remove('hidden');
        basicHelp.classList.add('hidden');
        oauthHelp.classList.remove('hidden');
        basicBtn.className = 'px-3 py-1.5 hover:bg-gray-50';
        oauthBtn.className = 'px-3 py-1.5 bg-gray-100 font-medium';
      }
    }

    async function loadTokenStatus() {
      try {
        const response = await fetch(\`/api/tokens/status?session=\${SESSION_KEY}\`);
        const data = await response.json();
        if (data.error) { showAlert('error', data.error); return; }
        updateStatusBadges(data);
      } catch (error) { showAlert('error', 'Failed to load token status'); }
    }

    function updateStatusBadges(status) {
      const platforms = ['hashnode', 'devto', 'wordpress'];
      const container = document.getElementById('statusContainer');
      
      container.innerHTML = platforms.map(platform => {
        const configured = status[platform];
        const borderColor = configured ? 'border-green-200 bg-green-50' : 'border-gray-200';
        const icon = configured ? '✓' : '○';
        const colorClass = configured ? 'text-green-700' : 'text-gray-400';
        
        // Add Remove button if configured
        const removeButton = configured ? \`<button onclick="deleteToken('\${platform}')" class="text-xs text-red-600 hover:text-red-700 font-medium ml-auto flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Remove</button>\` : '';
        
        return \`
          <div class="p-4 rounded border \${borderColor} flex flex-col justify-between h-24 transition-all-200 hover:shadow-sm">
            <div class="flex items-center justify-between">
              <span class="font-semibold capitalize text-gray-900">\${platform}</span>
              <span class="\${colorClass} text-lg">\${icon}</span>
            </div>
            <div class="flex items-center justify-between mt-auto">
                <p class="text-xs \${configured ? 'text-green-600' : 'text-gray-500'} font-medium">\${configured ? 'Configured' : 'Not configured'}</p>
                \${removeButton}
            </div>
          </div>
        \`;
      }).join('');

      platforms.forEach(platform => {
        const badge = document.getElementById(\`\${platform}-badge\`);
        if (status[platform]) {
          badge.className = 'text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 font-mono';
          badge.textContent = 'Active';
        } else {
          badge.className = 'text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-mono';
          badge.textContent = 'Not set';
        }
      });
    }

    async function saveToken(event, platform) {
      event.preventDefault();
      const tokenInput = document.getElementById(\`\${platform}-token\`);
      const token = tokenInput.value.trim();
      if (!token) return;

      try {
        const response = await fetch(\`/api/tokens?session=\${SESSION_KEY}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform, token })
        });
        const data = await response.json();
        if (response.ok) {
          showAlert('success', \`\${platform} saved\`);
          tokenInput.value = '';
          loadTokenStatus();
        } else {
          showAlert('error', data.error);
        }
      } catch (error) { showAlert('error', 'Network error'); }
    }

    async function saveWordPressToken(event, mode) {
      event.preventDefault();
      let tokenData;
      if (mode === 'basic') {
        tokenData = JSON.stringify({
          siteBaseUrl: document.getElementById('wp-site-url').value.trim(),
          username: document.getElementById('wp-username').value.trim(),
          appPassword: document.getElementById('wp-app-password').value.trim()
        });
      } else {
        tokenData = JSON.stringify({
          site: document.getElementById('wp-site-slug').value.trim(),
          token: document.getElementById('wp-oauth-token').value.trim()
        });
      }

      try {
        const response = await fetch(\`/api/tokens?session=\${SESSION_KEY}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform: 'wordpress', token: tokenData })
        });
        if (response.ok) {
          showAlert('success', 'WordPress saved');
          event.target.reset();
          loadTokenStatus();
        } else {
          const data = await response.json();
          showAlert('error', data.error);
        }
      } catch (error) { showAlert('error', 'Network error'); }
    }

    async function deleteToken(platform) {
      if (!confirm(\`Delete \${platform} token?\`)) return;
      try {
        const response = await fetch(\`/api/tokens/\${platform}?session=\${SESSION_KEY}\`, { method: 'DELETE' });
        if (response.ok) {
          showAlert('success', \`\${platform} deleted\`);
          loadTokenStatus();
        } else { showAlert('error', 'Failed to delete'); }
      } catch (error) { showAlert('error', 'Network error'); }
    }

    function showAlert(type, message) {
      const container = document.getElementById('alertContainer');
      const el = document.createElement('div');
      el.className = \`mb-4 p-3 rounded text-sm font-medium flex items-center justify-between \${type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}\`;
      el.innerHTML = \`<span>\${message}</span> <button onclick="this.parentElement.remove()" class="opacity-50 hover:opacity-100">&times;</button>\`;
      container.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  </script>
</body>
</html>`;
