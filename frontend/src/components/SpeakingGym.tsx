import React, { useState, useRef, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const BACKEND_URL = 'ws://127.0.0.1:8000'; // Local dev URL

export const SpeakingGym = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState<string[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        `${BACKEND_URL}/conversation`, {
            onOpen: () => console.log('WebSocket connection established.'),
            shouldReconnect: () => true,
        }
    );

    useEffect(() => {
        if (lastMessage !== null) {
            if (typeof lastMessage.data === 'string' && lastMessage.data.startsWith('TXT:')) {
                const jsonPayload = JSON.parse(lastMessage.data.substring(4));
                setTranscript(prev => [...prev, jsonPayload.data]);
            } else if (lastMessage.data instanceof Blob) {
                playAudio(lastMessage.data);
            }
        }
    }, [lastMessage]);

    const playAudio = async (blob: Blob) => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }
        const arrayBuffer = await blob.arrayBuffer();
        if (arrayBuffer.byteLength > 0 && audioContextRef.current.state !== 'closed') {
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.start();
        }
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && readyState === ReadyState.OPEN) {
                    sendMessage(event.data);
                }
            };
            mediaRecorder.start(300);
            setIsRecording(true);
            setTranscript([]);
        }
    };

    return (
        <div>
            <h2>Speaking Gym</h2>
            <p>Status: {ReadyState[readyState]}</p>
            <button onClick={handleToggleRecording} disabled={readyState !== ReadyState.OPEN}>
                {isRecording ? 'Stop Speaking' : 'Tap to Speak'}
            </button>
            <div>
                {transcript.map((line, index) => <p key={index}>{line}</p>)}
            </div>
        </div>
    );
};