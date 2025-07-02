
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Target, Calendar, Mic, Clock } from "lucide-react";

const ProgressPage = () => {
  const weeklyData = [
    { day: "Mon", minutes: 15, completed: true },
    { day: "Tue", minutes: 20, completed: true },
    { day: "Wed", minutes: 12, completed: true },
    { day: "Thu", minutes: 18, completed: true },
    { day: "Fri", minutes: 8, completed: false },
    { day: "Sat", minutes: 0, completed: false },
    { day: "Sun", minutes: 0, completed: false },
  ];

  const achievements = [
    { title: "First Conversation", description: "Completed your first AI chat", earned: true },
    { title: "5-Day Streak", description: "Practice 5 days in a row", earned: true },
    { title: "Pronunciation Master", description: "Perfect pronunciation score", earned: false },
    { title: "Café Expert", description: "Master café conversations", earned: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-bold text-green-900 mb-2">Your Progress</h1>
          <p className="text-green-600">Track your speaking journey</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">73</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Mic className="w-4 h-4" />
                Minutes Spoken
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">5</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4" />
                Day Streak
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Speaking Confidence */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Speaking Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Score</span>
                <Badge className="bg-blue-100 text-blue-700">B1 - Intermediate</Badge>
              </div>
              <Progress value={68} className="h-3" />
              <div className="text-xs text-gray-600">
                68% confident • +12% this week
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Pronunciation</span>
                  <span className="text-green-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Fluency</span>
                  <span className="text-blue-600">62%</span>
                </div>
                <Progress value={62} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Vocabulary</span>
                  <span className="text-purple-600">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end h-24 mb-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-6 ${
                      day.completed ? 'bg-green-500' : 'bg-gray-200'
                    } rounded-t`}
                    style={{ height: `${Math.max(day.minutes * 2, 4)}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              73 minutes this week • Goal: 105 minutes
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    achievement.earned ? 'bg-yellow-50' : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-yellow-500 text-white' : 'bg-gray-300'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
