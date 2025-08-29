# FluentNow - Real-time Language Learning Platform

A modern language learning application that uses Google's Gemini Live API for real-time conversational AI practice.

## Features

- 🎤 Real-time speech-to-speech conversation
- 🤖 Powered by Google's Gemini Live API
- ⚡ WebSocket-based communication for low-latency interaction
- 🎯 Speaking practice with instant feedback
- 📱 Modern React frontend with TypeScript
- 🐳 Docker-ready backend deployment

## Architecture

### Backend (Python/FastAPI)
- **Framework**: FastAPI with WebSocket support
- **AI Integration**: Google Gemini Live API for real-time audio processing
- **Deployment**: Docker container with Gunicorn
- **Real-time Communication**: WebSocket endpoint for audio streaming

### Frontend (React/TypeScript)
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Real-time Communication**: WebSocket client
- **Audio Processing**: Web Audio API for recording and playback

## Quick Start

### Prerequisites
- Node.js (22.12.0 or higher)
- Python 3.9+
- Google Cloud Project with Vertex AI enabled

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variables:
```bash
export GCP_PROJECT=your-project-id
export GCP_REGION=us-central1
```

4. Run the server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Docker Deployment

### Backend
```bash
cd backend
docker build -t fluentnow-backend .
docker run -p 8080:8080 -e GCP_PROJECT=your-project-id fluentnow-backend
```

## Environment Variables

### Backend
- `GCP_PROJECT`: Your Google Cloud Project ID
- `GCP_REGION`: Google Cloud region (default: us-central1)

## API Endpoints

### HTTP
- `GET /`: Health check endpoint

### WebSocket
- `WS /conversation`: Real-time conversation endpoint

## Project Structure

```
fluentnow-mvp/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Docker configuration
│   └── .gitignore          # Git ignore rules
├── frontend/
│   ├── src/
│   │   └── components/
│   │       └── SpeakingGym.tsx  # Main speaking component
│   └── package.json        # Node.js dependencies
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Technologies Used

- **Backend**: Python, FastAPI, WebSockets, Google Gemini Live API
- **Frontend**: React, TypeScript, Vite, Web Audio API
- **Deployment**: Docker, Gunicorn
- **Real-time Communication**: WebSockets