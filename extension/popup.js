document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const urlInput = document.getElementById('urlInput').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!urlInput) return;
    
    resultDiv.style.display = "block";
    resultDiv.className = "";
    resultDiv.innerHTML = "Routing vector payload to ML backend...";

    try {
        const response = await fetch('https://phishing-shield-backend.onrender.com/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: urlInput })
        });
        
        const data = await response.json();
        
        if (data.is_phishing) {
            resultDiv.className = "threat";
            resultDiv.innerHTML = `<strong>⚠️ THREAT DETECTED</strong><br>Threat Score: ${data.threat_score}<br>Verdict: Malicious Obfuscation.`;
        } else {
            resultDiv.className = "safe";
            resultDiv.innerHTML = `<strong>✅ SIGNATURE CLEAN</strong><br>Threat Score: ${data.threat_score}<br>Verdict: Valid Domain Architecture.`;
        }
    } catch (err) {
        resultDiv.className = "threat";
        resultDiv.innerHTML = "Execution Error: Backend Offline.";
    }
});