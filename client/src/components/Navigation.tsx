import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Search, GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/courses", label: "Courses" },
    { href: "/community", label: "Community" },
    { href: "/achievements", label: "Achievements" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="text-2xl text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EduLearn</span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive(link.href)
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 w-64"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium">{user.displayName}</div>
                <div className="text-xs text-gray-600">Level {user.level} • {user.xp} XP</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <Button variant="ghost" onClick={logout} className="hidden md:flex">
                Logout
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-left p-2 rounded transition-colors ${
                        isActive(link.href)
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Button variant="outline" onClick={logout} className="justify-start">
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
