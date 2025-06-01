import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { User } from "@shared/schema";

export default function Leaderboard() {
  const { data: leaderboard = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/leaderboard'],
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-400" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">{rank}</span>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100";
      case 3:
        return "bg-gradient-to-r from-orange-50 to-orange-100";
      default:
        return "hover:bg-gray-50";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map((user, index) => {
            const rank = index + 1;
            return (
              <div 
                key={user.id} 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${getRankBackground(rank)}`}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(rank)}
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{user.displayName}</div>
                  <div className="text-xs text-gray-600">{user.xp.toLocaleString()} XP</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Level {user.level}</div>
                  {user.streak > 0 && (
                    <div className="text-xs text-orange-600 flex items-center gap-1">
                      🔥 {user.streak} day streak
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
