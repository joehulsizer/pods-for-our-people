"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Radio,
  Users,
  MessageSquare,
  Send,
  Heart,
  Share,
  Settings,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Volume2,
  VolumeX
} from "lucide-react";

interface LiveStreamProps {
  streamData: {
    id: string;
    title: string;
    host: string;
    department: string;
    description: string;
    startTime: string;
    viewerCount: number;
    isHostStreaming?: boolean;
  };
  isHost?: boolean;
}

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
  isHost?: boolean;
}

const LiveStream = ({ streamData, isHost = false }: LiveStreamProps) => {
  const [viewerCount, setViewerCount] = useState(streamData.viewerCount);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: streamData.host,
      avatar: streamData.host.split(' ').map(n => n[0]).join(''),
      message: `Welcome everyone! Thanks for joining ${streamData.title}`,
      timestamp: new Date(Date.now() - 300000),
      isHost: true
    },
    {
      id: "2",
      user: "Alex Chen",
      avatar: "AC",
      message: "Excited to learn about this topic!",
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: "3",
      user: "Sarah Johnson",
      avatar: "SJ",
      message: "Great presentation so far 👍",
      timestamp: new Date(Date.now() - 180000)
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(23);

  // Host controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update viewer count
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 6) - 2; // -2 to +3
        return Math.max(0, prev + change);
      });

      // Add random chat messages
      if (Math.random() < 0.3) {
        const users = ["Mike Davis", "Emma Rodriguez", "Lisa Thompson", "David Park"];
        const messages = [
          "Great insights!",
          "This is really helpful",
          "Can you share the slides?",
          "Excellent explanation",
          "Looking forward to Q&A",
          "Thanks for this session"
        ];

        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          user: randomUser,
          avatar: randomUser.split(' ').map(n => n[0]).join(''),
          message: randomMessage,
          timestamp: new Date()
        };

        setChatMessages(prev => [...prev, newMsg]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: isHost ? streamData.host : "You",
      avatar: isHost ? streamData.host.split(' ').map(n => n[0]).join('') : "YU",
      message: newMessage,
      timestamp: new Date(),
      isHost
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Main Stream Area */}
      <div className="lg:col-span-2 space-y-4">
        {/* Stream Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">{streamData.department}</Badge>
                  <Badge className="bg-red-500 animate-pulse">
                    <Radio className="w-3 h-3 mr-1" />
                    LIVE
                  </Badge>
                </div>
                <CardTitle className="text-xl">{streamData.title}</CardTitle>
                <p className="text-muted-foreground mt-1">Hosted by {streamData.host}</p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{viewerCount} watching</span>
                </div>
                <span>Started {formatTime(new Date(streamData.startTime))}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Video Stream */}
        <Card>
          <CardContent className="p-0">
            <div className="relative bg-black aspect-video rounded-lg overflow-hidden">
              {/* Simulated video stream */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="text-center text-white">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Live Stream Active</p>
                  <p className="text-sm opacity-75">{streamData.title}</p>
                </div>
              </div>

              {/* Stream Controls Overlay */}
              {isHost && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={isMicOn ? "default" : "destructive"}
                        onClick={() => setIsMicOn(!isMicOn)}
                      >
                        {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant={isVideoOn ? "default" : "destructive"}
                        onClick={() => setIsVideoOn(!isVideoOn)}
                      >
                        {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant={isScreenSharing ? "secondary" : "outline"}
                        onClick={() => setIsScreenSharing(!isScreenSharing)}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        End Stream
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Viewer Controls */}
              {!isHost && (
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stream Description */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">{streamData.description}</p>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                {likes}
              </Button>
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Sidebar */}
      <div className="space-y-4">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Live Chat</span>
              <Badge variant="outline">{chatMessages.length}</Badge>
            </CardTitle>
          </CardHeader>

          <Separator />

          {/* Chat Messages */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <div className="h-full overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-2">
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarFallback className="text-xs">{message.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className={`text-sm font-medium ${message.isHost ? 'text-primary' : ''}`}>
                        {message.user}
                      </span>
                      {message.isHost && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          HOST
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground break-words">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </CardContent>

          <Separator />

          {/* Chat Input */}
          <CardContent className="pt-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stream Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Stream Statistics</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Viewers</span>
              <span className="font-medium">{viewerCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Peak Viewers</span>
              <span className="font-medium">{Math.max(viewerCount + 15, 45)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Messages</span>
              <span className="font-medium">{chatMessages.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stream Duration</span>
              <span className="font-medium">
                {Math.floor((Date.now() - new Date(streamData.startTime).getTime()) / 60000)} min
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveStream;
