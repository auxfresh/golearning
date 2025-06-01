import { Link, useLocation } from "wouter";
import { Home, BookOpen, TrendingUp, Trophy, User, GraduationCap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks/useUser";

export default function MobileNavigation() {
  const [location] = useLocation();
  const { user } = useUser();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/courses", icon: BookOpen, label: "Courses" },
    { href: "/progress", icon: TrendingUp, label: "Progress" },
    { href: "/achievements", icon: Trophy, label: "Achievements" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <button className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
              isActive(href) ? "text-blue-600" : "text-gray-500"
            }`}>
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </button>
          </Link>
        ))}
        {user?.isInstructor && (
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 h-auto py-2"
            asChild
          >
            <a href="/instructor">
              <GraduationCap className="h-5 w-5" />
              <span className="text-xs">Instructor</span>
            </a>
          </Button>
        )}
      </div>
    </nav>
  );
}