"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Users,
  Calendar,
  Send,
  Heart,
  Reply,
  Pin,
  Search,
  Filter,
  Plus,
  Clock,
  Eye,
  Star,
  TrendingUp,
  Radio
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/components/NotificationSystem";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions");
  const [newPostContent, setNewPostContent] = useState("");
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const discussions = [
    {
      id: 1,
      title: "Best practices for technical podcasts",
      content: "What are some effective ways to make technical content accessible to non-technical audiences?",
      author: "Alex Chen",
      department: "Engineering",
      avatar: "AC",
      timestamp: "2 hours ago",
      replies: 12,
      likes: 24,
      views: 156,
      tags: ["technical", "communication", "best-practices"],
      pinned: true
    },
    {
      id: 2,
      title: "Podcast equipment recommendations under $200",
      content: "Looking for budget-friendly equipment recommendations for starting a department podcast. What's worked well for others?",
      author: "Sarah Johnson",
      department: "Marketing",
      avatar: "SJ",
      timestamp: "4 hours ago",
      replies: 8,
      likes: 18,
      views: 89,
      tags: ["equipment", "budget", "recommendations"]
    },
    {
      id: 3,
      title: "How to handle nervous speakers",
      content: "Any tips for making guests more comfortable when they're nervous about being recorded? Had a few colleagues decline because of anxiety.",
      author: "Emma Rodriguez",
      department: "HR",
      avatar: "ER",
      timestamp: "1 day ago",
      replies: 15,
      likes: 31,
      views: 203,
      tags: ["hosting", "guest-management", "communication"]
    },
    {
      id: 4,
      title: "Cross-department collaboration ideas",
      content: "Planning a series that brings together different departments. What topics would create good cross-functional discussions?",
      author: "Mike David",
      department: "Product",
      avatar: "MD",
      timestamp: "2 days ago",
      replies: 22,
      likes: 45,
      views: 312,
      tags: ["collaboration", "cross-functional", "ideas"]
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Monthly Podcast Creators Meetup",
      description: "Virtual meetup for all podcast creators to share experiences and learn from each other",
      date: "2024-02-15",
      time: "3:00 PM EST",
      host: "Community Team",
      attendees: 23,
      type: "meetup",
      joinUrl: "https://example.com/events/1/join",
      calendarUrl: "https://example.com/events/1/calendar.ics"
    },
    {
      id: 2,
      title: "Q&A with Leadership Team",
      description: "Live Q&A session about company direction and upcoming initiatives",
      date: "2024-02-20",
      time: "2:00 PM EST",
      host: "Sarah Johnson, CEO",
      attendees: 89,
      type: "qa",
      joinUrl: "https://example.com/events/2/join",
      calendarUrl: "https://example.com/events/2/calendar.ics"
    },
    {
      id: 3,
      title: "Podcast Workshop: Interview Techniques",
      description: "Hands-on workshop covering effective interview techniques for engaging conversations",
      date: "2024-02-25",
      time: "1:00 PM EST",
      host: "Emma Rodriguez",
      attendees: 12,
      type: "workshop",
      joinUrl: "https://example.com/events/3/join",
      calendarUrl: "https://example.com/events/3/calendar.ics"
    }
  ];

  const topContributors = [
    { name: "Alex Chen", department: "Engineering", posts: 24, helpful: 156 },
    { name: "Sarah Johnson", department: "Marketing", posts: 18, helpful: 134 },
    { name: "Emma Rodriguez", department: "HR", posts: 15, helpful: 98 },
    { name: "Mike David", department: "Product", posts: 12, helpful: 87 },
    { name: "Lisa Thompson", department: "Marketing", posts: 10, helpful: 72 }
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      toast({
        title: "Post created!",
        description: "Your discussion post has been published to the community.",
      });
      setNewPostContent("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-poppins">Community</h1>
          <p className="text-muted-foreground text-lg">
            Connect with fellow podcasters, share knowledge, and build our podcasting community
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="events">Events & Q&A</TabsTrigger>
                <TabsTrigger value="create">Create Post</TabsTrigger>
              </TabsList>

              {/* Discussions Tab */}
              <TabsContent value="discussions">
                <div className="space-y-6">
                  {/* Search and Filter */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input placeholder="Search discussions..." className="pl-10" />
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Discussion Posts */}
                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <Card key={discussion.id} className="hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{discussion.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    {discussion.pinned && <Pin className="h-4 w-4 text-primary" />}
                                    <h3 className="font-semibold text-lg">{discussion.title}</h3>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <span>{discussion.author}</span>
                                    <span>•</span>
                                    <span>{discussion.department}</span>
                                    <span>•</span>
                                    <span>{discussion.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <p className="text-muted-foreground">{discussion.content}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                              {discussion.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Stats and Actions */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{discussion.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{discussion.replies}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{discussion.views}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Heart className="h-4 w-4 mr-1" />
                                  Like
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Reply className="h-4 w-4 mr-1" />
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>Upcoming Events</span>
                      </CardTitle>
                      <CardDescription>
                        Join live sessions, workshops, and community meetups
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold">{event.title}</h4>
                                <Badge variant={
                                  event.type === 'qa' ? 'default' :
                                  event.type === 'workshop' ? 'secondary' :
                                  'outline'
                                }>
                                  {event.type.toUpperCase()}
                                </Badge>
                                {event.type === 'qa' && <Radio className="h-4 w-4 text-red-500" />}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{event.attendees} attending</span>
                                </div>
                              </div>
                              <p className="text-sm mt-1">Hosted by <strong>{event.host}</strong></p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button size="sm" onClick={() => window.open(event.joinUrl)}>
                                Join Event
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  window.open(event.calendarUrl);
                                  addNotification({
                                    type: "reminder",
                                    title: event.title,
                                    message: `Reminder set for ${event.title}`,
                                    action_url: event.joinUrl,
                                  });
                                }}
                              >
                                Remind Me
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Past Events Archive */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Past Events Archive</CardTitle>
                      <CardDescription>
                        Catch up on recordings from previous community events
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Event recordings will appear here</p>
                        <p className="text-sm">Check back after our first community events!</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Create Post Tab */}
              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="h-5 w-5 text-primary" />
                      <span>Start a Discussion</span>
                    </CardTitle>
                    <CardDescription>
                      Share your thoughts, ask questions, or start a conversation with the community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePostSubmit} className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Discussion Title</label>
                        <Input placeholder="What would you like to discuss?" />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Content</label>
                        <Textarea
                          placeholder="Share your thoughts, questions, or ideas..."
                          rows={6}
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Tags</label>
                        <Input placeholder="Add relevant tags (e.g., technical, hosting, equipment)" />
                        <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Posts are visible to all community members
                        </div>
                        <Button type="submit">
                          <Send className="h-4 w-4 mr-2" />
                          Post Discussion
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Community Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">147</div>
                  <div className="text-sm text-muted-foreground">Active Members</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">23</div>
                    <div className="text-xs text-muted-foreground">Discussions</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">156</div>
                    <div className="text-xs text-muted-foreground">Replies</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Top Contributors</span>
                </CardTitle>
                <CardDescription>Most helpful community members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <div key={contributor.name} className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-primary">#{index + 1}</div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{contributor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{contributor.name}</div>
                      <div className="text-xs text-muted-foreground">{contributor.department}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {contributor.helpful} helpful
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Be Respectful:</strong> Treat all members with courtesy and professionalism
                </div>
                <div>
                  <strong>Stay On Topic:</strong> Keep discussions relevant to podcasting and our community
                </div>
                <div>
                  <strong>Share Knowledge:</strong> Help others learn and grow in their podcasting journey
                </div>
                <div>
                  <strong>Be Constructive:</strong> Provide helpful feedback and suggestions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
