// background.js - Listens for browser tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const url = tab.url;

        if (url.startsWith('chrome://') || url.startsWith('about:')) return;

        // Step 1: Run local string heuristics checks
        const baselineRisk = evaluateHeuristics(url);

        // Step 2: Route suspicious vectors to the ML Backend Layer
        if (baselineRisk > 0.4) {
            try {
                const apiResponse = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });
                
                const evaluation = await apiResponse.json();

                if (evaluation.is_phishing) {
                    // Step 3: Command content.js to block the DOM environment
                    chrome.tabs.sendMessage(tabId, { action: "ISOLATE_TAB", url: url });
                }
            } catch (err) {
                console.warn("ML API unreachable. Using passive fallback scanning.", err);
            }
        }
    }
});

function evaluateHeuristics(url) {
    let vulnerabilityScore = 0;
    try {
        const parsed = new URL(url);
        
        // Check 1: Flag direct IP usage (e.g., http://192.168.1.1)
        const rawIpCheck = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (rawIpCheck.test(parsed.hostname)) vulnerabilityScore += 0.5;

        // Check 2: Flag deep subdomain structures
        if (parsed.hostname.split('.').length > 4) vulnerabilityScore += 0.3;

        // Check 3: Flag visual mask symbols
        if (url.includes('@')) vulnerabilityScore += 0.4;
    } catch (e) {
        return 0;
    }
    return vulnerabilityScore;
}
