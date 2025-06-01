import { Link } from "wouter";
import { Clock, Users, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  progress?: number;
}

export default function CourseCard({ course, showProgress = false, progress = 0 }: CourseCardProps) {
  const getLevelColor = (level: string) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "programming":
        return "💻";
      case "frontend":
        return "🎨";
      case "design":
        return "🎭";
      default:
        return "📚";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative">
        <img 
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="icon" className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-blue-600">
            <Play className="h-5 w-5 ml-0.5" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg">{getCategoryIcon(course.category)}</span>
          <Badge className={getLevelColor(course.level)}>
            {course.level}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{course.totalLessons} lessons</span>
          </div>
        </div>

        {showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress: {progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        <Link href={`/courses/${course.id}`}>
          <Button className="w-full">
            {showProgress ? "Continue Course" : "Start Course"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
