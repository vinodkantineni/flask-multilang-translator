from flask import Flask, render_template, request, jsonify
import requests
import csv
import os
from datetime import datetime

app = Flask(__name__)

# File to store feedback
FEEDBACK_FILE = 'feedback.csv'

# Ensure feedback file exists with headers
if not os.path.exists(FEEDBACK_FILE):
    with open(FEEDBACK_FILE, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Timestamp', 'Name', 'Email', 'Problem', 'Suggestion'])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text')
    source_lang = data.get('source_lang')
    target_lang = data.get('target_lang')

    if not text or not source_lang or not target_lang:
        return jsonify({'error': 'Missing required fields'}), 400

    # MyMemory API
    # Note: For heavy usage, a valid email or API key should be added to the query
    url = "https://api.mymemory.translated.net/get"
    params = {
        'q': text,
        'langpair': f"{source_lang}|{target_lang}"
    }
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            result = response.json()
            # Check if response status matches
            if result.get('responseStatus') != 200:
                 return jsonify({'error': result.get('responseDetails', 'Translation API Error')}), 400

            return jsonify({
                'translatedText': result['responseData']['translatedText'],
                'match': result['responseData']['match']
            })
        else:
            return jsonify({'error': 'Translation API failed'}), 502
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    problem = data.get('problem')
    suggestion = data.get('suggestion')

    if not name or not email or not problem:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        with open(FEEDBACK_FILE, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([datetime.now(), name, email, problem, suggestion])
        return jsonify({'message': 'Feedback received successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Application is running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
