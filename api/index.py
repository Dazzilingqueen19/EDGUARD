import sys
import os

# Add backend to path so we can import modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the Flask app
from app import app

# Vercel expects handler function
def handler(request):
    """Vercel serverless function handler for Flask app"""
    # Flask app can handle the request directly
    return app(request.environ, request.start_response)
