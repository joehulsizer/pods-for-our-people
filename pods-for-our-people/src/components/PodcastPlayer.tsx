"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Share,
  Heart,
  MessageSquare,
  Download,
  Settings,
  Clock,
  Users,
  Eye,
  EyeOff
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PodcastPlayerProps {
  podcast: {
    id: string;
    title: string;
    host: string;
    department: string;
    description: string;
    audioUrl?: string;
    videoUrl?: string;
    duration: string;
    listeners: number;
    isLive?: boolean;
    liveViewers?: number;
  };
  isMinimized?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
}

const PodcastPlayer = ({ podcast, isMinimized = false, onMinimize, onClose }: PodcastPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isVideoMode, setIsVideoMode] = useState(!!podcast.videoUrl);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mediaRef = isVideoMode ? videoRef : audioRef;

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const updateTime = () => setCurrentTime(media.currentTime);
    const updateDuration = () => setDuration(media.duration);

    media.addEventListener('timeupdate', updateTime);
    media.addEventListener('loadedmetadata', updateDuration);
    media.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      media.removeEventListener('timeupdate', updateTime);
      media.removeEventListener('loadedmetadata', updateDuration);
      media.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [isVideoMode, mediaRef]);

  const togglePlay = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const media = mediaRef.current;
    if (!media) return;

    const newTime = (value[0] / 100) * duration;
    media.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const media = mediaRef.current;
    if (!media) return;

    const newVolume = value[0];
    setVolume(newVolume);
    media.volume = newVolume / 100;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isMuted) {
      media.volume = volume / 100;
      setIsMuted(false);
    } else {
      media.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    const media = mediaRef.current;
    if (!media) return;

    media.currentTime = Math.max(0, Math.min(duration, media.currentTime + seconds));
  };

  const changeSpeed = () => {
    const media = mediaRef.current;
    if (!media) return;

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];

    setPlaybackSpeed(nextSpeed);
    media.playbackRate = nextSpeed;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 shadow-lg border-primary z-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Button size="sm" variant="ghost" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{podcast.title}</p>
              <p className="text-xs text-muted-foreground truncate">{podcast.host}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
          <div className="mt-2">
            <Slider
              value={[duration ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">{podcast.department}</Badge>
              {podcast.isLive && (
                <Badge className="bg-red-500 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-1" />
                  LIVE
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-1">{podcast.title}</h2>
            <p className="text-muted-foreground mb-2">Hosted by {podcast.host}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{podcast.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {podcast.isLive && (
              <div className="flex items-center space-x-1 text-sm text-red-500">
                <Eye className="h-4 w-4" />
                <span>{podcast.liveViewers || 0} watching</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={onMinimize}>
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        {/* Video Player */}
        {isVideoMode && (
          <div className="relative mb-6 bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={podcast.videoUrl}
              className="w-full aspect-video"
              poster="/api/placeholder/800/450"
            />
          </div>
        )}

        {/* Audio Player (hidden) */}
        <audio
          ref={audioRef}
          src={podcast.audioUrl || "/api/placeholder-audio.mp3"}
          preload="metadata"
        />

        {/* Controls */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[duration ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => skipTime(-15)}>
              <SkipBack className="h-5 w-5" />
              <span className="text-xs ml-1">15</span>
            </Button>

            <Button onClick={togglePlay} size="lg" className="rounded-full w-12 h-12">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => skipTime(30)}>
              <span className="text-xs mr-1">30</span>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Volume */}
              <Button variant="ghost" size="sm" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                className="w-20"
                max={100}
              />
            </div>

            <div className="flex items-center space-x-2">
              {/* Speed Control */}
              <Button variant="ghost" size="sm" onClick={changeSpeed}>
                <Clock className="h-4 w-4 mr-1" />
                {playbackSpeed}x
              </Button>

              {/* Video/Audio Toggle */}
              {podcast.videoUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVideoMode(!isVideoMode)}
                >
                  {isVideoMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}

              {/* Settings */}
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                Like
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Comments
              </Button>

              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>

              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{podcast.listeners} listeners</span>
            </div>
          </div>

          {/* Transcript Toggle */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTranscript(!showTranscript)}
            >
              {showTranscript ? "Hide" : "Show"} Transcript
            </Button>
          </div>

          {/* Transcript */}
          {showTranscript && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Transcript</h4>
              <div className="text-sm text-muted-foreground space-y-2 max-h-40 overflow-y-auto">
                <p><strong>[00:00]</strong> Welcome to {podcast.title}. I'm your host, {podcast.host}.</p>
                <p><strong>[00:15]</strong> Today we'll be discussing some exciting developments in our {podcast.department} department.</p>
                <p><strong>[00:30]</strong> {podcast.description}</p>
                <p><strong>[01:00]</strong> Let's dive right into the main topics...</p>
              </div>
            </div>
          )}

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3">Comments</h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                <div className="flex items-start space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm"><strong>John Doe</strong> Great insights on the new strategy!</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm"><strong>Sarah Miller</strong> Thanks for sharing this with the team!</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PodcastPlayer;
