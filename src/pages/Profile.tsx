
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Languages, Target, Bell, Crown } from "lucide-react";

const Profile = () => {
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
                <AvatarImage src="/placeholder-avatar.jpg" />
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

        {/* Subscription Status */}
        <Card className="bg-gradient-to-r from-gold-400 to-yellow-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6" />
              <div className="flex-1">
                <h4 className="font-semibold">Premium Member</h4>
                <p className="text-sm opacity-90">Unlimited conversations • Expires Dec 15, 2024</p>
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
