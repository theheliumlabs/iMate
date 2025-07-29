from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS 
import os

app = Flask(__name__)
CORS(app)

# Configure paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, '../docs')

@app.route('/')
def home():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(FRONTEND_DIR, path)

@app.route('/process', methods=['POST'])
def process_input():
    data = request.get_json()
    user_input = data.get('input', '').strip()
    
    if not user_input:
        return jsonify({'error': 'Empty input'}), 400
    
    # Simple processing for now - just echo with expression detection
    response = process_user_input(user_input)
    
    # Add to conversation history
    conversation_history.append({
        'user': user_input,
        'avatar': response['text'],
        'expression': response['expression']
    })
    
    return jsonify(response)

def process_user_input(user_input):
    """Process user input and determine avatar response and expression"""
    input_lower = user_input.lower()
    
    # Expression detection
    expression = 'neutral'
    if 'smile' in input_lower or 'happy' in input_lower:
        expression = 'smile'
    elif 'laugh' in input_lower or 'haha' in input_lower:
        expression = 'laugh'
    elif 'angry' in input_lower or 'mad' in input_lower:
        expression = 'angry'
    elif 'surprised' in input_lower or 'wow' in input_lower:
        expression = 'surprised'
    elif 'sad' in input_lower or 'cry' in input_lower:
        expression = 'sad'
    
    # For now, just echo the input
    # This is where you'll integrate with LLM APIs later
    response_text = f"You said: {user_input}"
    
    return {
        'text': response_text,
        'expression': expression
    }

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(conversation_history)

if __name__ == '__main__':
    app.run(debug=True)