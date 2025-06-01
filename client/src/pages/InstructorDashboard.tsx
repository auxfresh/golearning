import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Course, Lesson, Quiz, InsertCourse, InsertLesson, InsertQuiz } from "@shared/schema";
import { Plus, Edit, Trash2, BookOpen, Users, Award, Video, FileQuestion } from "lucide-react";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [showQuizDialog, setShowQuizDialog] = useState(false);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    level: 'beginner',
    category: '',
    duration: 0,
    totalLessons: 0,
    thumbnail: ''
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
    order: 1
  });

  const [quizForm, setQuizForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  // Fetch instructor's courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses/instructor', user?.id],
    enabled: !!user?.id
  });

  // Fetch lessons for selected course
  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ['/api/lessons', selectedCourse?.id],
    enabled: !!selectedCourse?.id
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (courseData: InsertCourse) => {
      const response = await apiRequest('POST', '/api/courses', {
        ...courseData,
        instructor: user?.displayName || 'Instructor'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setShowCourseDialog(false);
      setCourseForm({
        title: '',
        description: '',
        level: 'beginner',
        category: '',
        duration: 0,
        totalLessons: 0,
        thumbnail: ''
      });
      toast({ title: "Course created!", description: "Your new course has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create course.", variant: "destructive" });
    }
  });

  // Create lesson mutation
  const createLessonMutation = useMutation({
    mutationFn: async (lessonData: InsertLesson) => {
      const response = await apiRequest('POST', '/api/lessons', lessonData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/lessons'] });
      setShowLessonDialog(false);
      setLessonForm({
        title: '',
        description: '',
        videoUrl: '',
        duration: 0,
        order: 1
      });
      toast({ title: "Lesson created!", description: "Your new lesson has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create lesson.", variant: "destructive" });
    }
  });

  // Create quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: async (quizData: InsertQuiz) => {
      const response = await apiRequest('POST', '/api/quizzes', quizData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes'] });
      setShowQuizDialog(false);
      setQuizForm({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      });
      toast({ title: "Quiz created!", description: "Your new quiz has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create quiz.", variant: "destructive" });
    }
  });

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate(courseForm);
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    
    createLessonMutation.mutate({
      ...lessonForm,
      courseId: selectedCourse.id
    });
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll create quiz for the first lesson of selected course
    const firstLesson = lessons[0];
    if (!firstLesson) {
      toast({ title: "No lessons", description: "Please create a lesson first.", variant: "destructive" });
      return;
    }

    createQuizMutation.mutate({
      ...quizForm,
      lessonId: firstLesson.id
    });
  };

  if (!user) {
    return <div>Please log in to access the instructor dashboard.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses, lessons, and content</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Award className="w-4 h-4 mr-1" />
          Instructor
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((sum, course) => sum + course.totalLessons, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Enrolled</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Total enrollments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Courses</h2>
            <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>
                    Add a new course to your teaching portfolio
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Introduction to React"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={courseForm.category}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Web Development"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what students will learn..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select 
                        value={courseForm.level} 
                        onValueChange={(value) => setCourseForm(prev => ({ ...prev, level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={courseForm.duration}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalLessons">Total Lessons</Label>
                      <Input
                        id="totalLessons"
                        type="number"
                        value={courseForm.totalLessons}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, totalLessons: parseInt(e.target.value) || 0 }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
                    <Input
                      id="thumbnail"
                      value={courseForm.thumbnail}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowCourseDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createCourseMutation.isPending}>
                      {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesLoading ? (
              <div>Loading courses...</div>
            ) : courses.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start by creating your first course to share your knowledge with students
                  </p>
                  <Button onClick={() => setShowCourseDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Course
                  </Button>
                </CardContent>
              </Card>
            ) : (
              courses.map((course) => (
                <Card key={course.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.category}</CardDescription>
                      </div>
                      <Badge variant={course.level === 'beginner' ? 'default' : course.level === 'intermediate' ? 'secondary' : 'destructive'}>
                        {course.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{course.totalLessons} lessons</span>
                      <span>{course.duration} min</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Lessons {selectedCourse && `- ${selectedCourse.title}`}
            </h2>
            <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
              <DialogTrigger asChild>
                <Button disabled={!selectedCourse}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Lesson</DialogTitle>
                  <DialogDescription>
                    Add a lesson to {selectedCourse?.title}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateLesson} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lesson-title">Lesson Title</Label>
                    <Input
                      id="lesson-title"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Introduction to Components"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lesson-description">Description</Label>
                    <Textarea
                      id="lesson-description"
                      value={lessonForm.description}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What will students learn in this lesson?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-url">Video URL</Label>
                      <Input
                        id="video-url"
                        value={lessonForm.videoUrl}
                        onChange={(e) => setLessonForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lesson-duration">Duration (minutes)</Label>
                      <Input
                        id="lesson-duration"
                        type="number"
                        value={lessonForm.duration}
                        onChange={(e) => setLessonForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lesson-order">Lesson Order</Label>
                    <Input
                      id="lesson-order"
                      type="number"
                      value={lessonForm.order}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowLessonDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createLessonMutation.isPending}>
                      {createLessonMutation.isPending ? "Creating..." : "Create Lesson"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {!selectedCourse ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a course</h3>
                <p className="text-muted-foreground text-center">
                  Choose a course from the courses tab to manage its lessons
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Lesson {lesson.order}: {lesson.title}
                        </CardTitle>
                        <CardDescription>{lesson.duration} minutes</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  {lesson.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
              
              {lessons.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Video className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Start adding lessons to {selectedCourse.title}
                    </p>
                    <Button onClick={() => setShowLessonDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Lesson
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quizzes</h2>
            <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
              <DialogTrigger asChild>
                <Button disabled={!selectedCourse || lessons.length === 0}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Quiz
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Quiz Question</DialogTitle>
                  <DialogDescription>
                    Add a quiz question for your lesson
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateQuiz} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-question">Question</Label>
                    <Textarea
                      id="quiz-question"
                      value={quizForm.question}
                      onChange={(e) => setQuizForm(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter your quiz question..."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    {quizForm.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...quizForm.options];
                            newOptions[index] = e.target.value;
                            setQuizForm(prev => ({ ...prev, options: newOptions }));
                          }}
                          placeholder={`Option ${index + 1}`}
                          required
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant={quizForm.correctAnswer === index ? "default" : "outline"}
                          onClick={() => setQuizForm(prev => ({ ...prev, correctAnswer: index }))}
                        >
                          {quizForm.correctAnswer === index ? "Correct" : "Mark Correct"}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quiz-explanation">Explanation (optional)</Label>
                    <Textarea
                      id="quiz-explanation"
                      value={quizForm.explanation}
                      onChange={(e) => setQuizForm(prev => ({ ...prev, explanation: e.target.value }))}
                      placeholder="Explain why this is the correct answer..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowQuizDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createQuizMutation.isPending}>
                      {createQuizMutation.isPending ? "Creating..." : "Create Quiz"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Quiz Management</h3>
              <p className="text-muted-foreground text-center">
                Select a course and create lessons first, then add quiz questions to test student knowledge
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-semibold">Course Analytics</h2>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
              <p className="text-muted-foreground text-center">
                View detailed analytics about student engagement, course completion rates, and performance metrics
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}