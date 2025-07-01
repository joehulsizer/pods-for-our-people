"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import PodcastPlayer from "@/components/PodcastPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Play,
  Clock,
  Users,
  Star,
  Calendar,
  TrendingUp,
  Heart,
  MessageSquare,
  Download,
  Loader2
} from "lucide-react";
import { podcastService, type Podcast } from "@/lib/database-service";

export default function PodcastsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const departments = [
    "All Departments",
    "Leadership",
    "Human Resources",
    "AI Team",
    "Marketing",
    "Product",
    "Engineering",
    "Operations",
    "Sales"
  ];

  // Fetch podcasts on component mount
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await podcastService.getApprovedPodcasts();
        setPodcasts(data);
        setFilteredPodcasts(data);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setError("Failed to load podcasts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  // Filter and sort podcasts
  useEffect(() => {
    let filtered = podcasts.filter(podcast => {
      const matchesSearch =
        podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        podcast.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        podcast.host.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" ||
        podcast.department.toLowerCase() === selectedDepartment.toLowerCase();

      return matchesSearch && matchesDepartment;
    });

    // Sort podcasts
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.view_count || 0) - (a.view_count || 0);
        case "rating":
          return (b.like_count || 0) - (a.like_count || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredPodcasts(filtered);
  }, [podcasts, searchTerm, selectedDepartment, sortBy]);

  const handlePodcastPlay = async (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setIsPlayerMinimized(false);

    // Record view
    try {
      await podcastService.recordView(podcast.id);
      // Update local podcast view count
      setPodcasts(prev => prev.map(p =>
        p.id === podcast.id
          ? { ...p, view_count: (p.view_count || 0) + 1 }
          : p
      ));
    } catch (err) {
      console.error("Error recording view:", err);
    }
  };

  const handleLike = async (podcastId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      const isLiked = await podcastService.toggleLike(podcastId);

      // Update local state
      setPodcasts(prev => prev.map(p =>
        p.id === podcastId
          ? { ...p, like_count: isLiked ? (p.like_count || 0) + 1 : Math.max((p.like_count || 0) - 1, 0) }
          : p
      ));

      toast({
        title: isLiked ? "Podcast liked!" : "Like removed",
        description: isLiked ? "Added to your favorites" : "Removed from favorites",
      });
    } catch (err) {
      console.error("Error toggling like:", err);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDuration = (duration: string) => {
    // Handle different duration formats
    if (duration.includes('min')) return duration;
    // If it's just a number, assume minutes
    const num = Number.parseInt(duration);
    return Number.isNaN(num) ? duration : `${num} min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading podcasts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-poppins">Browse Podcasts</h1>
          <p className="text-muted-foreground text-lg">Discover engaging content from across the organization</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search podcasts, hosts, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.slice(1).map(dept => (
                  <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <TrendingUp className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredPodcasts.length} podcast{filteredPodcasts.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedDepartment !== "all" && ` in ${departments.find(d => d.toLowerCase() === selectedDepartment)}`}
          </p>
        </div>

        {/* Podcast Grid */}
        {filteredPodcasts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPodcasts.map((podcast) => (
              <Card key={podcast.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{podcast.department}</Badge>
                      {podcast.is_new && <Badge className="bg-primary">New</Badge>}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{podcast.like_count || 0}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {podcast.title}
                  </CardTitle>
                  <CardDescription>
                    {podcast.episode_number && `Episode ${podcast.episode_number} • `}
                    Hosted by {podcast.host_full_name || podcast.host}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{podcast.description}</p>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{getDuration(podcast.duration)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{podcast.view_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(podcast.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <button
                        onClick={(e) => handleLike(podcast.id, e)}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{podcast.like_count || 0}</span>
                      </button>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{podcast.comment_count || 0}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handlePodcastPlay(podcast)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Listen Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">No podcasts found</div>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedDepartment("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Podcast Player */}
        {selectedPodcast && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              <PodcastPlayer
                podcast={{
                  id: selectedPodcast.id,
                  title: selectedPodcast.title,
                  host: selectedPodcast.host_full_name || selectedPodcast.host,
                  department: selectedPodcast.department,
                  description: selectedPodcast.description,
                  audioUrl: selectedPodcast.audio_url,
                  videoUrl: selectedPodcast.video_url,
                  duration: selectedPodcast.duration,
                  listeners: selectedPodcast.view_count || 0
                }}
                isMinimized={isPlayerMinimized}
                onMinimize={() => setIsPlayerMinimized(true)}
                onClose={() => {
                  setSelectedPodcast(null);
                  setIsPlayerMinimized(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
