import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Mic, ChevronLeft, Volume2, RotateCcw, Play, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';

const BACKEND_URL = import.meta.env.VITE_BACKEND_WEBSOCKET_URL || 'ws://127.0.0.1:8000';

// Helper components for visual feedback
const AudioWaveform = () => (
  <div className="flex items-center justify-center gap-1 h-full">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="w-1 bg-white rounded-full animate-pulse"
        style={{
          height: `${Math.random() * 16 + 8}px`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: '0.6s'
        }}
      />
    ))}
  </div>
);

const ProcessingSpinner = () => (
  <div className="flex items-center justify-center gap-1 h-full">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="w-2 h-2 bg-white rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);


const SpeakingGym = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [coachExpression, setCoachExpression] = useState("😊");
  const [coachMessage, setCoachMessage] = useState("Ready to chat!");
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<Blob[]>([]);
  const isPlayingRef = useRef<boolean>(false);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
      `${BACKEND_URL}/conversation`, {
          onOpen: () => console.log('WebSocket connection established.'),
          onClose: () => console.log('WebSocket connection closed.'),
          shouldReconnect: () => true,
      }
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      setCoachMessage("Ready to chat!");
      setCoachExpression("😊");
    } else if (readyState === ReadyState.CONNECTING) {
      setCoachMessage("Connecting to coach...");
      setCoachExpression("🤔");
    } else {
      setCoachMessage("Connection lost. Retrying...");
      setCoachExpression("😥");
    }
  }, [readyState]);

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
      if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
      isPlayingRef.current = true;
      const blob = audioQueueRef.current.shift();
      if (blob) {
          try {
              if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                  audioContextRef.current = new AudioContext();
              }
              const arrayBuffer = await blob.arrayBuffer();
              const decodedAudio = await audioContextRef.current.decodeAudioData(arrayBuffer);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = decodedAudio;
              source.connect(audioContextRef.current.destination);
              source.onended = () => {
                  isPlayingRef.current = false;
                  playNextInQueue();
              };
              source.start();
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
          setIsRecording(false);
          setCoachExpression("🤔");
          setCoachMessage("Processing your response...");
      } else {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              const mediaRecorder = new MediaRecorder(stream);
              mediaRecorderRef.current = mediaRecorder;

              mediaRecorder.ondataavailable = (event) => {
                  if (event.data.size > 0 && readyState === ReadyState.OPEN) {
                      sendMessage(event.data);
                  }
              };
              mediaRecorder.start(500); // Send audio chunks every 500ms
              setIsRecording(true);
              setTranscript([]);
              setCoachExpression("👂");
              setCoachMessage("Listening carefully...");
          } catch (err) {
              console.error("Error accessing microphone:", err);
              alert("Could not access microphone. Please ensure you have given permission.");
          }
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl transition-all duration-500">
                  {coachExpression}
                </div>
                <div>
                  <div className="font-semibold text-lg">Maria - Your AI Coach</div>
                  <div className="text-sm opacity-80">{coachMessage}</div>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <div className="relative mx-auto w-24 h-24">
                <Button
                  size="lg"
                  className={`w-24 h-24 rounded-full transition-all duration-300 shadow-xl relative overflow-hidden ${
                    isRecording
                      ? 'bg-gradient-to-b from-red-400 to-red-600 scale-110'
                      : 'bg-gradient-to-b from-green-400 to-green-600 hover:scale-105'
                  } active:scale-95`}
                  onClick={handleToggleRecording}
                  disabled={readyState !== ReadyState.OPEN}
                >
                  {isRecording ? <AudioWaveform /> : <Mic className="w-10 h-10" />}
                </Button>
            </div>
            <p className="font-medium text-gray-900">
                {isRecording ? "Tap to Stop" : "Tap to Speak"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 space-y-2 min-h-[100px]">
                {transcript.map((line, index) => <p key={index} className="text-gray-700">{line}</p>)}
                {transcript.length === 0 && <p className="text-gray-500">Transcript will appear here...</p>}
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeakingGym;