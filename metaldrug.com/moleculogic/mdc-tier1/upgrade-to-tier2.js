<!-- MDC Tier 1 Secure Logic Interface -->
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MDC Tier 1 - Logic Sandbox</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="/metaldrug.com/moleculogic/scripts/tier1_validator.js"></script>
  <script src="/metaldrug.com/moleculogic/scripts/upgrade-to-tier2.js"></script>
</head>
<body class="bg-gray-950 text-white">

  <div id="header"></div>

  <main class="p-6 max-w-4xl mx-auto">
    <div id="tokenPrompt" class="mb-6 p-6 border border-yellow-500 bg-yellow-100 text-black dark:bg-yellow-800 dark:text-yellow-100 rounded">
      <h2 class="text-xl font-semibold mb-2">🔐 NDA Token Required</h2>
      <p class="mb-2">Enter your NDA token to access the MDC Tier 1 secure logic sandbox:</p>
      <input id="ndaTokenInput" type="text" placeholder="Enter NDA Token"
             class="w-full p-2 rounded border border-gray-300 text-black dark:text-white bg-white dark:bg-gray-700" />
      <button onclick="validateNDAToken()" class="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Validate Token</button>
      <div id="tokenStatus" class="mt-2 text-sm"></div>
    </div>

    <section id="mdcTier1Interface" class="hidden">
      <h1 class="text-3xl font-bold text-indigo-400 mb-4">MDC Tier 1: Secure Logic Sandbox</h1>
      <p class="text-gray-400 mb-6">Simulate and validate MDC logic here. Submit valid entries for Tier 2 elevation.</p>

      <section class="p-6 border border-gray-700 rounded bg-gray-900">
        <h2 class="text-xl font-bold text-indigo-500 mb-2">Blueprint Validator</h2>
        <input type="text" id="blueprintName" placeholder="Session Name"
               class="border p-2 w-full mb-2 bg-white dark:bg-gray-800 text-black dark:text-white" />
        <textarea id="blueprintInput" placeholder="Paste logic JSON here" rows="10"
                  class="border p-2 w-full mb-2 bg-white dark:bg-gray-900 text-white"></textarea>

        <div class="flex flex-wrap gap-4 mb-4">
          <button onclick="validateBlueprintInput('blueprintInput', 'validatorOutput')"
                  class="bg-indigo-600 text-white px-4 py-2 rounded">Validate</button>
          <button onclick="saveBlueprintToLocal('blueprintName', 'blueprintInput')"
                  class="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          <button onclick="loadBlueprintHistory('historyContainer')"
                  class="bg-gray-700 text-white px-4 py-2 rounded">Load History</button>
          <button onclick="submitTier2Upgrade('blueprintInput', 'blueprintName')"
                  class="bg-orange-600 text-white px-4 py-2 rounded">Submit for Tier 2</button>
        </div>

        <div id="validatorOutput" class="mt-4"></div>
        <div class="mt-6" id="historyContainer"></div>
      </section>
    </section>
  </main>

  <div id="footer"></div>

  <script>
    fetch('/metaldrug.com/includes/header.html').then(r => r.text()).then(t => document.getElementById('header').innerHTML = t);
    fetch('/metaldrug.com/includes/footer.html').then(r => r.text()).then(t => document.getElementById('footer').innerHTML = t);

    function validateNDAToken() {
      const token = document.getElementById('ndaTokenInput').value.trim();
      if (!token) return;

      fetch('/nda_handler/nda_token_status_check.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        const status = document.getElementById('tokenStatus');
        if (data.status === 'valid') {
          sessionStorage.setItem('nda_token', token);
          document.getElementById('tokenPrompt').style.display = 'none';
          document.getElementById('mdcTier1Interface').classList.remove('hidden');
          status.innerHTML = '<span class="text-green-400">Access granted.</span>';
        } else {
          status.innerHTML = '<span class="text-red-400">Invalid token.</span>';
        }
      })
      .catch(() => {
        document.getElementById('tokenStatus').innerText = 'Token check failed.';
      });
    }

    window.addEventListener('DOMContentLoaded', () => {
      const token = sessionStorage.getItem('nda_token');
      if (token) {
        document.getElementById('ndaTokenInput').value = token;
        validateNDAToken();
      }
    });
  </script>
</body>
</html>
