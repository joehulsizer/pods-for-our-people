"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Play,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  Star,
  Headphones,
  Upload,
  Zap,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { podcastService, type Podcast } from "@/lib/database-service";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [featuredPodcasts, setFeaturedPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const departments = [
    { name: "Leadership", count: 0, icon: TrendingUp },
    { name: "Human Resources", count: 0, icon: Users },
    { name: "AI Team", count: 0, icon: Zap },
    { name: "Marketing", count: 0, icon: Mic },
    { name: "Product", count: 0, icon: BookOpen },
    { name: "Engineering", count: 0, icon: Play }
  ];

  useEffect(() => {
    const fetchFeaturedPodcasts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the most recent approved podcasts as featured content
        const allPodcasts = await podcastService.getApprovedPodcasts();

        // Take the top 3 most popular or recent podcasts
        const featured = allPodcasts
          .sort((a, b) => {
            // Sort by view count first, then by creation date
            const aScore = (a.view_count || 0) * 10 + new Date(a.created_at).getTime() / 1000000000;
            const bScore = (b.view_count || 0) * 10 + new Date(b.created_at).getTime() / 1000000000;
            return bScore - aScore;
          })
          .slice(0, 3);

        setFeaturedPodcasts(featured);
      } catch (err) {
        console.error("Error fetching featured podcasts:", err);
        setError("Failed to load featured content");

        // Show toast notification for error
        toast({
          title: "Connection Issue",
          description: "Unable to load featured podcasts. Please check your connection to Supabase.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPodcasts();
  }, [toast]);

  const formatDuration = (duration: string) => {
    if (duration.includes('min')) return duration;
    const num = Number.parseInt(duration);
    return Number.isNaN(num) ? duration : `${num} min`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Prominent Creation Badge */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            {/* Prominent Creation Badge */}
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Mic className="h-5 w-5 mr-2" />
                Start Your Podcast Journey Today!
              </Badge>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 font-poppins">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Pods for our People
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your internal podcasting platform for communication, education, and engagement.
              Connect with colleagues, share knowledge, and build community through the power of podcasting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-3">
                  <Upload className="h-5 w-5 mr-2" />
                  Create Your Podcast
                </Button>
              </Link>
              <Link href="/podcasts">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  <Headphones className="h-5 w-5 mr-2" />
                  Browse Podcasts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Podcasts */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-poppins">Featured Podcasts</h2>
            <p className="text-muted-foreground text-lg">Discover the most engaging content from your colleagues</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading featured podcasts...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Unable to load featured podcasts</p>
                <p className="text-sm">This is normal if your Supabase database isn't set up yet</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Link href="/upload">
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Create First Podcast
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Setup Guide
                  </Button>
                </Link>
              </div>
            </div>
          ) : featuredPodcasts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No podcasts yet</p>
                <p className="text-sm">Be the first to create a podcast for your team!</p>
              </div>
              <Link href="/upload">
                <Button className="mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Create First Podcast
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPodcasts.map((podcast) => (
                <Card key={podcast.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{podcast.department}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{podcast.like_count || 0}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{podcast.title}</CardTitle>
                    <CardDescription>Hosted by {podcast.host_full_name || podcast.host}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{podcast.description}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(podcast.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{podcast.view_count || 0} listeners</span>
                      </div>
                    </div>
                    <Link href="/podcasts">
                      <Button className="w-full" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Listen Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Departments */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-poppins">Explore by Department</h2>
            <p className="text-muted-foreground text-lg">Find podcasts from different teams across the organization</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {departments.map((dept) => (
              <Link key={dept.name} href={`/podcasts?department=${dept.name.toLowerCase()}`}>
                <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <dept.icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-semibold text-sm mb-1">{dept.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {dept.count > 0 ? `${dept.count} podcasts` : 'Start here'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 font-poppins">Ready to Share Your Voice?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join your colleagues in creating engaging content. Whether you want to share insights,
            educate others, or build community, we provide everything you need to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Mic className="h-5 w-5 mr-2" />
                Create Live Podcast
              </Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline" size="lg">
                <BookOpen className="h-5 w-5 mr-2" />
                Learn Best Practicators
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
