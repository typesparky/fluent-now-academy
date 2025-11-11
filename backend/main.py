import os
import asyncio
import traceback
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from google.genai.types import LiveConnectConfig, AudioTranscriptionConfig, SpeechConfig, VoiceConfig, PrebuiltVoiceConfig
from google import genai
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import User
from auth import get_password_hash, authenticate_user, create_access_token, get_current_user

# --- Pydantic Schemas ---
class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Configuration ---
PROJECT_ID = os.environ.get("GCP_PROJECT")
LOCATION = os.environ.get("GCP_REGION", "us-central1")
MODEL_ID = "gemini-live-2.5-flash-preview-native-audio"

# --- Initialization ---
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://94.130.177.80", "http://localhost", "http://127.0.0.1"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai_client = None

@app.on_event("startup")
def startup_event():
    """Initializes the GenAIClient and creates database tables on application startup."""
    global genai_client
    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")

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

@app.post("/users/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and create user
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login and get access token."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user info."""
    return current_user

@app.websocket("/conversation")
async def conversation_endpoint(websocket: WebSocket):
    """Handles the real-time, bidirectional audio conversation using Gemini Live API."""
    await websocket.accept()
    print("Client connected to WebSocket.")

    if not genai_client:
        print("Gemini client not available - running in demo mode")
        # Demo mode: Echo back simple responses for testing
        try:
            await websocket.send_text('TXT:{"type": "transcript", "data": "Hello! I\'m your AI coach. Try speaking to me!"}')
            await websocket.send_text('TXT:{"type": "transcript", "data": "I can see you\'re testing the connection. Great job!"}')

            # Keep connection alive for testing
            while True:
                try:
                    # Wait for client messages but don't process them in demo mode
                    await websocket.receive_text()
                    await websocket.send_text('TXT:{"type": "transcript", "data": "I heard you! Keep practicing!"}')
                except Exception:
                    break
        except Exception as e:
            print(f"Demo mode error: {e}")
        finally:
            if not websocket.client_state.DISCONNECTED:
                await websocket.close(code=1000, reason="Demo session ended.")
        return

    # Full Gemini AI mode (when GCP is configured)
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
    except Exception as eg:
        print(f"An error occurred in the TaskGroup: {eg}")
        traceback.print_exception(eg)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        traceback.print_exception(e)
    finally:
         if not websocket.client_state.DISCONNECTED:
             await websocket.close(code=1011, reason="Server-side error.")
