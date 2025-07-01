import { supabase, type Database } from './supabase'

// Types
export interface Podcast {
  id: string
  title: string
  description: string
  host: string
  host_id: string
  department: string
  duration: string
  audio_url?: string
  video_url?: string
  transcript?: string
  status: 'pending' | 'approved' | 'rejected'
  category?: string
  tags: string[]
  episode_number?: number
  is_new: boolean
  publish_date?: string
  created_at: string
  updated_at: string
  // Aggregated fields from the view
  like_count?: number
  view_count?: number
  download_count?: number
  comment_count?: number
  host_full_name?: string
  host_department?: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  department?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface LiveStream {
  id: string
  title: string
  description: string
  host: string
  host_id: string
  department: string
  start_time: string
  end_time?: string
  is_active: boolean
  stream_url?: string
  max_viewers: number
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  stream_id: string
  user_id: string
  message: string
  created_at: string
  user?: Profile
}

export interface Discussion {
  id: string
  title: string
  content: string
  author_id: string
  status: 'open' | 'closed' | 'pinned'
  tags: string[]
  view_count: number
  created_at: string
  updated_at: string
  author?: Profile
  reply_count?: number
  like_count?: number
}

export interface PodcastRequest {
  id: string
  title: string
  description: string
  request_type: 'topic' | 'person'
  requested_person?: string
  requester_id: string
  category?: string
  status: 'open' | 'in-progress' | 'completed'
  vote_count: number
  created_at: string
  updated_at: string
  requester?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: 'live_stream' | 'new_podcast' | 'like' | 'comment' | 'approval' | 'reminder' | 'mention'
  title: string
  message: string
  read: boolean
  action_url?: string
  metadata?: Record<string, unknown>
  created_at: string
}

// Podcast Services
export const podcastService = {
  // Get all approved podcasts with stats
  async getApprovedPodcasts(): Promise<Podcast[]> {
    const { data, error } = await supabase
      .from('podcast_stats')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get podcasts by department
  async getPodcastsByDepartment(department: string): Promise<Podcast[]> {
    const { data, error } = await supabase
      .from('podcast_stats')
      .select('*')
      .eq('status', 'approved')
      .eq('department', department)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Search podcasts
  async searchPodcasts(query: string): Promise<Podcast[]> {
    const { data, error } = await supabase
      .from('podcast_stats')
      .select('*')
      .eq('status', 'approved')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,host.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get single podcast
  async getPodcastById(id: string): Promise<Podcast | null> {
    const { data, error } = await supabase
      .from('podcast_stats')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  },

  // Create new podcast
  async createPodcast(podcast: Partial<Podcast>): Promise<Podcast> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('podcasts')
      .insert({
        ...podcast,
        host_id: user.data.user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update podcast
  async updatePodcast(id: string, updates: Partial<Podcast>): Promise<Podcast> {
    const { data, error } = await supabase
      .from('podcasts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Like/Unlike podcast
  async toggleLike(podcastId: string): Promise<boolean> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    // Check if already liked
    const { data: existing } = await supabase
      .from('podcast_interactions')
      .select('id')
      .eq('podcast_id', podcastId)
      .eq('user_id', user.data.user.id)
      .eq('interaction_type', 'like')
      .single()

    if (existing) {
      // Unlike
      await supabase
        .from('podcast_interactions')
        .delete()
        .eq('id', existing.id)
      return false
    }
    // Like
    await supabase
      .from('podcast_interactions')
      .insert({
        podcast_id: podcastId,
        user_id: user.data.user.id,
        interaction_type: 'like'
      })
    return true
  },

  // Record view
  async recordView(podcastId: string): Promise<void> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) return

    await supabase
      .from('podcast_interactions')
      .upsert({
        podcast_id: podcastId,
        user_id: user.data.user.id,
        interaction_type: 'view'
      })
  }
}

// Comment Services
export const commentService = {
  // Get comments for podcast
  async getComments(podcastId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles(full_name, avatar_url)
      `)
      .eq('podcast_id', podcastId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Add comment
  async addComment(podcastId: string, content: string, parentId?: string) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('comments')
      .insert({
        podcast_id: podcastId,
        user_id: user.data.user.id,
        content,
        parent_id: parentId
      })
      .select(`
        *,
        user:profiles(full_name, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  }
}

// Live Stream Services
export const liveStreamService = {
  // Get active streams
  async getActiveStreams(): Promise<LiveStream[]> {
    const { data, error } = await supabase
      .from('live_streams')
      .select('*')
      .eq('is_active', true)
      .order('start_time', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get stream by ID
  async getStreamById(id: string): Promise<LiveStream | null> {
    const { data, error } = await supabase
      .from('live_streams')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  },

  // Create live stream
  async createStream(stream: Partial<LiveStream>): Promise<LiveStream> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('live_streams')
      .insert({
        ...stream,
        host_id: user.data.user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Join stream (track viewer)
  async joinStream(streamId: string): Promise<void> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) return

    await supabase
      .from('stream_viewers')
      .upsert({
        stream_id: streamId,
        user_id: user.data.user.id
      })
  },

  // Leave stream
  async leaveStream(streamId: string): Promise<void> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) return

    await supabase
      .from('stream_viewers')
      .update({ left_at: new Date().toISOString() })
      .eq('stream_id', streamId)
      .eq('user_id', user.data.user.id)
  },

  // Get current viewer count
  async getViewerCount(streamId: string): Promise<number> {
    const { count, error } = await supabase
      .from('stream_viewers')
      .select('*', { count: 'exact', head: true })
      .eq('stream_id', streamId)
      .is('left_at', null)

    if (error) return 0
    return count || 0
  }
}

// Chat Services
export const chatService = {
  // Get chat messages for stream
  async getChatMessages(streamId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        user:profiles(full_name, avatar_url)
      `)
      .eq('stream_id', streamId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Send chat message
  async sendMessage(streamId: string, message: string): Promise<ChatMessage> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        stream_id: streamId,
        user_id: user.data.user.id,
        message
      })
      .select(`
        *,
        user:profiles(full_name, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Subscribe to chat messages
  subscribeToChatMessages(streamId: string, callback: (message: ChatMessage) => void) {
    return supabase
      .channel(`chat:${streamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `stream_id=eq.${streamId}`
        },
        async (payload) => {
          // Fetch the message with user data
          const { data } = await supabase
            .from('chat_messages')
            .select(`
              *,
              user:profiles(full_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) callback(data)
        }
      )
      .subscribe()
  }
}

// Discussion Services
export const discussionService = {
  // Get all discussions
  async getDiscussions(): Promise<Discussion[]> {
    const { data, error } = await supabase
      .from('discussions')
      .select(`
        *,
        author:profiles(full_name, avatar_url, department)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create discussion
  async createDiscussion(discussion: Partial<Discussion>): Promise<Discussion> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('discussions')
      .insert({
        ...discussion,
        author_id: user.data.user.id
      })
      .select(`
        *,
        author:profiles(full_name, avatar_url, department)
      `)
      .single()

    if (error) throw error
    return data
  }
}

// Notification Services
export const notificationService = {
  // Get user notifications
  async getUserNotifications(): Promise<Notification[]> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) return []

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.data.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) return

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.data.user.id)
  },

  // Create notification
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<void> {
    await supabase
      .from('notifications')
      .insert(notification)
  },

  // Subscribe to user notifications
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback(payload.new as Notification)
      )
      .subscribe()
  }
}

// Request Services
export const requestService = {
  // Get podcast requests
  async getRequests(): Promise<PodcastRequest[]> {
    const { data, error } = await supabase
      .from('podcast_requests')
      .select(`
        *,
        requester:profiles(full_name, department)
      `)
      .order('vote_count', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create request
  async createRequest(request: Partial<PodcastRequest>): Promise<PodcastRequest> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('podcast_requests')
      .insert({
        ...request,
        requester_id: user.data.user.id
      })
      .select(`
        *,
        requester:profiles(full_name, department)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Vote for request
  async voteForRequest(requestId: string): Promise<boolean> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    // Check if already voted
    const { data: existing } = await supabase
      .from('request_votes')
      .select('id')
      .eq('request_id', requestId)
      .eq('user_id', user.data.user.id)
      .single()

    if (existing) {
      // Remove vote
      await supabase
        .from('request_votes')
        .delete()
        .eq('id', existing.id)

      // Decrement vote count
      await supabase.rpc('decrement_request_votes', { request_id: requestId })
      return false
    }
    // Add vote
    await supabase
      .from('request_votes')
      .insert({
        request_id: requestId,
        user_id: user.data.user.id
      })

    // Increment vote count
    await supabase.rpc('increment_request_votes', { request_id: requestId })
    return true
  }
}

// Profile Services
export const profileService = {
  // Get current user profile
  async getCurrentProfile(): Promise<Profile | null> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.data.user.id)
      .single()

    if (error) return null
    return data
  },

  // Update profile
  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.data.user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get profile by ID
  async getProfileById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }
}

// Real-time subscriptions helper
export const subscriptions = {
  // Subscribe to live stream viewer updates
  subscribeToStreamViewers(streamId: string, callback: (count: number) => void) {
    return supabase
      .channel(`stream_viewers:${streamId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stream_viewers',
          filter: `stream_id=eq.${streamId}`
        },
        async () => {
          const count = await liveStreamService.getViewerCount(streamId)
          callback(count)
        }
      )
      .subscribe()
  },

  // Subscribe to new podcasts
  subscribeToNewPodcasts(callback: (podcast: Podcast) => void) {
    return supabase
      .channel('new_podcasts')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'podcasts',
          filter: 'status=eq.approved'
        },
        (payload) => callback(payload.new as Podcast)
      )
      .subscribe()
  }
}
