import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import VideoPlayer from "@/components/VideoPlayer";
import QuizComponent from "@/components/QuizComponent";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, CheckCircle, Play, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Course, Lesson, Quiz, UserProgress } from "@shared/schema";
import { useState } from "react";

export default function CourseDetail() {
  const [, params] = useRoute("/courses/:id");
  const courseId = parseInt(params?.id || "0");
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ['/api/courses', courseId],
    enabled: !!courseId,
  });

  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ['/api/courses', courseId, 'lessons'],
    enabled: !!courseId,
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ['/api/users', user?.id, 'progress', courseId],
    enabled: !!user && !!courseId,
  });

  const { data: currentQuizzes = [] } = useQuery<Quiz[]>({
    queryKey: ['/api/lessons', currentLessonId, 'quizzes'],
    enabled: !!currentLessonId,
  });

  const currentLesson = lessons.find(lesson => lesson.id === currentLessonId) || lessons[0];

  const markLessonCompleteMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      const response = await apiRequest('POST', '/api/progress', {
        userId: user!.id,
        courseId,
        lessonId,
        completed: true,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'progress', courseId] });
      queryClient.invalidateQueries({ queryKey: ['/api/user', user?.firebaseUid] });
    },
  });

  if (courseLoading || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video bg-gray-200 rounded mb-4" />
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedLessons = userProgress.filter(p => p.completed).length;
  const progressPercentage = (completedLessons / course.totalLessons) * 100;

  const isLessonCompleted = (lessonId: number) => {
    return userProgress.some(p => p.lessonId === lessonId && p.completed);
  };

  const handleLessonComplete = () => {
    if (currentLesson && !isLessonCompleted(currentLesson.id)) {
      markLessonCompleteMutation.mutate(currentLesson.id);
    }
  };

  const getLevelColor = (level: string) => {
    if (!level) return "bg-gray-100 text-gray-800";
    
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{course.category}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <span>By {course.instructor}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Your Progress</span>
              <span className="text-sm text-gray-600">
                {completedLessons} of {course.totalLessons} lessons completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-sm text-gray-600 mt-1">{Math.round(progressPercentage)}% complete</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player and Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentLesson && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{currentLesson.title}</span>
                      {isLessonCompleted(currentLesson.id) && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </CardTitle>
                    {currentLesson.description && (
                      <p className="text-gray-600">{currentLesson.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <VideoPlayer
                      videoUrl={currentLesson.videoUrl || ""}
                      title={currentLesson.title}
                      onComplete={handleLessonComplete}
                    />
                    
                    {!isLessonCompleted(currentLesson.id) && (
                      <div className="mt-4">
                        <Button 
                          onClick={handleLessonComplete}
                          disabled={markLessonCompleteMutation.isPending}
                          className="w-full"
                        >
                          {markLessonCompleteMutation.isPending ? "Marking Complete..." : "Mark as Complete"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quizzes */}
                {currentQuizzes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Practice Quiz</h3>
                    {currentQuizzes.map((quiz) => (
                      <QuizComponent key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Lesson List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {lessons.map((lesson, index) => {
                    const completed = isLessonCompleted(lesson.id);
                    const isCurrent = lesson.id === currentLesson?.id;
                    const isLocked = index > 0 && !isLessonCompleted(lessons[index - 1].id);
                    
                    return (
                      <div key={lesson.id}>
                        <button
                          onClick={() => !isLocked && setCurrentLessonId(lesson.id)}
                          disabled={isLocked}
                          className={`w-full text-left p-4 transition-colors ${
                            isCurrent 
                              ? "bg-blue-50 border-r-2 border-blue-500" 
                              : isLocked
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : isLocked ? (
                                  <Lock className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Play className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h4 className={`font-medium ${isCurrent ? "text-blue-700" : ""}`}>
                                  {lesson.title}
                                </h4>
                                <p className="text-sm text-gray-600">{lesson.duration} min</p>
                              </div>
                            </div>
                          </div>
                        </button>
                        {index < lessons.length - 1 && <Separator />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
