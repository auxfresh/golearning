import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import AchievementCard from "@/components/AchievementCard";
import MobileNavigation from "@/components/MobileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Star, Target, Award, Lock, CheckCircle } from "lucide-react";
import { Achievement, UserAchievement } from "@shared/schema";

type UserAchievementWithAchievement = UserAchievement & { achievement: Achievement };

export default function Achievements() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: allAchievements = [] } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const { data: userAchievements = [] } = useQuery<UserAchievementWithAchievement[]>({
    queryKey: ['/api/users', user?.id, 'achievements'],
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  const earnedAchievementIds = new Set(userAchievements.map(ua => ua.achievementId));
  const earnedAchievements = userAchievements;
  const availableAchievements = allAchievements.filter(achievement => 
    !earnedAchievementIds.has(achievement.id)
  );

  const achievementCategories = Array.from(new Set(allAchievements.map(a => a.type)));
  const completionPercentage = (earnedAchievements.length / allAchievements.length) * 100;

  const filteredEarned = selectedCategory === "all" 
    ? earnedAchievements 
    : earnedAchievements.filter(ua => ua.achievement.type === selectedCategory);

  const filteredAvailable = selectedCategory === "all"
    ? availableAchievements
    : availableAchievements.filter(a => a.type === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "course_completion":
        return <Trophy className="h-4 w-4" />;
      case "streak":
        return <Target className="h-4 w-4" />;
      case "quiz_perfect":
        return <Star className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "course_completion":
        return "Course Completion";
      case "streak":
        return "Learning Streaks";
      case "quiz_perfect":
        return "Perfect Quizzes";
      case "lesson_completion":
        return "Lesson Completion";
      default:
        return category.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getProgressForAchievement = (achievement: Achievement) => {
    // This would typically come from the API based on user's current progress
    // For now, we'll calculate some estimates based on user data
    switch (achievement.type) {
      case "course_completion":
        const completedCourses = Math.floor(user.xp / 1000);
        return Math.min((completedCourses / achievement.requirement) * 100, 100);
      case "streak":
        return Math.min((user.streak / achievement.requirement) * 100, 100);
      case "quiz_perfect":
        // Mock data - would come from actual quiz attempts
        return Math.min(((user.xp / 100) / achievement.requirement) * 100, 100);
      case "lesson_completion":
        const completedLessons = Math.floor(user.xp / 100);
        return Math.min((completedLessons / achievement.requirement) * 100, 100);
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Achievements</h1>
          <p className="text-gray-600">Track your learning milestones and unlock badges</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Your Achievement Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{earnedAchievements.length}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{availableAchievements.length}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{allAchievements.length}</div>
                <div className="text-sm text-gray-600">Total Badges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{Math.round(completionPercentage)}%</div>
                <div className="text-sm text-gray-600">Completion</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{earnedAchievements.length} of {allAchievements.length} badges</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Button>
            {achievementCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-2"
              >
                {getCategoryIcon(category)}
                {getCategoryLabel(category)}
              </Button>
            ))}
          </div>
        </div>

        {/* Achievement Tabs */}
        <Tabs defaultValue="earned" className="space-y-6">
          <TabsList>
            <TabsTrigger value="earned" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Earned ({filteredEarned.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Available ({filteredAvailable.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earned">
            {filteredEarned.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No badges earned yet</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCategory === "all" 
                      ? "Complete lessons and quizzes to earn your first achievement!"
                      : `Complete activities in ${getCategoryLabel(selectedCategory)} to earn badges.`
                    }
                  </p>
                  <Button asChild>
                    <a href="/courses">Start Learning</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEarned.map((userAchievement) => (
                  <AchievementCard
                    key={userAchievement.id}
                    achievement={userAchievement.achievement}
                    earned={true}
                    earnedAt={userAchievement.earnedAt}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available">
            {filteredAvailable.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All badges earned!</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCategory === "all"
                      ? "Congratulations! You've earned all available achievements."
                      : `You've earned all badges in ${getCategoryLabel(selectedCategory)}.`
                    }
                  </p>
                  <Button asChild>
                    <a href="/courses">Continue Learning</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailable.map((achievement) => {
                  const progress = getProgressForAchievement(achievement);
                  return (
                    <Card key={achievement.id} className="relative overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                            {getCategoryIcon(achievement.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryLabel(achievement.type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                            
                            {progress > 0 && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span>Progress</span>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                {progress < 100 && (
                                  <p className="text-xs text-gray-500">
                                    {achievement.requirement - Math.floor((progress / 100) * achievement.requirement)} more to unlock
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      
                      {/* Locked overlay */}
                      <div className="absolute top-2 right-2">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Achievement Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Tips for Earning Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Complete Courses</h4>
                    <p className="text-sm text-gray-600">Finish entire courses to unlock completion badges</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Maintain Streaks</h4>
                    <p className="text-sm text-gray-600">Learn consistently every day to build your streak</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Perfect Quizzes</h4>
                    <p className="text-sm text-gray-600">Score 100% on quizzes to earn perfect score badges</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Participate in Community</h4>
                    <p className="text-sm text-gray-600">Engage with other learners to unlock social badges</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
