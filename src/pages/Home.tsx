
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Target, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">FluentNow</h1>
          <p className="text-indigo-600">Your AI Speaking Coach</p>
        </div>

        {/* Daily Progress Card */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Today's Progress</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                5 day streak 🔥
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Speaking Minutes</span>
                <span>12 / 15</span>
              </div>
              <Progress value={80} className="h-2" />
              <p className="text-xs text-gray-500">3 more minutes to complete your daily goal!</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/speaking-gym">
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <Mic className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">Speaking Gym</h3>
                <p className="text-xs opacity-90">Practice with AI</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/progress">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">Progress</h3>
                <p className="text-xs opacity-90">Track growth</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Current Learning Path */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Current Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Café Conversations</h4>
                  <p className="text-sm text-gray-600">Spanish • Intermediate</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700">Day 3/7</Badge>
              </div>
              <Progress value={43} className="h-2" />
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Highlight */}
        <Card className="bg-gradient-to-r from-orange-400 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <div className="flex-1">
                <h4 className="font-semibold">Join Today's Challenge</h4>
                <p className="text-sm opacity-90">"Order like a local" - 2,847 learners participating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
