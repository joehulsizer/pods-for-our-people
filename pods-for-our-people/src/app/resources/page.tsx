"use client";

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  PlayCircle,
  Download,
  Mic,
  Users,
  Clock,
  FileText,
  Video,
  Headphones,
  Settings,
  Lightbulb,
  CheckCircle,
  Star,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function ResourcesPage() {
  const quickTips = [
    "Choose a quiet, echo-free environment for recording",
    "Test your audio setup before starting",
    "Prepare an outline but keep the conversation natural",
    "Speak clearly and at a moderate pace",
    "Include engaging introductions and clear conclusions",
    "Keep episodes between 15-45 minutes for optimal engagement"
  ];

  const tutorials = [
    {
      title: "Setting Up Your First Podcast",
      description: "Complete beginner's guide to podcast creation from concept to publication",
      duration: "12 min",
      difficulty: "Beginner",
      type: "video",
      topics: ["Planning", "Equipment", "Recording", "Publishing"]
    },
    {
      title: "Audio Quality Best Practices",
      description: "Learn how to achieve professional sound quality with basic equipment",
      duration: "8 min",
      difficulty: "Beginner",
      type: "video",
      topics: ["Microphones", "Acoustics", "Editing", "Noise Reduction"]
    },
    {
      title: "Engaging Interview Techniques",
      description: "Master the art of conducting compelling interviews with colleagues",
      duration: "15 min",
      difficulty: "Intermediate",
      type: "video",
      topics: ["Question Preparation", "Active Listening", "Follow-up Questions"]
    },
    {
      title: "Using Zoom for Podcast Recording",
      description: "Step-by-step guide to recording high-quality podcasts via Zoom",
      duration: "10 min",
      difficulty: "Beginner",
      type: "video",
      topics: ["Zoom Settings", "Audio Recording", "Screen Sharing", "Best Practices"]
    },
    {
      title: "Storytelling for Corporate Podcasts",
      description: "Transform dry corporate content into engaging narratives",
      duration: "18 min",
      difficulty: "Intermediate",
      type: "video",
      topics: ["Story Structure", "Audience Engagement", "Corporate Messaging"]
    },
    {
      title: "Live Streaming Best Practices",
      description: "Tips for successful live podcast recordings and audience interaction",
      duration: "14 min",
      difficulty: "Advanced",
      type: "video",
      topics: ["Live Streaming", "Audience Interaction", "Technical Setup"]
    }
  ];

  const templates = [
    {
      title: "Episode Planning Template",
      description: "Structured template for planning your podcast episodes",
      format: "PDF",
      pages: 2,
      category: "Planning"
    },
    {
      title: "Interview Question Bank",
      description: "Collection of engaging questions for different types of interviews",
      format: "PDF",
      pages: 5,
      category: "Content"
    },
    {
      title: "Podcast Script Template",
      description: "Flexible script template with intro, main content, and outro sections",
      format: "PDF",
      pages: 3,
      category: "Content"
    },
    {
      title: "Equipment Checklist",
      description: "Complete checklist for recording setup and technical requirements",
      format: "PDF",
      pages: 1,
      category: "Technical"
    },
    {
      title: "Publishing Guidelines",
      description: "Step-by-step guide to our approval process and publishing standards",
      format: "PDF",
      pages: 4,
      category: "Process"
    },
    {
      title: "Promotion Templates",
      description: "Email and announcement templates to promote your published podcast",
      format: "PDF",
      pages: 3,
      category: "Marketing"
    }
  ];

  const technicalGuides = [
    {
      title: "Recommended Equipment",
      content: [
        "USB Microphone: Audio-Technica ATR2100x-USB or Blue Yeti",
        "Headphones: Sony MDR-7506 or Audio-Technica ATH-M40x",
        "Recording Software: Audacity (free) or Adobe Audition",
        "Video: OBS Studio (free) for screen recording",
        "Backup: Cloud storage for recorded files"
      ]
    },
    {
      title: "Audio Settings",
      content: [
        "Sample Rate: 44.1 kHz or 48 kHz",
        "Bit Depth: 16-bit minimum, 24-bit preferred",
        "Format: WAV for recording, MP3 for distribution",
        "Levels: Keep peaks between -12dB to -6dB",
        "Noise Floor: Aim for -60dB or lower"
      ]
    },
    {
      title: "Zoom Configuration",
      content: [
        "Enable 'Record separate audio files for each participant'",
        "Use 'Original Sound' for music and audio content",
        "Record to cloud and local computer as backup",
        "Mute notifications during recording",
        "Use headphones to prevent echo and feedback"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-poppins">Educational Resources</h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to create engaging, professional podcasts
          </p>
        </div>

        {/* Quick Tips Banner */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span>Quick Tips for Success</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tutorials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="technical">Technical Guides</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          {/* Video Tutorials */}
          <TabsContent value="tutorials">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={
                        tutorial.difficulty === 'Beginner' ? 'secondary' :
                        tutorial.difficulty === 'Intermediate' ? 'default' : 'outline'
                      }>
                        {tutorial.difficulty}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{tutorial.duration}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {tutorial.topics.map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Watch Tutorial
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{template.category}</Badge>
                      <div className="text-sm text-muted-foreground">
                        {template.format} • {template.pages} page{template.pages > 1 ? 's' : ''}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Technical Guides */}
          <TabsContent value="technical">
            <div className="grid lg:grid-cols-2 gap-8">
              {technicalGuides.map((guide, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-primary" />
                      <span>{guide.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guide.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              {/* Additional Resources */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <span>External Resources</span>
                  </CardTitle>
                  <CardDescription>Helpful links and tools for podcast creation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Free Tools</h4>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="#" className="text-primary hover:underline flex items-center">
                            Audacity (Audio Editing)
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="text-primary hover:underline flex items-center">
                            OBS Studio (Video Recording)
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="text-primary hover:underline flex items-center">
                            Canva (Podcast Cover Art)
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="text-primary hover:underline flex items-center">
                            Freesound (Background Music)
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Learning Resources</h4>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="#" className="text-primary hover:underline flex items-center">
                            Podcast Movement (Industry Blog)
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="text-primary hover:underline flex items-center">
                            YouTube Audio Basics
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="text-primary hover:underline flex items-center">
                            Zoom Recording Guide
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="text-primary hover:underline flex items-center">
                            Corporate Podcasting Tips
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Examples */}
          <TabsContent value="examples">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span>Featured Example Podcasts</span>
                  </CardTitle>
                  <CardDescription>
                    Learn from successful podcasts created by your colleagues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Leadership Insights - Episode 12</h4>
                      <p className="text-sm text-muted-foreground">
                        Excellent example of executive communication with clear structure,
                        engaging storytelling, and actionable takeaways.
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge variant="secondary">Leadership</Badge>
                        <span className="text-muted-foreground">22 min</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>4.9</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Listen & Learn
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">AI Innovation Corner - Episode 8</h4>
                      <p className="text-sm text-muted-foreground">
                        Perfect example of making technical content accessible to all audiences
                        with clear explanations and real-world examples.
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge variant="secondary">AI Team</Badge>
                        <span className="text-muted-foreground">35 min</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>4.8</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Listen & Learn
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What Makes These Examples Great</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Mic className="h-4 w-4 mr-2 text-primary" />
                        Clear Audio
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Professional sound quality without background noise or echoes
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        Audience Focus
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Content tailored to the intended audience with appropriate language
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        Good Pacing
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Well-structured with natural flow and appropriate episode length
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4 font-poppins">Ready to Create Your First Podcast?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              With these resources and tools, you have everything you need to create engaging,
              professional podcasts that connect with your colleagues and share valuable knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Mic className="h-5 w-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
              <Link href="/request">
                <Button variant="outline" size="lg">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Request a Topic
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
