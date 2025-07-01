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
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Mic,
  Video,
  FileAudio,
  FileVideo,
  Calendar,
  Users,
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState("live");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast({
            title: "Podcast submitted successfully!",
            description: "Your podcast has been sent for approval and will be published once reviewed.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-poppins">Create Your Podcast</h1>
          <p className="text-muted-foreground text-lg">Share your knowledge and connect with colleagues</p>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-foreground">
                <strong>Before you start:</strong> All podcasts require approval before publication.
                You'll receive a notification once your content has been reviewed and approved by your department manager.
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Live Recording</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload File</span>
            </TabsTrigger>
          </TabsList>

          {/* Live Recording Tab */}
          <TabsContent value="live">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mic className="h-5 w-5 text-primary" />
                  <span>Live Podcast Recording</span>
                </CardTitle>
                <CardDescription>
                  Record your podcast live or schedule a Zoom session for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Podcast Title *</Label>
                        <Input
                          id="title"
                          placeholder="Enter your podcast title"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="department">Department *</Label>
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

                      <div>
                        <Label htmlFor="host">Host Name *</Label>
                        <Input
                          id="host"
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="guests">Co-hosts/Guests</Label>
                        <Input
                          id="guests"
                          placeholder="Add co-hosts or guests (optional)"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="recordingType">Recording Method *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose recording method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="live-now">Record Live Now</SelectItem>
                            <SelectItem value="zoom-scheduled">Schedule Zoom Session</SelectItem>
                            <SelectItem value="zoom-instant">Start Zoom Meeting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="duration">Estimated Duration</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="audience">Target Audience</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Who should listen?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Employees</SelectItem>
                            <SelectItem value="department">My Department</SelectItem>
                            <SelectItem value="leadership">Leadership Team</SelectItem>
                            <SelectItem value="specific">Specific Teams</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="scheduled-date">Scheduled Date (if applicable)</Label>
                        <Input
                          id="scheduled-date"
                          type="datetime-local"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your podcast will cover. Include key topics, learning objectives, and why colleagues should listen."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Add relevant tags (e.g., strategy, innovation, culture)"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Separate tags with commas</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      This will be sent for approval before publishing
                    </div>
                    <Button type="submit" disabled={uploading} className="bg-primary hover:bg-primary/90">
                      {uploading ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload File Tab */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <span>Upload Podcast File</span>
                </CardTitle>
                <CardDescription>
                  Upload a pre-recorded audio or video podcast file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <div className="space-y-4">
                      <div className="flex justify-center space-x-4">
                        <FileAudio className="h-12 w-12 text-muted-foreground" />
                        <FileVideo className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">Drop your podcast file here</p>
                        <p className="text-muted-foreground">or click to browse</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Supported formats: MP3, MP4, WAV, MOV (Max 500MB)
                      </div>
                      <Button variant="outline" type="button">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  </div>

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="upload-title">Podcast Title *</Label>
                        <Input
                          id="upload-title"
                          placeholder="Enter your podcast title"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="upload-department">Department *</Label>
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

                      <div>
                        <Label htmlFor="upload-host">Host Name *</Label>
                        <Input
                          id="upload-host"
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="upload-guests">Co-hosts/Guests</Label>
                        <Input
                          id="upload-guests"
                          placeholder="Add co-hosts or guests (optional)"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="upload-category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="education">Educational</SelectItem>
                            <SelectItem value="updates">Company Updates</SelectItem>
                            <SelectItem value="culture">Culture & Values</SelectItem>
                            <SelectItem value="technical">Technical Discussion</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="upload-audience">Target Audience</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Who should listen?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Employees</SelectItem>
                            <SelectItem value="department">My Department</SelectItem>
                            <SelectItem value="leadership">Leadership Team</SelectItem>
                            <SelectItem value="specific">Specific Teams</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="upload-language">Language</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="publish-date">Publish Date</Label>
                        <Input
                          id="publish-date"
                          type="date"
                          placeholder="Leave empty for immediate review"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="upload-description">Description *</Label>
                    <Textarea
                      id="upload-description"
                      placeholder="Describe what your podcast covers. Include key topics, learning objectives, and why colleagues should listen."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="upload-tags">Tags</Label>
                    <Input
                      id="upload-tags"
                      placeholder="Add relevant tags (e.g., strategy, innovation, culture)"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Separate tags with commas</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      This will be sent for approval before publishing
                    </div>
                    <Button type="submit" disabled={uploading} className="bg-primary hover:bg-primary/90">
                      {uploading ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit for Approval
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Need Help?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Recording Tips</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use a quiet environment</li>
                  <li>• Test audio quality first</li>
                  <li>• Prepare an outline</li>
                  <li>• Keep it conversational</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technical Requirements</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Microphone recommended</li>
                  <li>• Stable internet connection</li>
                  <li>• Chrome/Firefox browser</li>
                  <li>• File size limit: 500MB</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Approval Process</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Review within 24-48 hours</li>
                  <li>• Email notification sent</li>
                  <li>• Auto-publish once approved</li>
                  <li>• Feedback if changes needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
