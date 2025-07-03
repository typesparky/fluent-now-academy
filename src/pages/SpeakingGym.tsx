import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, RotateCcw, Play, Coffee, Briefcase, Plane, Zap, Star, ChevronLeft, MessageCircle, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const SpeakingGym = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [perfectPhrases, setPerfectPhrases] = useState<string[]>([]);
  const [coachExpression, setCoachExpression] = useState("😊");
  const isMobile = useIsMobile();

  const scenarios = [
    {
      id: "cafe",
      title: "Coffee Shop Order",
      description: "Practice ordering your favorite drink",
      icon: Coffee,
      difficulty: "Beginner",
      color: "bg-amber-500"
    },
    {
      id: "business",
      title: "Business Meeting",
      description: "Introduce yourself professionally",
      icon: Briefcase,
      difficulty: "Intermediate",
      color: "bg-blue-600"
    },
    {
      id: "travel",
      title: "Airport Check-in",
      description: "Navigate travel conversations",
      icon: Plane,
      difficulty: "Beginner",
      color: "bg-green-600"
    }
  ];

  const handleStartRecording = () => {
    if (!isRecording && !isProcessing) {
      setIsRecording(true);
      setCoachExpression("👂");
      const interval = setInterval(() => {
        setPerformanceScore(prev => Math.min(prev + Math.random() * 20, 95));
      }, 500);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsRecording(false);
        setIsProcessing(true);
        setCoachExpression("🤔");
        
        setTimeout(() => {
          setIsProcessing(false);
          setCoachExpression("😄");
          setPerfectPhrases(["por favor", "café con leche"]);
        }, 2000);
      }, 3000);
    }
  };

  useEffect(() => {
    if (selectedMode) {
      setPerformanceScore(0);
      setPerfectPhrases([]);
      setCoachExpression("😊");
      setIsRecording(false);
      setIsProcessing(false);
    }
  }, [selectedMode]);

  const AudioWaveform = () => (
    <div className="flex items-center justify-center gap-1">
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
    <div className="flex items-center justify-center gap-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-white rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className={`mx-auto space-y-6 ${isMobile ? 'max-w-md' : 'max-w-4xl'}`}>
        {/* Header */}
        <div className="text-center pt-6 pb-2">
          <h1 className="text-2xl font-semibold text-purple-900 mb-1">Speaking Gym</h1>
          <p className="text-purple-600 font-light">Choose your practice mode</p>
        </div>

        {/* Selection Screen */}
        {!selectedMode && (
          <div className={`space-y-6 ${!isMobile ? 'grid grid-cols-2 gap-6' : ''}`}>
            {/* FluentChat - Main Option */}
            <Card 
              className={`bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-[1.02] border-0 ${!isMobile ? 'col-span-2' : ''}`}
              onClick={() => setSelectedMode("fluent-chat")}
            >
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">FluentChat</h2>
                    <p className="text-white/90 text-lg mb-4">
                      Have a natural conversation about anything that interests you
                    </p>
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-1 text-sm">
                      🌟 Most Popular
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Targeted Workouts */}
            <div className={!isMobile ? 'col-span-2' : ''}>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Targeted Workouts</h3>
              </div>
              <div className={`grid gap-3 ${!isMobile ? 'grid-cols-3' : ''}`}>
                {scenarios.map((scenario) => {
                  const IconComponent = scenario.icon;
                  return (
                    <Card 
                      key={scenario.id}
                      className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-[1.01]"
                      onClick={() => setSelectedMode(scenario.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`${scenario.color} p-3 rounded-full text-white`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{scenario.title}</h4>
                            <p className="text-sm text-gray-600">{scenario.description}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {scenario.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Active Session */}
        {selectedMode && (
          <div className={`space-y-6 ${!isMobile ? 'grid grid-cols-2 gap-6' : ''}`}>
            <div className={!isMobile ? 'col-span-2' : ''}>
              <Button
                variant="outline"
                onClick={() => setSelectedMode(null)}
                className="mb-4 hover:scale-105 transition-transform"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            {/* Live Performance Meter */}
            {isRecording && (
              <Card className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">Live Performance</span>
                  </div>
                  <Progress 
                    value={performanceScore} 
                    className="h-3 bg-white/20" 
                  />
                  <div className="text-sm mt-2 opacity-90">
                    {performanceScore > 80 ? "Excellent fluency! 🔥" : 
                     performanceScore > 60 ? "Good pronunciation! 👍" : 
                     "Keep going, you're doing great! 💪"}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Coach */}
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl transition-all duration-500">
                    {coachExpression}
                  </div>
                  <div>
                    <div className="font-semibold">Maria - Your AI Coach</div>
                    <div className="text-sm opacity-75">
                      {isRecording ? "Listening carefully..." : 
                       isProcessing ? "Thinking about your response..." : 
                       "Ready to chat!"}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="text-white/90">
                      {selectedMode === "fluent-chat" 
                        ? "¡Hola! What would you like to talk about today? I'm here to help you practice!"
                        : "¡Hola! I'm your barista today. What would you like to order?"}
                    </p>
                  </div>
                  
                  {/* Perfect Phrases */}
                  {perfectPhrases.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-300" />
                        Perfect Phrases:
                      </div>
                      {perfectPhrases.map((phrase, index) => (
                        <div key={index} className="bg-yellow-400/20 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          <span className="text-yellow-300">✨</span>
                          "{phrase}"
                          <Badge variant="secondary" className="bg-yellow-500 text-white text-xs">
                            💯
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 text-white hover:bg-white/30 hover:scale-105 transition-transform"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Replay
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recording Interface */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="relative">
                    <Button
                      size="lg"
                      className={`w-20 h-20 rounded-full transition-all duration-300 shadow-xl relative overflow-hidden ${
                        isRecording 
                          ? 'bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 scale-110' 
                          : isProcessing
                          ? 'bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700'
                          : 'bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 hover:scale-105 animate-pulse'
                      } active:scale-95`}
                      onClick={handleStartRecording}
                      disabled={isProcessing}
                    >
                      {isRecording ? (
                        <AudioWaveform />
                      ) : isProcessing ? (
                        <ProcessingSpinner />
                      ) : (
                        <Mic className="w-8 h-8" />
                      )}
                    </Button>
                    
                    {!isRecording && !isProcessing && (
                      <div className="absolute -inset-4 bg-green-400/30 rounded-full animate-ping"></div>
                    )}
                    
                    {isRecording && (
                      <div className="absolute -inset-4 border-4 border-red-300 rounded-full animate-ping"></div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {isRecording ? "Listening... speak clearly!" : 
                       isProcessing ? "Processing your response..." :
                       "Tap to speak"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedMode === "fluent-chat" 
                        ? "Talk about anything - your hobbies, dreams, or daily life"
                        : "Try: 'Hola, me gustaría un café con leche, por favor'"}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                      <Play className="w-4 h-4 mr-2" />
                      Hint
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="bg-green-50 border-green-200 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800 flex items-center gap-1">
                    Pronunciation: Great! 
                    <Star className="w-4 h-4 text-yellow-500" />
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Your "por favor" sounds very natural. Try emphasizing the "café" a bit more.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingGym;
