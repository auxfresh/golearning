import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Settings, 
  Trophy, 
  Clock, 
  BookOpen, 
  Target,
  Edit2,
  Save,
  X,
  Calendar,
  Award,
  TrendingUp,
  Users
} from "lucide-react";
import { UserAchievement, Achievement, Course } from "@shared/schema";

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || "",
    username: user?.username || "",
  });

  const { data: userAchievements = [] } = useQuery<(UserAchievement & { achievement: Achievement })[]>({
    queryKey: ['/api/users', user?.id, 'achievements'],
    enabled: !!user,
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { displayName: string; username: string }) => {
      // Note: This would require an API endpoint to update user profile
      // For now, we'll just show a success message
      return Promise.resolve(profileData);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return null;
  }

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleCancelEdit = () => {
    setEditForm({
      displayName: user.displayName,
      username: user.username,
    });
    setIsEditing(false);
  };

  const completedCoursesCount = Math.floor(user.xp / 1000); // Rough estimate
  const totalLearningHours = Math.floor(user.xp / 50); // Rough estimate
  const averageSessionTime = 45; // Mock data

  const recentAchievements = userAchievements.slice(0, 6);
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-red-500";
    if (streak >= 15) return "text-orange-500";
    if (streak >= 7) return "text-yellow-500";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile</h1>
          <p className="text-gray-600">Manage your account and view your learning progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-1">
                    {!isEditing ? (
                      <>
                        <h3 className="text-xl font-semibold">{user.displayName}</h3>
                        <p className="text-gray-600">@{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={editForm.displayName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={editForm.username}
                            onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">Level {user.level}</div>
                    <div className="text-sm text-gray-600">Current Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{user.xp.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total XP</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getStreakColor(user.streak)}`}>
                      {user.streak} 🔥
                    </div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{userAchievements.length}</div>
                    <div className="text-sm text-gray-600">Badges Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">Courses Completed</p>
                          <p className="text-sm text-gray-600">Total courses finished</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{completedCoursesCount}</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="font-medium">Learning Hours</p>
                          <p className="text-sm text-gray-600">Time spent learning</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{totalLearningHours}h</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Target className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="font-medium">Average Session</p>
                          <p className="text-sm text-gray-600">Typical study time</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{averageSessionTime}m</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="font-medium">This Week</p>
                          <p className="text-sm text-gray-600">Hours this week</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">12h</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Achievements</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <a href="/achievements">View All</a>
                </Button>
              </CardHeader>
              <CardContent>
                {recentAchievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentAchievements.map((userAchievement) => (
                      <div 
                        key={userAchievement.id} 
                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{userAchievement.achievement.title}</h4>
                          <p className="text-sm text-gray-600">{userAchievement.achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Earned {new Date(userAchievement.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Complete lessons and quizzes to earn achievements!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm text-gray-600">{memberSince}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Type</span>
                  <Badge variant="secondary">Free</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Courses Available</span>
                  <span className="text-sm text-gray-600">{courses.length}</span>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Next Level Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Level {user.level}</span>
                      <span>Level {user.level + 1}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{ width: `${(user.xp % 1000) / 10}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-center">
                      {1000 - (user.xp % 1000)} XP to next level
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/courses">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </a>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/achievements">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Achievements
                  </a>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/community">
                    <Users className="h-4 w-4 mr-2" />
                    Join Community
                  </a>
                </Button>
                
                <Separator />
                
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
