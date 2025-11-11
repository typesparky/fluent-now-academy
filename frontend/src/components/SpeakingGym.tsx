import { useState, useRef, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

// Use environment variable for WebSocket URL
const wsUrl = import.meta.env.VITE_BACKEND_WEBSOCKET_URL || '/conversation';
const BACKEND_WEBSOCKET_URL = wsUrl.startsWith('ws') ? wsUrl : `ws://${window.location.host}${wsUrl}`;

export const SpeakingGym = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState<string[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioQueueRef = useRef<Blob[]>([]);
    const isPlayingRef = useRef<boolean>(false);

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        BACKEND_WEBSOCKET_URL, {
            onOpen: () => console.log('WebSocket connection established.'),
            shouldReconnect: (_closeEvent) => true,
        }
    );

    // Effect to handle incoming messages (audio and text)
    useEffect(() => {
        if (lastMessage !== null) {
            if (typeof lastMessage.data === 'string' && lastMessage.data.startsWith('TXT:')) {
                try {
                    const jsonPayload = JSON.parse(lastMessage.data.substring(4));
                    if (jsonPayload.type === 'transcript') {
                         setTranscript(prev => [...prev, jsonPayload.data]);
                    }
                } catch (e) {
                    console.error("Failed to parse transcript JSON:", e);
                }
            } else if (lastMessage.data instanceof Blob) {
                audioQueueRef.current.push(lastMessage.data);
                playNextInQueue();
            }
        }
    }, [lastMessage]);

    const playNextInQueue = async () => {
        if (isPlayingRef.current || audioQueueRef.current.length === 0) {
            return;
        }

        isPlayingRef.current = true;
        const blob = audioQueueRef.current.shift();

        if (blob) {
            try {
                if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                    audioContextRef.current = new AudioContext();
                }
                if (audioContextRef.current.state === 'suspended') {
                    await audioContextRef.current.resume();
                }
                const arrayBuffer = await blob.arrayBuffer();
                if (arrayBuffer.byteLength > 0) {
                    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
                    const source = audioContextRef.current.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContextRef.current.destination);
                    source.onended = () => {
                        isPlayingRef.current = false;
                        playNextInQueue();
                    };
                    source.start();
                } else {
                     isPlayingRef.current = false;
                     playNextInQueue();
                }
            } catch (error) {
                console.error("Error playing audio:", error);
                isPlayingRef.current = false;
                playNextInQueue();
            }
        } else {
             isPlayingRef.current = false;
        }
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0 && readyState === ReadyState.OPEN) {
                        sendMessage(event.data);
                    }
                };
                mediaRecorder.start(300); // Send audio chunks every 300ms
                setIsRecording(true);
                setTranscript([]);
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Could not access microphone. Please ensure you have given permission.");
                streamRef.current = null;
            }
        }
    };

    const connectionStatus = ReadyState[readyState];

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
            <h2>Speaking Gym</h2>
            <p>Connection Status: <strong>{connectionStatus}</strong></p>
            <button onClick={handleToggleRecording} disabled={readyState !== ReadyState.OPEN} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                {isRecording ? 'Stop Speaking' : 'Tap to Speak'}
            </button>
            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', minHeight: '100px', textAlign: 'left' }}>
                {transcript.map((line, index) => <p key={index}>{line}</p>)}
                {transcript.length === 0 && <p style={{color: '#888'}}>Transcript will appear here...</p>}
            </div>
        </div>
    );
};
