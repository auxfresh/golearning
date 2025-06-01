import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertCourseSchema, insertLessonSchema, 
  insertQuizSchema, insertUserProgressSchema, insertForumPostSchema,
  insertQuizAttemptSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:firebaseUid", async (req, res) => {
    try {
      const user = await storage.getUserByFirebaseUid(req.params.firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id/xp", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { xp } = req.body;
      const user = await storage.updateUserXP(userId, xp);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user XP" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to get course" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  // Lesson routes
  app.get("/api/courses/:courseId/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessonsByCourse(parseInt(req.params.courseId));
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to get lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(parseInt(req.params.id));
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to get lesson" });
    }
  });

  // Quiz routes
  app.get("/api/lessons/:lessonId/quizzes", async (req, res) => {
    try {
      const quizzes = await storage.getQuizzesByLesson(parseInt(req.params.lessonId));
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quizzes" });
    }
  });

  app.post("/api/quiz-attempts", async (req, res) => {
    try {
      const attemptData = insertQuizAttemptSchema.parse(req.body);
      const attempt = await storage.createQuizAttempt(attemptData);

      // Award XP for correct answers
      if (attempt.correct) {
        await storage.updateUserXP(attempt.userId, 50);
      }

      res.status(201).json(attempt);
    } catch (error) {
      res.status(400).json({ message: "Invalid quiz attempt data" });
    }
  });

  // Progress routes
  app.get("/api/users/:userId/progress/:courseId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const courseId = parseInt(req.params.courseId);
      const progress = await storage.getUserProgress(userId, courseId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.updateUserProgress(progressData);

      // Award XP for lesson completion
      if (progressData.completed) {
        await storage.updateUserXP(progressData.userId, 100);
      }

      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user achievements" });
    }
  });

  app.get("/api/users/:userId/weekly-progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const weeklyProgress = await storage.getUserWeeklyProgress(userId);
      res.json(weeklyProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get weekly progress" });
    }
  });

  // Forum routes
  app.get("/api/forum", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const posts = await storage.getForumPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get forum posts" });
    }
  });

  app.post("/api/forum", async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid forum post data" });
    }
  });

  app.patch("/api/forum/:postId/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const post = await storage.likeForumPost(postId);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Failed to like post" });
    }
  });

  // Promote user to instructor (admin only)
  app.patch("/api/users/:userId/promote-instructor", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const updatedUser = await storage.updateUser(userId, { 
        isInstructor: true,
        role: "instructor" 
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error promoting user to instructor:", error);
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(500).json({ error: "Failed to promote user" });
    }
  });

  // Get weekly progress
  app.get("/api/users/:userId/weekly-progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const weeklyProgress = await storage.getUserWeeklyProgress(userId);
      res.json(weeklyProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get weekly progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}