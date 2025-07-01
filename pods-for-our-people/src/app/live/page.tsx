import Navigation from "@/components/Navigation";
import LiveStream from "@/components/LiveStream";

export default function LivePage() {
  const streamData = {
    id: "live-ai-innovation",
    title: "AI Innovation Corner: Real-Time Machine Learning in Production",
    host: "Dr. Michael Chen",
    department: "AI Team",
    description: "Join us for an in-depth discussion about implementing machine learning models in production environments. We'll cover best practices, common pitfalls, and real-world case studies from our recent projects. This session will include live demos and Q&A.",
    startTime: new Date(Date.now() - 900000).toISOString(), // Started 15 minutes ago
    viewerCount: 43,
    isHostStreaming: true
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Stream Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-6 py-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500 font-semibold">NOW LIVE</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 font-poppins">Live Streaming</h1>
          <p className="text-muted-foreground">Join your colleagues in real-time learning and discussion</p>
        </div>

        <LiveStream streamData={streamData} isHost={false} />
      </div>
    </div>
  );
}
