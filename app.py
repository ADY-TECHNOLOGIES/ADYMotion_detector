from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

motion_events = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/log-motion', methods=['POST'])
def log_motion():
    data = request.get_json()
    timestamp = datetime.utcnow().isoformat()
    motion_events.append({"time": timestamp, "message": data.get("message", "Motion Detected")})
    return jsonify({"status": "logged", "timestamp": timestamp})

@app.route('/logs')
def get_logs():
    return jsonify(motion_events)

if __name__ == '__main__':
    import os
port = int(os.environ.get('PORT', 10000))
app.run(host='0.0.0.0', port=port, debug=True)

