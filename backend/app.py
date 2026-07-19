# app.py - Light, High-Performance URL Security Analyzer
import re
from urllib.parse import urlparse
from flask import Flask, request, jsonify

app = Flask(__name__)

# Simple middleware to bypass CORS cross-origin browser protection
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response

def evaluate_threat_heuristics(url):
    """
    Deterministic rule engine scanning for malicious spoof configurations.
    Returns a threat score between 0.0 and 1.0.
    """
    risk_score = 0.0
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname or ""

        # Vector 1: Check for obfuscated direct IP routing (e.g., http://192.168.1.1)
        ip_pattern = r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
        if re.match(ip_pattern, hostname):
            risk_score += 0.6

        # Vector 2: Check for credential mask/spoof symbols (e.g., billing@paypal.com)
        if '@' in url:
            risk_score += 0.5

        # Vector 3: Check for deceptive subdomain depth stacking
        if len(hostname.split('.')) > 4:
            risk_score += 0.4
            
        # Vector 4: Check for long URL obfuscation metrics
        if len(url) > 65:
            risk_score += 0.3

    except Exception:
        pass
        
    return min(risk_score, 1.0)

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return '', 200
        
    payload = request.get_json() or {}
    target_url = payload.get('url', '')
    
    if not target_url:
        return jsonify({'error': 'Missing URL payload target'}), 400
        
    final_score = evaluate_threat_heuristics(target_url)
    
    # Flag as malicious if the composite threat score exceeds structural thresholds
    is_phishing_threat = final_score >= 0.5
    
    return jsonify({
        'url': target_url,
        'is_phishing': is_phishing_threat,
        'threat_score': final_score
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)