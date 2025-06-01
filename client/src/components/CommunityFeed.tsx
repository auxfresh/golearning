import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { ForumPost, User } from "@shared/schema";

type ForumPostWithUser = ForumPost & { user: User };

export default function CommunityFeed() {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery<ForumPostWithUser[]>({
    queryKey: ['/api/forum'],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string }) => {
      const response = await apiRequest('POST', '/api/forum', {
        ...postData,
        userId: user!.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum'] });
      setNewPostTitle("");
      setNewPostContent("");
      setShowNewPost(false);
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest('PATCH', `/api/forum/${postId}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum'] });
    },
  });

  const handleSubmitPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    createPostMutation.mutate({
      title: newPostTitle,
      content: newPostContent,
    });
  };

  const handleLike = (postId: number) => {
    likePostMutation.mutate(postId);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
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
        <div className="flex items-center justify-between">
          <CardTitle>Community Activity</CardTitle>
          <Button onClick={() => setShowNewPost(!showNewPost)} size="sm">
            {showNewPost ? "Cancel" : "New Post"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showNewPost && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <Input
              placeholder="Post title..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="mb-3"
            />
            <Textarea
              placeholder="Share your thoughts, ask questions, or help others..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="mb-3"
              rows={3}
            />
            <Button 
              onClick={handleSubmitPost}
              disabled={createPostMutation.isPending || !newPostTitle.trim() || !newPostContent.trim()}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {createPostMutation.isPending ? "Posting..." : "Post"}
            </Button>
          </div>
        )}
        
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No posts yet. Be the first to start a discussion!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {post.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{post.user.displayName}</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(new Date(post.createdAt))}</span>
                </div>
                
                <h4 className="font-medium mb-1">{post.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{post.content}</p>
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                    disabled={likePostMutation.isPending}
                  >
                    <Heart className="h-3 w-3" />
                    {post.likes} likes
                  </button>
                  <button className="text-xs text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {post.replies} replies
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
