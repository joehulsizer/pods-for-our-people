"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  User,
  Lightbulb,
  Send,
  Clock,
  CheckCircle,
  Heart,
  TrendingUp,
  Users,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RequestPage() {
  const [activeTab, setActiveTab] = useState("suggest");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const departments = [
    "Leadership",
    "Human Resources",
    "AI Team",
    "Marketing",
    "Product",
    "Engineering",
    "Operations",
    "Sales"
  ];

  const topRequests = [
    {
      id: 1,
      type: "topic",
      title: "Introduction to Machine Learning for Non-Technical Teams",
      description: "A beginner-friendly explanation of ML concepts and how they apply to our work",
      requestedBy: "Sarah M.",
      department: "Marketing",
      votes: 34,
      status: "open"
    },
    {
      id: 2,
      type: "person",
      title: "Request for CEO to discuss Q1 strategy",
      description: "Would love to hear directly from leadership about our strategic direction",
      requestedBy: "Alex K.",
      department: "Product",
      votes: 28,
      status: "in-progress"
    },
    {
      id: 3,
      type: "topic",
      title: "Remote Work Best Practices",
      description: "Tips and strategies for effective remote collaboration and productivity",
      requestedBy: "Emma R.",
      department: "HR",
      votes: 22,
      status: "open"
    },
    {
      id: 4,
      type: "person",
      title: "Interview with our Customer Success team lead",
      description: "Insights into customer feedback and how it shapes our product roadmap",
      requestedBy: "Mike D.",
      department: "Engineering",
      votes: 19,
      status: "completed"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Request submitted successfully!",
        description: "Your podcast request has been added to the community board. Others can now vote on it!",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-poppins">Request a Podcast</h1>
          <p className="text-muted-foreground text-lg">
            Suggest topics or request specific colleagues to share their expertise
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="suggest" className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Suggest Topic</span>
                </TabsTrigger>
                <TabsTrigger value="person" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Request Person</span>
                </TabsTrigger>
              </TabsList>

              {/* Suggest Topic Tab */}
              <TabsContent value="suggest">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <span>Suggest a Podcast Topic</span>
                    </CardTitle>
                    <CardDescription>
                      Have an idea for a podcast topic? Share it with the community!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="topic-title">Podcast Topic *</Label>
                        <Input
                          id="topic-title"
                          placeholder="Enter your suggested podcast topic"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="suggested-department">Target Department</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Who should create this?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any Department</SelectItem>
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="topic-category">Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="education">Educational</SelectItem>
                              <SelectItem value="strategy">Strategy & Vision</SelectItem>
                              <SelectItem value="culture">Culture & Values</SelectItem>
                              <SelectItem value="technical">Technical Deep Dive</SelectItem>
                              <SelectItem value="industry">Industry Insights</SelectItem>
                              <SelectItem value="process">Process & Workflow</SelectItem>
                              <SelectItem value="innovation">Innovation & Ideas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="topic-description">Why is this important? *</Label>
                        <Textarea
                          id="topic-description"
                          placeholder="Explain why this topic would be valuable, what questions it would answer, and who would benefit from listening."
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="topic-questions">Specific Questions or Subtopics</Label>
                        <Textarea
                          id="topic-questions"
                          placeholder="List specific questions you'd like answered or subtopics to cover (optional)"
                          rows={3}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="requestor-name">Your Name *</Label>
                          <Input
                            id="requestor-name"
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="requestor-dept">Your Department *</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Your request will be visible to everyone for voting
                        </div>
                        <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90">
                          {submitting ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Submit Topic Request
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Request Person Tab */}
              <TabsContent value="person">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <span>Request a Specific Person</span>
                    </CardTitle>
                    <CardDescription>
                      Want to hear from a specific colleague? Make a request!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="person-name">Person to Request *</Label>
                          <Input
                            id="person-name"
                            placeholder="Name of the person you'd like to hear from"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="person-department">Their Department</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select their department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="person-role">Their Role/Title</Label>
                        <Input
                          id="person-role"
                          placeholder="e.g., Senior Engineer, Marketing Manager, etc."
                        />
                      </div>

                      <div>
                        <Label htmlFor="person-topic">Suggested Topic *</Label>
                        <Input
                          id="person-topic"
                          placeholder="What topic would you like them to discuss?"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="person-reason">Why this person? *</Label>
                        <Textarea
                          id="person-reason"
                          placeholder="Explain why this person would be the perfect host for this topic. What unique expertise or perspective do they bring?"
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="person-format">Suggested Format</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="How should this be structured?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solo">Solo presentation</SelectItem>
                            <SelectItem value="interview">Interview style</SelectItem>
                            <SelectItem value="panel">Panel discussion</SelectItem>
                            <SelectItem value="qa">Q&A session</SelectItem>
                            <SelectItem value="walkthrough">Project walkthrough</SelectItem>
                            <SelectItem value="tutorial">Tutorial/How-to</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="person-requestor">Your Name *</Label>
                          <Input
                            id="person-requestor"
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="person-requestor-dept">Your Department *</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Request will be sent to the person and made public for voting
                        </div>
                        <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90">
                          {submitting ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Submit Person Request
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Popular Requests */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Popular Requests</span>
                </CardTitle>
                <CardDescription>Community-requested podcast ideas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm leading-tight">{request.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{request.description}</p>
                      </div>
                      <Badge variant={
                        request.status === 'completed' ? 'default' :
                        request.status === 'in-progress' ? 'secondary' :
                        'outline'
                      } className="text-xs">
                        {request.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>by {request.requestedBy} • {request.department}</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <Heart className="h-3 w-3 mr-1" />
                          {request.votes}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>How It Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">1. Submit Your Request</h4>
                  <p className="text-muted-foreground">Share your topic idea or person request with detailed information.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">2. Community Voting</h4>
                  <p className="text-muted-foreground">Colleagues can vote on requests to show interest and priority.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">3. Creation & Approval</h4>
                  <p className="text-muted-foreground">Popular requests are picked up by volunteers or invited speakers.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">4. Publication</h4>
                  <p className="text-muted-foreground">Completed podcasts go through approval and are published to the platform.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
