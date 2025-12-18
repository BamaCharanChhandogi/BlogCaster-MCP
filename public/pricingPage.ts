export const pricingPageHtml = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Choose Your Plan - BlogCaster</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .plan-card { transition: all 0.3s ease; }
    .plan-card:hover { transform: translateY(-4px); }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in { animation: fadeIn 0.5s ease-out; }
  </style>
</head>
<body class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center p-6">
  <div class="max-w-5xl w-full fade-in">
    <!-- Header -->
    <div class="text-center mb-12">
      <div class="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">BC</div>
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Choose Your Plan</h1>
      <p class="text-gray-600 text-lg">Start publishing to multiple platforms effortlessly</p>
    </div>

    <!-- Pricing Cards -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Free Plan -->
      <div class="plan-card bg-white rounded-xl border-2 border-gray-200 p-8 relative">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Free Plan</h2>
          <div class="flex items-baseline mb-4">
            <span class="text-5xl font-bold text-gray-900">$0</span>
            <span class="text-gray-500 ml-2">/mo</span>
          </div>
        </div>

        <ul class="space-y-4 mb-8">
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-700">Manage 3 Platforms</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-700">Basic Analytics</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-700">Community Support</span>
          </li>
        </ul>

        <button 
          onclick="selectPlan('free')" 
          class="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Current Plan
        </button>
      </div>

      <!-- Pro Plan -->
      <div class="plan-card bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-gray-900 p-8 relative shadow-xl">
        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span class="bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">Recommended</span>
        </div>

        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-2">Pro Plan</h2>
          <div class="flex items-baseline mb-4">
            <span class="text-5xl font-bold text-white">$5</span>
            <span class="text-gray-300 ml-2">/mo</span>
          </div>
        </div>

        <ul class="space-y-4 mb-8">
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-100">Unlimited Platforms</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-100">Priority Publishing</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-100">Advanced Analytics</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-100">24/7 Support</span>
          </li>
        </ul>

        <button 
          disabled
          class="w-full bg-gray-600 text-gray-400 font-semibold py-3 px-6 rounded-lg cursor-not-allowed opacity-60"
        >
          Coming Soon
        </button>
      </div>
    </div>

    <!-- Skip Link -->
    <div class="text-center">
      <a href="/dashboard" class="text-gray-600 hover:text-gray-900 text-sm font-medium underline">
        Skip for now
      </a>
    </div>
  </div>

  <script>
    async function selectPlan(plan) {
      try {
        const response = await fetch('/api/user/select-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan })
        });

        if (response.ok) {
          window.location.href = '/dashboard';
        } else {
          alert('Failed to select plan. Please try again.');
        }
      } catch (error) {
        console.error('Error selecting plan:', error);
        alert('An error occurred. Please try again.');
      }
    }
  </script>
</body>
</html>`;
