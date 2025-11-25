import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../components/AuthContext';
import { Trophy, Users, Activity, UserPlus } from 'lucide-react';
import { Progress } from '../components/ui/progress';

interface Profile {
  id: string;
  username: string;
  level: number;
  xp: number;
  current_streak: number;
  total_speaking_minutes: number;
}

const Social = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [friends, setFriends] = useState<Profile[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch leaderboard
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(10);
      setLeaderboard(data || []);
    };

    // Fetch friends
    const fetchFriends = async () => {
      const { data } = await supabase
        .from('friends')
        .select(`
          friend_id,
          profiles:friend_id (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      setFriends(data?.map(f => f.profiles).filter(Boolean) || []);
    };

    // Fetch activity feed
    const fetchActivities = async () => {
      const { data } = await supabase
        .from('activity_feed')
        .select(`
          *,
          profiles (username)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      setActivities(data || []);
    };

    fetchLeaderboard();
    fetchFriends();
    fetchActivities();
  }, [user]);

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Community</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Top Learners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((profile, index) => (
                <div
                  key={profile.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    profile.id === user?.id
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl w-8">{getRankEmoji(index)}</span>
                    <div>
                      <p className="font-semibold">{profile.username}</p>
                      <p className="text-sm text-muted-foreground">
                        Level {profile.level} • {profile.xp} XP
                      </p>
                    </div>
                  </div>
                  {profile.current_streak > 0 && (
                    <div className="flex items-center gap-1 text-orange-500">
                      🔥 <span className="font-bold">{profile.current_streak}</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Friends */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Friends ({friends.length})
                </span>
                <Button size="sm" variant="outline">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {friends.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No friends yet. Start connecting!</p>
                </div>
              ) : (
                friends.map((friend: any) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all"
                  >
                    <div>
                      <p className="font-semibold">{friend.username}</p>
                      <p className="text-sm text-muted-foreground">
                        Level {friend.level}
                      </p>
                    </div>
                    {friend.current_streak > 0 && (
                      <div className="flex items-center gap-1 text-orange-500">
                        🔥 {friend.current_streak}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {activity.activity_type === 'badge_earned' ? '🏆' : '✨'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.profiles?.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.activity_type === 'badge_earned'
                        ? `Earned ${activity.activity_data?.badge_name}`
                        : 'Completed a conversation'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Social;
