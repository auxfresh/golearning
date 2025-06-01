import Navigation from "@/components/Navigation";
import CommunityFeed from "@/components/CommunityFeed";
import MobileNavigation from "@/components/MobileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, TrendingUp } from "lucide-react";

export default function Community() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community</h1>
          <p className="text-gray-600">Connect with fellow learners, share knowledge, and get help</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">2,847</p>
                  <p className="text-gray-600">Active Learners</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                  <p className="text-gray-600">Discussions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-gray-600">Questions Answered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Community Feed */}
          <div className="lg:col-span-2">
            <CommunityFeed />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Be Respectful</h4>
                    <p className="text-sm text-gray-600">Treat everyone with kindness and respect</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Stay on Topic</h4>
                    <p className="text-sm text-gray-600">Keep discussions relevant to learning and coding</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Help Others</h4>
                    <p className="text-sm text-gray-600">Share knowledge and support fellow learners</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-600 text-sm font-medium">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Search First</h4>
                    <p className="text-sm text-gray-600">Check if your question has already been answered</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">React Hooks</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">234 posts</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">JavaScript ES6+</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">189 posts</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CSS Grid & Flexbox</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">156 posts</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Node.js & Express</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">142 posts</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Design</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">98 posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Groups */}
            <Card>
              <CardHeader>
                <CardTitle>Active Study Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">React Masterclass Group</h4>
                    <p className="text-sm text-gray-600 mb-2">Weekly sessions on advanced React patterns</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600">12 members</span>
                      <span className="text-xs text-gray-500">Next: Today 7 PM</span>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">JavaScript Fundamentals</h4>
                    <p className="text-sm text-gray-600 mb-2">Perfect for beginners starting their journey</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600">8 members</span>
                      <span className="text-xs text-gray-500">Next: Tomorrow 6 PM</span>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">UI/UX Design Circle</h4>
                    <p className="text-sm text-gray-600 mb-2">Collaborative design reviews and feedback</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600">15 members</span>
                      <span className="text-xs text-gray-500">Next: Saturday 2 PM</span>
                    </div>
                  </div>
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
