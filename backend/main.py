import os
import asyncio
import traceback
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from google.genai.types import LiveConnectConfig, AudioTranscriptionConfig, SpeechConfig, VoiceConfig, PrebuiltVoiceConfig
from google import genai

# --- Configuration ---
PROJECT_ID = os.environ.get("GCP_PROJECT")
LOCATION = os.environ.get("GCP_REGION", "us-central1")
MODEL_ID = "gemini-live-2.5-flash-preview-native-audio"

# --- Initialization ---
app = FastAPI()
genai_client = None

@app.on_event("startup")
def startup_event():
    """Initializes the GenAIClient on application startup."""
    global genai_client
    if PROJECT_ID:
        try:
            # Using the genai.Client for Vertex AI integration
            genai_client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
            print("Google Gen AI Client for Vertex AI initialized successfully.")
        except Exception as e:
            print(f"Error initializing Google Gen AI Client: {e}")
    else:
        print("GCP_PROJECT environment variable not set. Gemini client not initialized.")

# --- API Endpoints ---
@app.get("/")
async def http_handler():
    """Health check endpoint."""
    return {"status": "FluentNow Backend is running", "gemini_client_initialized": genai_client is not None}

@app.websocket("/conversation")
async def conversation_endpoint(websocket: WebSocket):
    """Handles the real-time, bidirectional audio conversation using Gemini Live API."""
    await websocket.accept()
    print("Client connected to WebSocket.")

    if not genai_client:
        await websocket.close(code=1011, reason="Server configuration error: Gemini client not initialized.")
        return

    # Configuration inspired by the cookbook example for optimal performance and features
    live_config = LiveConnectConfig(
        response_modalities=["AUDIO", "TEXT"],
        input_audio_transcription=AudioTranscriptionConfig(),
        output_audio_transcription=AudioTranscriptionConfig(),
        speech_config=SpeechConfig(
            voice_config=VoiceConfig(
                prebuilt_voice_config=PrebuiltVoiceConfig(voice_name="Zephyr")
            )
        ),
        enable_affective_dialog=True,
    )

    try:
        # Establish connection to Gemini Live API
        async with genai_client.aio.live.connect(model=MODEL_ID, config=live_config) as session:
            print("Gemini Live API session started.")
            
            # Use asyncio.TaskGroup for robust concurrent task management, inspired by the cookbook
            async with asyncio.TaskGroup() as tg:
                
                # Task 1: Receive audio from the client and send it to Gemini
                async def receive_from_client():
                    while True:
                        audio_chunk = await websocket.receive_bytes()
                        await session.send_realtime_input(audio_content=audio_chunk)

                # Task 2: Receive responses from Gemini and send them to the client
                async def receive_from_gemini():
                    async for response in session.receive():
                        if response.audio:
                            await websocket.send_bytes(response.audio)
                        if response.text:
                            # Send transcript as a JSON string for easy parsing on the frontend
                            payload = f'{{"type": "transcript", "data": "{response.text}"}}'
                            await websocket.send_text(f"TXT:{payload}")

                tg.create_task(receive_from_client())
                tg.create_task(receive_from_gemini())

    except WebSocketDisconnect:
        print("Client disconnected.")
    except ExceptionGroup as eg:
        print(f"An error occurred in the TaskGroup: {eg}")
        traceback.print_exception(eg)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        traceback.print_exception(e)
    finally:
         if not websocket.client_state.DISCONNECTED:
             await websocket.close(code=1011, reason="Server-side error.")
