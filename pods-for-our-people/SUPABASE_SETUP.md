# Supabase Setup Guide for Pods for our People

This guide will help you set up Supabase to enable full functionality of the internal podcasting platform.

## Quick Setup Steps

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization and enter project details:
   - **Name**: `pods-for-our-people` (or your preferred name)
   - **Database Password**: Generate a secure password
   - **Region**: Choose the closest to your users
4. Click "Create new project"
5. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string starting with `eyJ`)

### 3. Update Environment Variables

1. Open `pods-for-our-people/.env.local`
2. Replace the placeholder values with your actual Supabase credentials:

```env
# Replace these with your actual Supabase project credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `src/lib/database.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create all necessary tables, views, functions, and security policies.

### 5. Configure Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Under **Site URL**, add your domain (for local development: `http://localhost:3000`)
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`
4. Save the settings

### 6. Test the Setup

1. Restart your development server: `bun run dev`
2. Visit `http://localhost:3000`
3. You should now see the homepage without the "Unable to load" message
4. Try signing up for an account
5. Create your first podcast!

## Database Schema Overview

The setup includes these main tables:

- **profiles** - User profiles extending Supabase auth
- **podcasts** - Podcast episodes with metadata
- **podcast_interactions** - Likes, views, downloads
- **comments** - Podcast comments and replies
- **live_streams** - Live streaming sessions
- **chat_messages** - Live chat for streams
- **discussions** - Community discussions
- **notifications** - Real-time notifications
- **events** - Q&A sessions and meetups
- **podcast_requests** - User-requested content

## Real-time Features

Once configured, you'll have access to:

- 🔴 **Live Streaming** with real-time chat
- 🔔 **Real-time Notifications** for new content
- 💬 **Live Comments** on podcasts
- 👥 **Live Viewer Counts** for streams
- ⚡ **Instant Updates** across all users

## Row Level Security (RLS)

The database comes with comprehensive security policies:

- Users can only edit their own content
- Public content is viewable by all authenticated users
- Private data is protected by user-specific policies
- Admin functions require proper authorization

## Troubleshooting

### Environment Variables Not Working
- Ensure the `.env.local` file is in the project root
- Restart the development server after changes
- Check that variable names match exactly (including `NEXT_PUBLIC_`)

### Database Connection Issues
- Verify your Project URL and API key are correct
- Ensure your Supabase project is active (not paused)
- Check the browser console for specific error messages

### Authentication Issues
- Confirm Site URL and Redirect URLs are configured
- For production, update these URLs to your live domain
- Check that email confirmation is enabled if needed

### Schema Errors
- Run the SQL in smaller chunks if there are errors
- Ensure you have proper permissions on your Supabase project
- Check the SQL logs in Supabase for specific error details

## Production Deployment

For production deployment:

1. Update environment variables with production Supabase credentials
2. Configure authentication URLs for your live domain
3. Set up proper DNS and SSL certificates
4. Configure email templates in Supabase Auth settings
5. Set up monitoring and backup strategies

## Support

If you need help:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the code comments in `src/lib/database-service.ts`
3. Check the browser console and network tab for errors
4. Verify your database schema matches the expected structure

---

🎉 **Once setup is complete, you'll have a fully functional internal podcasting platform with real-time features, user authentication, and comprehensive content management!**
