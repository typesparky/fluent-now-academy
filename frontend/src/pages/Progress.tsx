import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { TrendingUp, Award, Calendar, Mic, Clock, Share, Trophy, Zap } from "lucide-react";

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
    {
      title: "First Conversation",
      description: "Completed your first AI chat",
      earned: true,
      icon: "🎯"
    },
    {
      title: "5-Day Streak",
      description: "Practice 5 days in a row",
      earned: true,
      icon: "🔥"
    },
    {
      title: "Pronunciation Master",
      description: "Perfect pronunciation score",
      earned: false,
      icon: "🎤"
    },
    {
      title: "Café Expert",
      description: "Master café conversations",
      earned: true,
      icon: "☕"
    },
  ];

  const skillsData = [
    { skill: "Pronunciation", value: 85, color: "text-green-600" },
    { skill: "Fluency", value: 62, color: "text-blue-600" },
    { skill: "Vocabulary", value: 75, color: "text-purple-600" },
    { skill: "Confidence", value: 68, color: "text-orange-600" },
  ];

  const handleShareAchievement = (achievement: any) => {
    // Simulate sharing functionality
    console.log(`Sharing achievement: ${achievement.title}`);
  };

  return (
    <div className="min-h-fix progressscreen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-bold text-green-900 mb-2">Your Progress</h1>
          <p className="text-green-600">Track your speaking journey</p>
        </div>

        {/* Level Up Banner */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 animate-bounce" />
              <div className="flex-1">
                <h4 className="font-bold text-lg">Almost B2! 🚀</h4>
                <p className="text-sm opacity-90">You're 78% of the way to Intermediate High level</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30"
              >
                View
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1 flex items-center justify-center gap-1">
                73 <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Mic className="w-4 h-4" />
                Minutes Spoken
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1 flex items-center justify-center gap-1">
                5 <span className="text-orange-500">🔥</span>
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4" />
                Day Streak
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Radar Chart Visualization */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Skills Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Level</span>
                <Badge className="bg-blue-100 text-blue-700 font-semibold px-3 py-1">
                  B1+ - Upper Intermediate
                </Badge>
              </div>

              {/* Skills breakdown with enhanced visuals */}
              <div className="space-y-3">
                {skillsData.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.skill}</span>
                      <span className={`font-bold ${skill.color}`}>{skill.value}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={skill.value} className="h-3" />
                      {skill.value > 80 && (
                        <div className="absolute right-2 top-0 text-yellow-500 text-sm">⭐</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-600 bg-green-50 p-2 rounded-lg">
                📈 +12% improvement this week! Keep up the amazing work!
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
                    className={`w-6 rounded-t transition-all duration-500 ${
                      day.completed ? 'bg-gradient-to-t from-green-500 to-green-400' : 'bg-gray-200'
                    }`}
                    style={{ height: `${Math.max(day.minutes * 2, 4)}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
              💪 73 minutes this week • Goal: 105 minutes
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Achievements */}
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
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02] ${
                    achievement.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      achievement.earned ? 'bg-yellow-500 text-white' : 'bg-gray-300'
                    }`}
                  >
                    {achievement.earned ? achievement.icon : '🔒'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareAchievement(achievement)}
                      className="hover:scale-105 transition-transform"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
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