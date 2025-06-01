import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import DashboardHeader from "@/components/DashboardHeader";
import CourseCard from "@/components/CourseCard";
import QuizComponent from "@/components/QuizComponent";
import AchievementCard from "@/components/AchievementCard";
import Leaderboard from "@/components/Leaderboard";
import CommunityFeed from "@/components/CommunityFeed";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Course, Quiz, UserAchievement, Achievement } from "@shared/schema";
import { Link } from "wouter";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: userAchievements = [] } = useQuery<(UserAchievement & { achievement: Achievement })[]>({
    queryKey: ['/api/users', user?.id, 'achievements'],
    enabled: !!user,
  });

  // Mock current course and quiz for demonstration
  const currentCourse = courses[1]; // Advanced React Development
  const dailyQuiz: Quiz = {
    id: 999,
    lessonId: 1,
    question: "Which hook is used for side effects in React?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: 1,
    explanation: "useEffect is used for side effects like API calls, subscriptions, and DOM manipulation.",
  };

  const recommendedCourses = courses.slice(0, 2);
  const recentAchievements = userAchievements.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <DashboardHeader />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Continue Learning Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Continue Learning</h2>
            <Link href="/courses">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </Link>
          </div>
          
          {currentCourse && (
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                      ⚛️
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{currentCourse.title}</h3>
                      <p className="text-gray-600">By {currentCourse.instructor} • {currentCourse.level}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{currentCourse.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Progress: 68% Complete</span>
                    <span className="text-sm text-gray-600">12 of {currentCourse.totalLessons} lessons</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "68%" }} />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/courses/${currentCourse.id}`}>
                      <Button className="flex-1 w-full sm:w-auto">
                        Continue Lesson
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1 w-full sm:w-auto">
                      Save for Later
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-900 relative flex items-center justify-center aspect-video lg:aspect-auto">
                  <img 
                    src={currentCourse.thumbnail} 
                    alt={currentCourse.title}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button size="icon" className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-blue-600">
                      <span className="ml-1 text-xl">▶</span>
                    </Button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    15:30
                  </div>
                </div>
              </div>
            </Card>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended Courses */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>

            {/* Daily Challenge */}
            <section>
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Daily Challenge</CardTitle>
                      <p className="opacity-90">Test your React knowledge with today's quiz!</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">+50 XP</div>
                      <div className="text-sm opacity-80">Reward</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-4">
                    <QuizComponent 
                      quiz={dailyQuiz} 
                      onComplete={(correct) => {
                        console.log('Quiz completed:', correct);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAchievements.length > 0 ? (
                    recentAchievements.map((userAchievement) => (
                      <AchievementCard 
                        key={userAchievement.id}
                        achievement={userAchievement.achievement} 
                        earned={true}
                        earnedAt={userAchievement.earnedAt}
                      />
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>Complete lessons to earn achievements!</p>
                    </div>
                  )}
                </div>
                
                <Link href="/achievements">
                  <Button variant="outline" className="w-full mt-4">
                    View All Badges
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Leaderboard />

            {/* Community Activity */}
            <CommunityFeed />
          </div>
        </div>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
