-- Supabase Database Schema for Pods for our People
-- This file contains the complete database schema for the internal podcasting platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notification_type AS ENUM ('live_stream', 'new_podcast', 'like', 'comment', 'approval', 'reminder', 'mention');
CREATE TYPE discussion_status AS ENUM ('open', 'closed', 'pinned');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    department TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Podcasts table
CREATE TABLE IF NOT EXISTS public.podcasts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    host TEXT NOT NULL,
    host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    duration TEXT,
    audio_url TEXT,
    video_url TEXT,
    transcript TEXT,
    status approval_status DEFAULT 'pending',
    category TEXT,
    tags TEXT[],
    episode_number INTEGER,
    is_new BOOLEAN DEFAULT TRUE,
    publish_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Podcast interactions (likes, views, etc.)
CREATE TABLE IF NOT EXISTS public.podcast_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    podcast_id UUID REFERENCES public.podcasts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL, -- 'like', 'view', 'download'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(podcast_id, user_id, interaction_type)
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    podcast_id UUID REFERENCES public.podcasts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Live streams table
CREATE TABLE IF NOT EXISTS public.live_streams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    host TEXT NOT NULL,
    host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    stream_url TEXT,
    max_viewers INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Live stream viewers (for real-time tracking)
CREATE TABLE IF NOT EXISTS public.stream_viewers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stream_id UUID REFERENCES public.live_streams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(stream_id, user_id)
);

-- Chat messages for live streams
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stream_id UUID REFERENCES public.live_streams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Community discussions
CREATE TABLE IF NOT EXISTS public.discussions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status discussion_status DEFAULT 'open',
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Discussion replies
CREATE TABLE IF NOT EXISTS public.discussion_replies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Discussion interactions (likes, etc.)
CREATE TABLE IF NOT EXISTS public.discussion_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL, -- 'like', 'view'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(discussion_id, user_id, interaction_type)
);

-- Podcast requests
CREATE TABLE IF NOT EXISTS public.podcast_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    request_type TEXT NOT NULL, -- 'topic', 'person'
    requested_person TEXT,
    requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT,
    status TEXT DEFAULT 'open', -- 'open', 'in-progress', 'completed'
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Request votes
CREATE TABLE IF NOT EXISTS public.request_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID REFERENCES public.podcast_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(request_id, user_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Events/Q&A sessions
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    host TEXT NOT NULL,
    host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'meetup', 'qa', 'workshop'
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    max_attendees INTEGER,
    is_virtual BOOLEAN DEFAULT TRUE,
    meeting_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Event attendees
CREATE TABLE IF NOT EXISTS public.event_attendees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    attended BOOLEAN DEFAULT FALSE,
    UNIQUE(event_id, user_id)
);

-- Views for easy data access with aggregations
CREATE VIEW public.podcast_stats AS
SELECT
    p.*,
    COALESCE(likes.like_count, 0) as like_count,
    COALESCE(views.view_count, 0) as view_count,
    COALESCE(downloads.download_count, 0) as download_count,
    COALESCE(comments.comment_count, 0) as comment_count,
    prof.full_name as host_full_name,
    prof.department as host_department
FROM public.podcasts p
LEFT JOIN public.profiles prof ON p.host_id = prof.id
LEFT JOIN (
    SELECT podcast_id, COUNT(*) as like_count
    FROM public.podcast_interactions
    WHERE interaction_type = 'like'
    GROUP BY podcast_id
) likes ON p.id = likes.podcast_id
LEFT JOIN (
    SELECT podcast_id, COUNT(*) as view_count
    FROM public.podcast_interactions
    WHERE interaction_type = 'view'
    GROUP BY podcast_id
) views ON p.id = views.podcast_id
LEFT JOIN (
    SELECT podcast_id, COUNT(*) as download_count
    FROM public.podcast_interactions
    WHERE interaction_type = 'download'
    GROUP BY podcast_id
) downloads ON p.id = downloads.podcast_id
LEFT JOIN (
    SELECT podcast_id, COUNT(*) as comment_count
    FROM public.comments
    GROUP BY podcast_id
) comments ON p.id = comments.podcast_id;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Podcasts policies
CREATE POLICY "Approved podcasts are viewable by everyone." ON public.podcasts FOR SELECT USING (status = 'approved' OR auth.uid() = host_id);
CREATE POLICY "Users can insert their own podcasts." ON public.podcasts FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Users can update their own podcasts." ON public.podcasts FOR UPDATE USING (auth.uid() = host_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments." ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own comments." ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments." ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Interactions policies
CREATE POLICY "Interactions are viewable by everyone." ON public.podcast_interactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can interact." ON public.podcast_interactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own interactions." ON public.podcast_interactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own interactions." ON public.podcast_interactions FOR DELETE USING (auth.uid() = user_id);

-- Live streams policies
CREATE POLICY "Live streams are viewable by everyone." ON public.live_streams FOR SELECT USING (true);
CREATE POLICY "Users can create live streams." ON public.live_streams FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Users can update their own streams." ON public.live_streams FOR UPDATE USING (auth.uid() = host_id);

-- Chat messages policies
CREATE POLICY "Chat messages are viewable by everyone." ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages." ON public.chat_messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Notifications policies
CREATE POLICY "Users can view their own notifications." ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications." ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Functions for triggers and RPC calls
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $
BEGIN
  INSERT INTO public.profiles (id, email, full_name, department)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'department'
  );
  RETURN new;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Function to increment request votes
CREATE OR REPLACE FUNCTION public.increment_request_votes(request_id UUID)
RETURNS void AS $
BEGIN
  UPDATE public.podcast_requests
  SET vote_count = vote_count + 1
  WHERE id = request_id;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement request votes
CREATE OR REPLACE FUNCTION public.decrement_request_votes(request_id UUID)
RETURNS void AS $
BEGIN
  UPDATE public.podcast_requests
  SET vote_count = GREATEST(vote_count - 1, 0)
  WHERE id = request_id;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user notification count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count(user_id UUID)
RETURNS integer AS $
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM public.notifications
    WHERE user_id = $1 AND read = false
  );
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Updated at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_podcasts_updated_at BEFORE UPDATE ON public.podcasts FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_live_streams_updated_at BEFORE UPDATE ON public.live_streams FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON public.discussions FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_discussion_replies_updated_at BEFORE UPDATE ON public.discussion_replies FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_podcast_requests_updated_at BEFORE UPDATE ON public.podcast_requests FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Sample data for development
-- Note: This would be run separately after user authentication is set up

-- Initial departments data
-- INSERT INTO public.podcasts (title, description, host, department, duration, audio_url, status) VALUES
-- ('Leadership Insights', 'Weekly insights from our executive team on company vision and strategy.', 'Sarah Johnson', 'Leadership', '24 min', '/audio/leadership-insights.mp3', 'approved'),
-- ('AI Innovation Corner', 'Exploring the latest AI developments and their impact on our products.', 'Dr. Michael Chen', 'AI Team', '32 min', '/audio/ai-innovation.mp3', 'approved'),
-- ('People & Culture', 'Building a stronger workplace culture through shared stories and insights.', 'Emma Rodriguez', 'Human Resources', '18 min', '/audio/people-culture.mp3', 'approved');
