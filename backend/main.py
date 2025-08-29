import os
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from google.genai.types import LiveConnectConfig, AudioTranscriptionConfig
from google.genai import Client as GenAIClient

PROJECT_ID = os.environ.get("GCP_PROJECT")
LOCATION = os.environ.get("GCP_REGION", "us-central1")
MODEL_ID = "gemini-live-2.5-flash-preview-native-audio"

app = FastAPI()
genai_client = None

@app.on_event("startup")
def startup_event():
    global genai_client
    if PROJECT_ID:
        try:
            genai_client = GenAIClient(vertexai=True, project=PROJECT_ID, location=LOCATION)
            print("Google Gen AI Client initialized successfully.")
        except Exception as e:
            print(f"Error initializing Google Gen AI Client: {e}")
    else:
        print("GCP_PROJECT environment variable not set. Gemini client not initialized.")

@app.get("/")
async def http_handler():
    return {"status": "FluentNow Backend is running", "gemini_client_initialized": genai_client is not None}

@app.websocket("/conversation")
async def conversation_endpoint(websocket: WebSocket):
    await websocket.accept()
    if not genai_client:
        await websocket.close(code=1011, reason="Server configuration error.")
        return

    live_config = LiveConnectConfig(
        response_modalities=["AUDIO"],
        input_audio_transcription=AudioTranscriptionConfig(),
        output_audio_transcription=AudioTranscriptionConfig(),
        enable_affective_dialog=True,
    )

    try:
        async with genai_client.aio.live.connect(model=MODEL_ID, config=live_config) as session:
            async def receive_from_client():
                while True:
                    audio_chunk = await websocket.receive_bytes()
                    await session.send_realtime_input(audio_content=audio_chunk)

            async def receive_from_gemini():
                async for response in session.receive():
                    if response.audio:
                        await websocket.send_bytes(response.audio)
                    if response.text:
                        await websocket.send_text(f'TXT:{{"type": "transcript", "data": "{response.text}"}}')

            await asyncio.gather(receive_from_client(), receive_from_gemini())
    except Exception as e:
        print(f"An error occurred: {e}")
        if not websocket.client_state.DISCONNECTED:
             await websocket.close(code=1011)