// content.js - Intercepts and shields DOM execution layers
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "ISOLATE_TAB") {
        document.documentElement.innerHTML = `
            <div style="background-color: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 40px; box-sizing: border-box;">
                <div style="background: #1e293b; padding: 40px; border-radius: 12px; border: 1px solid #ef4444; max-width: 550px; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5);">
                    <div style="font-size: 64px; margin-bottom: 16px;">⚠️</div>
                    <h1 style="font-size: 28px; font-weight: 700; color: #ef4444; margin-bottom: 16px;">Threat Intercepted</h1>
                    <p style="font-size: 16px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
                        Phishing Shield AI has blocked navigation to <br>
                        <strong style="color: #cbd5e1; word-break: break-all;">${request.url}</strong>.<br><br>
                        This domain matches active phishing signatures designed to steal your credentials.
                    </p>
                    <button id="safety-return-btn" style="background-color: #ef4444; color: #ffffff; padding: 12px 28px; font-size: 16px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer;">
                        Return to Safety
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('safety-return-btn').addEventListener('click', () => {
            window.history.back();
        });
    }
});