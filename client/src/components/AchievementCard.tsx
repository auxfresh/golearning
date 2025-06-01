import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Flame, BookOpen } from "lucide-react";
import { Achievement } from "@shared/schema";

interface AchievementCardProps {
  achievement: Achievement;
  earned?: boolean;
  earnedAt?: Date;
}

export default function AchievementCard({ achievement, earned = false, earnedAt }: AchievementCardProps) {
  const getIcon = (iconString: string) => {
    if (iconString.includes("trophy")) return <Trophy className="h-6 w-6" />;
    if (iconString.includes("star")) return <Star className="h-6 w-6" />;
    if (iconString.includes("fire")) return <Flame className="h-6 w-6" />;
    return <BookOpen className="h-6 w-6" />;
  };

  const getBackgroundGradient = (type: string) => {
    switch (type) {
      case "course_completion":
        return "from-yellow-400/10 to-orange-400/10";
      case "streak":
        return "from-red-400/10 to-orange-400/10";
      case "quiz_perfect":
        return "from-blue-400/10 to-purple-400/10";
      default:
        return "from-green-400/10 to-teal-400/10";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "course_completion":
        return "text-yellow-600";
      case "streak":
        return "text-red-600";
      case "quiz_perfect":
        return "text-blue-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <Card className={`${earned ? "" : "opacity-60"} transition-all hover:shadow-md`}>
      <CardContent className={`p-4 bg-gradient-to-r ${getBackgroundGradient(achievement.type)}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center ${getIconColor(achievement.type)}`}>
            {getIcon(achievement.icon)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{achievement.title}</h3>
              {earned && <Badge variant="secondary" className="text-xs">Earned</Badge>}
            </div>
            <p className="text-sm text-gray-600">{achievement.description}</p>
            {earnedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Earned on {earnedAt.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
