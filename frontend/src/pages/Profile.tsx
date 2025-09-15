import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { Settings, Languages, Target, Bell, Crown, Gift, Share, Users, CheckCircle, Clock } from "lucide-react";

const Profile = () => {
  const referralProgress = [
    { name: "Sarah M.", status: "joined", reward: "unlocked" },
    { name: "Mike R.", status: "invited", reward: "pending" },
    { name: "Anna K.", status: "joined", reward: "unlocked" },
    { name: "", status: "empty", reward: "locked" },
    { name: "", status: "empty", reward: "locked" },
  ];

  const handleInviteFriend = () => {
    // Simulate native share sheet
    if (navigator.share) {
      navigator.share({
        title: 'FluentNow - AI Speaking Coach',
        text: 'Hey, I\'m using this AI coach FluentNow to practice speaking Spanish. It\'s awesome. Use my link to get a free month of Premium!',
        url: 'https://fluentnow.app/ref/john123'
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText('Hey, I\'m using this AI coach FluentNow to practice speaking Spanish. It\'s awesome. Use my link to get a free month of Premium! https://fluentnow.app/ref/john123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-bold text-indigo-900 mb-2">Profile</h1>
          <p className="text-indigo-600">Manage your learning journey</p>
        </div>

        {/* Profile Info */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-indigo-500 text-white text-lg font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
                <p className="text-gray-600">Learning Spanish</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-700">B1 Intermediate</Badge>
                  <Badge variant="outline" className="text-green-600">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-indigo-600">25</div>
                <div className="text-xs text-gray-600">Days Active</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">15</div>
                <div className="text-xs text-gray-600">Scenarios Mastered</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">340</div>
                <div className="text-xs text-gray-600">Minutes Spoken</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Get FluentNow FREE - Referral Hub */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Gift className="w-6 h-6" />
              Get FluentNow FREE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 mb-4">
              Invite friends, get free Premium. For every friend who subscribes, you both get a month free!
            </p>

            {/* Visual Referral Tracker */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm">3/5 friends</span>
              </div>
              <div className="flex gap-2 mb-3">
                {referralProgress.map((friend, index) => (
                  <div key={index} className="flex-1 text-center">
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-1 ${
                      friend.status === 'joined' ? 'bg-green-400' :
                      friend.status === 'invited' ? 'bg-yellow-400' : 'bg-white/20'
                    }`}>
                      {friend.status === 'joined' ? <CheckCircle className="w-6 h-6 text-white" /> :
                       friend.status === 'invited' ? <Clock className="w-6 h-6 text-white" /> :
                       <Users className="w-6 h-6 text-white/50" />}
                    </div>
                    <div className="text-xs">
                      {friend.name || 'Invite'}
                    </div>
                  </div>
                ))}
              </div>
              <Progress value={60} className="h-2 bg-white/20" />
            </div>

            <Button
              onClick={handleInviteFriend}
              className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3"
            >
              <Share className="w-5 h-5 mr-2" />
              Invite a Friend Now
            </Button>
          </CardContent>
        </Card>

        {/* Track Your Invites */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">Sarah M.</div>
                    <div className="text-sm text-gray-600">Joined FluentNow</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">Reward Unlocked ✅</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="font-medium">Mike R.</div>
                    <div className="text-sm text-gray-600">Invite sent</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-yellow-600">Pending</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">Anna K.</div>
                    <div className="text-sm text-gray-600">Joined FluentNow</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">Reward Unlocked ✅</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Goals */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Learning Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Travel & Tourism</h4>
                  <p className="text-sm text-gray-600">Primary goal</p>
                </div>
                <Badge className="bg-purple-100 text-purple-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-700">Business Spanish</h4>
                  <p className="text-sm text-gray-600">Secondary goal</p>
                </div>
                <Button variant="outline" size="sm">Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <div className="space-y-3">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full justify-start" size="lg">
                <Languages className="w-5 h-5 mr-3" />
                Languages & Preferences
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full justify-start" size="lg">
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full justify-start" size="lg">
                <Settings className="w-5 h-5 mr-3" />
                App Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Premium Status */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6" />
              <div className="flex-1">
                <h4 className="font-semibold">Premium Member</h4>
                <p className="text-sm opacity-90">Unlimited conversations • 2 months free from referrals!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <div className="pt-4">
          <Button variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;