
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, RotateCcw, Play, Coffee, Briefcase, Plane, Zap, Star } from "lucide-react";
import { useState, useEffect } from "react";

const SpeakingGym = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [perfectPhrases, setPerfectPhrases] = useState<string[]>([]);
  const [coachExpression, setCoachExpression] = useState("😊");

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
    setIsRecording(!isRecording);
    if (!isRecording) {
      setCoachExpression("👂");
      // Simulate live performance feedback
      const interval = setInterval(() => {
        setPerformanceScore(prev => Math.min(prev + Math.random() * 20, 95));
      }, 500);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsRecording(false);
        setCoachExpression("😄");
        setPerfectPhrases(["por favor", "café con leche"]);
      }, 3000);
    }
  };

  useEffect(() => {
    if (selectedScenario) {
      setPerformanceScore(0);
      setPerfectPhrases([]);
      setCoachExpression("😊");
    }
  }, [selectedScenario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-bold text-purple-900 mb-2">Speaking Gym</h1>
          <p className="text-purple-600">Choose your practice scenario</p>
        </div>

        {/* Scenario Selection */}
        {!selectedScenario && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Today's Workouts</h2>
            {scenarios.map((scenario) => {
              const IconComponent = scenario.icon;
              return (
                <Card 
                  key={scenario.id}
                  className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]"
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`${scenario.color} p-3 rounded-full text-white`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
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
        )}

        {/* Active Session */}
        {selectedScenario && (
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={() => setSelectedScenario(null)}
              className="mb-4"
            >
              ← Back to scenarios
            </Button>

            {/* Live Performance Meter */}
            {isRecording && (
              <Card className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                <CardContent className="p-4">
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

            {/* Expressive AI Coach Card */}
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl transition-all duration-500">
                    {coachExpression}
                  </div>
                  <div>
                    <div className="font-semibold">Maria - Your AI Coach</div>
                    <div className="text-sm opacity-75">
                      {isRecording ? "Listening carefully..." : "Ready to chat!"}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-white/90">
                      "¡Hola! I'm your barista today. What would you like to order?"
                    </p>
                  </div>
                  
                  {/* Perfect Phrases Display */}
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
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Replay
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recording Interface */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="relative">
                    <Button
                      size="lg"
                      className={`w-20 h-20 rounded-full transition-all duration-300 ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
                          : 'bg-green-500 hover:bg-green-600 hover:scale-105'
                      }`}
                      onClick={handleStartRecording}
                    >
                      <Mic className="w-8 h-8" />
                    </Button>
                    {isRecording && (
                      <div className="absolute -inset-4 border-4 border-red-300 rounded-full animate-ping"></div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {isRecording ? "Listening... speak clearly!" : "Tap to speak"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Try: "Hola, me gustaría un café con leche, por favor"
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

            {/* Enhanced Feedback Card */}
            <Card className="bg-green-50 border-green-200 shadow-lg">
              <CardContent className="p-4">
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
