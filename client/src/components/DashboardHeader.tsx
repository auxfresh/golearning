import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

export default function DashboardHeader() {
  const { user } = useAuth();

  const { data: userAchievements = [] } = useQuery({
    queryKey: ['/api/users', user?.id, 'achievements'],
    enabled: !!user,
  });

  const { data: weeklyData = [] } = useQuery({
    queryKey: ['/api/users', user?.id, 'weekly-progress'],
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds for realtime updates
  });

  if (!user) return null;

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h1 className="text-2xl lg:text-4xl font-bold mb-4">
              Welcome back, {user.displayName}!
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Continue your learning journey. You're making great progress!
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.floor(user.xp / 100)}</div>
                <div className="text-sm opacity-80">Courses Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.floor(user.xp / 50)}</div>
                <div className="text-sm opacity-80">Hours Learned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userAchievements.length}</div>
                <div className="text-sm opacity-80">Badges Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.streak}</div>
                <div className="text-sm opacity-80">Day Streak</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
            <div className="space-y-3">
              {weeklyData.length > 0 ? weeklyData.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-sm">{day.day}</span>
                  <div className="flex-1 mx-3 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all" 
                      style={{ width: `${day.progress}%` }}
                    />
                  </div>
                  <span className="text-xs">{day.hours}h</span>
                </div>
              )) : (
                <div className="text-center text-sm opacity-75">
                  Complete lessons to track your progress!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
