
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, RotateCcw, Play, Coffee, Briefcase, Plane } from "lucide-react";
import { useState } from "react";

const SpeakingGym = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

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
  };

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
                  className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
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

            {/* AI Coach Card */}
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    🤖
                  </div>
                  Maria - Your AI Coach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90">
                  "¡Hola! I'm your barista today. What would you like to order?"
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3 bg-white/20 text-white hover:bg-white/30"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Replay
                </Button>
              </CardContent>
            </Card>

            {/* Recording Interface */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="relative">
                    <Button
                      size="lg"
                      className={`w-20 h-20 rounded-full ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                      onClick={handleStartRecording}
                    >
                      <Mic className="w-8 h-8" />
                    </Button>
                    {isRecording && (
                      <div className="absolute -inset-2 border-4 border-red-300 rounded-full animate-ping"></div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {isRecording ? "Listening..." : "Tap to speak"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Try: "Hola, me gustaría un café con leche, por favor"
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Hint
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Card */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Pronunciation: Great!</span>
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
