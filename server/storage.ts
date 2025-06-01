import { 
  users, courses, lessons, quizzes, userProgress, achievements, 
  userAchievements, forumPosts, quizAttempts,
  type User, type InsertUser, type Course, type InsertCourse,
  type Lesson, type InsertLesson, type Quiz, type InsertQuiz,
  type UserProgress, type InsertUserProgress, type Achievement,
  type UserAchievement, type InsertUserAchievement, type ForumPost,
  type InsertForumPost, type QuizAttempt, type InsertQuizAttempt
} from "@shared/schema";

export interface IStorage {
  // Users
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserXP(userId: number, xp: number): Promise<User>;
  updateUserStreak(userId: number, streak: number): Promise<User>;
  getLeaderboard(limit?: number): Promise<User[]>;

  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Lessons
  getLessonsByCourse(courseId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Quizzes
  getQuizzesByLesson(lessonId: number): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // User Progress
  getUserProgress(userId: number, courseId: number): Promise<UserProgress[]>;
  getUserProgressByLesson(userId: number, lessonId: number): Promise<UserProgress | undefined>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserCompletedCourses(userId: number): Promise<number>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;
  addUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;

  // Forum
  getForumPosts(limit?: number): Promise<(ForumPost & { user: User })[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  likeForumPost(postId: number): Promise<ForumPost>;

  // Quiz Attempts
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: number, quizId: number): Promise<QuizAttempt[]>;

  getUserWeeklyProgress(userId: number): Promise<{ day: string; hours: number; progress: number; }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private courses: Map<number, Course> = new Map();
  private lessons: Map<number, Lesson> = new Map();
  private quizzes: Map<number, Quiz> = new Map();
  private userProgress: Map<number, UserProgress> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private userAchievements: Map<number, UserAchievement> = new Map();
  private forumPosts: Map<number, ForumPost> = new Map();
  private quizAttempts: Map<number, QuizAttempt> = new Map();

  private currentUserId = 1;
  private currentCourseId = 1;
  private currentLessonId = 1;
  private currentQuizId = 1;
  private currentProgressId = 1;
  private currentAchievementId = 1;
  private currentUserAchievementId = 1;
  private currentForumPostId = 1;
  private currentQuizAttemptId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed achievements
    const achievementData = [
      { title: "First Steps", description: "Complete your first lesson", icon: "fas fa-baby", type: "lesson_completion", requirement: 1 },
      { title: "Course Completed", description: "Complete your first course", icon: "fas fa-trophy", type: "course_completion", requirement: 1 },
      { title: "Streak Master", description: "Maintain a 15-day learning streak", icon: "fas fa-fire", type: "streak", requirement: 15 },
      { title: "Perfect Quiz", description: "Score 100% on 5 quizzes", icon: "fas fa-star", type: "quiz_perfect", requirement: 5 },
      { title: "Knowledge Seeker", description: "Complete 10 courses", icon: "fas fa-book", type: "course_completion", requirement: 10 },
    ];

    achievementData.forEach(achievement => {
      const id = this.currentAchievementId++;
      this.achievements.set(id, { ...achievement, id });
    });

    // Seed courses
    const courseData = [
      {
        title: "JavaScript Fundamentals",
        description: "Learn the basics of JavaScript programming with hands-on exercises and real-world examples.",
        instructor: "John Smith",
        level: "beginner",
        category: "Programming",
        duration: 480,
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        totalLessons: 12,
        createdAt: new Date(),
      },
      {
        title: "Advanced React Development",
        description: "Master advanced React concepts including hooks, context, performance optimization, and modern patterns.",
        instructor: "Sarah Wilson",
        level: "intermediate",
        category: "Frontend",
        duration: 720,
        thumbnail: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        totalLessons: 18,
        createdAt: new Date(),
      },
      {
        title: "UI/UX Design Principles",
        description: "Master the fundamentals of user interface and experience design with practical projects.",
        instructor: "Mike Chen",
        level: "intermediate",
        category: "Design",
        duration: 600,
        thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        totalLessons: 15,
        createdAt: new Date(),
      },
    ];

    courseData.forEach(course => {
      const id = this.currentCourseId++;
      this.courses.set(id, { ...course, id });
    });

    // Seed lessons for each course
    this.courses.forEach(course => {
      for (let i = 1; i <= course.totalLessons; i++) {
        const id = this.currentLessonId++;
        this.lessons.set(id, {
          id,
          courseId: course.id,
          title: `${course.title} - Lesson ${i}`,
          description: `Learn about ${course.title.toLowerCase()} concepts in this lesson.`,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: Math.floor(Math.random() * 30) + 15,
          order: i,
          createdAt: new Date(),
        });
      }
    });

    // Seed quizzes for some lessons
    this.lessons.forEach(lesson => {
      if (Math.random() > 0.7) { // 30% of lessons have quizzes
        const id = this.currentQuizId++;
        this.quizzes.set(id, {
          id,
          lessonId: lesson.id,
          question: "Which of the following is correct?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 1,
          explanation: "Option B is correct because...",
        });
      }
    });
  }

