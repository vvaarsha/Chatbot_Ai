from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import os
from google.cloud import dialogflow
from google.cloud.dialogflow_v2.types import TextInput, QueryInput
from google.oauth2 import service_account

# Securely load Dialogflow credentials
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, "dialogflow-key.json")  # Ensure this file exists

if not os.path.exists(SERVICE_ACCOUNT_FILE):
    raise FileNotFoundError("Dialogflow key file missing. Ensure 'dialogflow-key.json' is in the backend directory.")

credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE)

DIALOGFLOW_PROJECT_ID = ""  # Replace with your Dialogflow project ID
DIALOGFLOW_LANGUAGE_CODE = "en"
SESSION_ID = ""

def home(request):
    """Simple home page response"""
    return HttpResponse("<h1>Welcome to the AI Chatbot Management System</h1>")

def chatbot_response(request):
    """Handles user messages and sends them to Dialogflow"""
    user_message = request.GET.get('message', '')

    if not user_message:
        return JsonResponse({"error": "No message provided"}, status=400)

    try:
        # Create a Dialogflow session
        session_client = dialogflow.SessionsClient(credentials=credentials)
        session = session_client.session_path(DIALOGFLOW_PROJECT_ID, SESSION_ID)

        # Prepare user input
        text_input = TextInput(text=user_message, language_code=DIALOGFLOW_LANGUAGE_CODE)
        query_input = QueryInput(text=text_input)

        # Detect intent from Dialogflow
        response = session_client.detect_intent(session=session, query_input=query_input)

        # Extract chatbot response from Dialogflow
        chatbot_reply = response.query_result.fulfillment_text

        return JsonResponse({"response": chatbot_reply})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

