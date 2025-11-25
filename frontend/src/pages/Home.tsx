import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Mic, Target, TrendingUp, Users, Flame, Gift, Share, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../integrations/supabase/client";
import WeeklyActivityChart from "../components/WeeklyActivityChart";

interface Profile {
  username: string;
  current_streak: number;
  daily_goal_minutes: number;
  total_speaking_minutes: number;
  level: number;
}

const Home = () => {
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    setStreakAnimation(true);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfile(data);
      }
    };

    const fetchTodayProgress = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_progress')
        .select('speaking_minutes')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      
      if (data) {
        setTodayMinutes(data.speaking_minutes);
        const progress = (data.speaking_minutes / (profile?.daily_goal_minutes || 10)) * 100;
        setTimeout(() => setProgressValue(Math.min(progress, 100)), 500);
      }
    };

    fetchProfile();
    fetchTodayProgress();
  }, [user, profile?.daily_goal_minutes]);

  const remainingMinutes = Math.max(0, (profile?.daily_goal_minutes || 10) - todayMinutes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className={`mx-auto space-y-6 ${isMobile ? 'max-w-md' : 'max-w-4xl'}`}>
        {/* Header */}
        <div className="text-center pt-6 pb-2">
          <h1 className="text-2xl font-semibold text-foreground mb-1 flex items-center justify-center gap-2">
            Hi, {profile?.username || 'Learner'}
            <div className="flex items-center gap-1">
              <Flame className={`w-6 h-6 text-orange-500 ${streakAnimation ? 'animate-pulse' : ''}`} />
              <span className="text-lg font-bold text-orange-600">{profile?.current_streak || 0}</span>
            </div>
          </h1>
          <p className="text-muted-foreground font-light">You're crushing it today</p>
        </div>

        <div className={`grid gap-6 ${!isMobile ? 'grid-cols-2' : ''}`}>
          {/* Referral Hub */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl border-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 animate-bounce" />
                <div className="flex-1">
                  <h4 className="font-bold text-lg">Get FluentNow FREE! 🎁</h4>
                  <p className="text-sm opacity-90">Invite a friend and you both get a free month of Premium</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 text-white hover:bg-white/30 font-semibold hover:scale-105 transition-transform"
                >
                  <Share className="w-4 h-4 mr-1" />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Progress */}
          <Card className="bg-card shadow-lg">
            <CardHeader className="pb-3 px-6 pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Today's Progress</CardTitle>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-3 py-1">
                  <Flame className={`w-4 h-4 mr-1 text-orange-500 ${streakAnimation ? 'animate-pulse' : ''}`} />
                  {profile?.current_streak || 0} day streak
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Speaking Minutes</span>
                  <span>{todayMinutes} / {profile?.daily_goal_minutes || 10}</span>
                </div>
                <Progress
                  value={progressValue}
                  className="h-3 transition-all duration-1000 ease-out"
                />
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  <p className="text-xs text-muted-foreground">
                    {remainingMinutes > 0 
                      ? `${remainingMinutes} more minutes to complete your daily goal!`
                      : 'Daily goal completed! 🎉'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card className="bg-card shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyActivityChart />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className={`grid gap-4 ${!isMobile ? 'grid-cols-4' : 'grid-cols-2'}`}>
          <Link to="/speaking-gym" className={!isMobile ? 'col-span-2' : ''}>
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:shadow-xl transition-all cursor-pointer hover:scale-105 shadow-lg h-full">
              <CardContent className="p-5 text-center">
                <Mic className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">FluentChat</h3>
                <p className="text-xs opacity-90">General conversation</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/progress">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all cursor-pointer hover:scale-105 shadow-lg h-full">
              <CardContent className="p-5 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">Progress</h3>
                <p className="text-xs opacity-90">Track growth</p>
              </CardContent>
            </Card>
          </Link>

          {!isMobile && (
            <Link to="/social">
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white hover:shadow-xl transition-all cursor-pointer hover:scale-105 shadow-lg h-full">
                <CardContent className="p-5 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-semibold">Community</h3>
                  <p className="text-xs opacity-90">Friends & ranks</p>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        {/* Current Learning Path */}
        <Card className="bg-card shadow-lg">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Current Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Café Conversations</h4>
                  <p className="text-sm text-muted-foreground">Spanish • Intermediate</p>
                </div>
                <Badge variant="secondary">Day 3/7</Badge>
              </div>
              <Progress value={43} className="h-2" />
              <Link to="/speaking-gym">
                <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:scale-[1.02] transition-all shadow-md">
                  Continue Learning
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Live Community Challenge */}
        <Card className="bg-gradient-to-r from-orange-400 to-pink-500 text-white relative overflow-hidden shadow-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Users className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                  <div className="w-full h-full bg-red-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="bg-red-500 text-white text-xs px-2 py-0.5 animate-pulse">
                    LIVE
                  </Badge>
                  <h4 className="font-semibold">Today's Challenge</h4>
                </div>
                <p className="text-sm opacity-90">"Order like a local" - 2,847 learners are practicing in Paris cafés right now!</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 bg-white/20 text-white hover:bg-white/30 font-semibold hover:scale-105 transition-transform"
            >
              Join Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