  // Users
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === firebaseUid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      xp: insertUser.xp || 0,
      level: insertUser.level || 1,
      streak: insertUser.streak || 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserXP(userId: number, xp: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    const newXP = user.xp + xp;
    const newLevel = Math.floor(newXP / 1000) + 1;

    const updatedUser = { ...user, xp: newXP, level: newLevel };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserStreak(userId: number, streak: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, streak };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getLeaderboard(limit: number = 10): Promise<User[]> {
    const allUsers = Array.from(this.users.values());
    return allUsers
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);
  }

  async getUserWeeklyProgress(userId: number) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      // Get completed lessons for this day
      const dayProgress = Array.from(this.userProgress.values()).filter(progress => 
        progress.userId === userId && 
        progress.completed && 
        progress.completedAt &&
        new Date(progress.completedAt).toDateString() === currentDay.toDateString()
      );

      // Calculate study hours (assuming 30 minutes per lesson on average)
      const studyHours = dayProgress.length * 0.5;
      const maxHours = 4; // Maximum expected hours per day for progress bar
      const progress = Math.min((studyHours / maxHours) * 100, 100);

      weeklyData.push({
        day: dayNames[i],
        hours: studyHours,
        progress: Math.round(progress)
      });
    }

    return weeklyData;
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const newCourse: Course = {
      ...course,
      id,
      createdAt: new Date(),
    };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  // Lessons
  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const id = this.currentLessonId++;
    const newLesson: Lesson = {
      ...lesson,
      id,
      createdAt: new Date(),
    };
    this.lessons.set(id, newLesson);
    return newLesson;
  }

  // Quizzes
  async getQuizzesByLesson(lessonId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.lessonId === lessonId);
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentQuizId++;
    const newQuiz: Quiz = { ...quiz, id };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }

  // User Progress
  async getUserProgress(userId: number, courseId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId && progress.courseId === courseId);
  }

  async getUserProgressByLesson(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values())
      .find(progress => progress.userId === userId && progress.lessonId === lessonId);
  }

  async updateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getUserProgressByLesson(insertProgress.userId, insertProgress.lessonId);

    if (existing) {
      const updated = { ...existing, ...insertProgress, completedAt: insertProgress.completed ? new Date() : existing.completedAt };
      this.userProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentProgressId++;
      const newProgress: UserProgress = {
        ...insertProgress,
        id,
        completedAt: insertProgress.completed ? new Date() : null,
      };
      this.userProgress.set(id, newProgress);
      return newProgress;
    }
  }

  async getUserCompletedCourses(userId: number): Promise<number> {
    const allProgress = Array.from(this.userProgress.values()).filter(p => p.userId === userId && p.completed);
    const courseCompletions = new Map<number, number>();

    allProgress.forEach(progress => {
      const count = courseCompletions.get(progress.courseId) || 0;
      courseCompletions.set(progress.courseId, count + 1);
    });

    let completedCourses = 0;
    for (const [courseId, completedLessons] of courseCompletions) {
      const course = this.courses.get(courseId);
      if (course && completedLessons >= course.totalLessons) {
        completedCourses++;
      }
    }

    return completedCourses;
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievements = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);

    return userAchievements.map(ua => ({
      ...ua,
      achievement: this.achievements.get(ua.achievementId)!,
    }));
  }

  async addUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.currentUserAchievementId++;
    const newUserAchievement: UserAchievement = {
      ...userAchievement,
      id,
      earnedAt: new Date(),
    };
    this.userAchievements.set(id, newUserAchievement);
    return newUserAchievement;
  }

  // Forum
  async getForumPosts(limit = 20): Promise<(ForumPost & { user: User })[]> {
    const posts = Array.from(this.forumPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return posts.map(post => ({
      ...post,
      user: this.users.get(post.userId)!,
    }));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const id = this.currentForumPostId++;
    const newPost: ForumPost = {
      ...post,
      id,
      createdAt: new Date(),
    };
    this.forumPosts.set(id, newPost);
    return newPost;
  }

  async likeForumPost(postId: number): Promise<ForumPost> {
    const post = this.forumPosts.get(postId);
    if (!post) throw new Error("Post not found");

    const updatedPost = { ...post, likes: post.likes + 1 };
    this.forumPosts.set(postId, updatedPost);
    return updatedPost;
  }

  // Quiz Attempts
  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = this.currentQuizAttemptId++;
    const newAttempt: QuizAttempt = {
      ...attempt,
      id,
      attemptedAt: new Date(),
    };
    this.quizAttempts.set(id, newAttempt);
    return newAttempt;
  }

  async getUserQuizAttempts(userId: number, quizId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values())
      .filter(attempt => attempt.userId === userId && attempt.quizId === quizId);
  }
}

export const storage = new MemStorage();