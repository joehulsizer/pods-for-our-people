# 🚀 Production Setup Guide - Pods for our People

This guide will walk you through the final steps to make your internal podcasting platform fully production-ready for your organization.

## 📋 Quick Checklist

- [ ] 1. Claim Netlify deployment and set up custom domain
- [ ] 2. Create your first admin user account
- [ ] 3. Test the complete podcast workflow
- [ ] 4. Customize Supabase email templates
- [ ] 5. Set up admin roles and permissions

---

## 🌐 Step 1: Set Up Custom Domain in Netlify

### A. Claim Your Deployment
1. **Visit your live site**: https://same-2nr30oidwic-latest.netlify.app
2. **Look for the banner** at the top that says "Claim this deployment"
3. **Click "Claim Deployment"** to connect it to your Netlify account
4. **Sign up/Sign in** to Netlify with your email

### B. Configure Custom Domain
1. **In Netlify Dashboard**:
   - Go to your site's dashboard
   - Click **"Domain settings"** or **"Set up a custom domain"**

2. **Add Your Domain**:
   ```
   Example: podcasts.yourcompany.com
   Or: internal-podcasts.yourcompany.com
   ```

3. **DNS Configuration**:
   - **If using a subdomain**: Add a CNAME record pointing to your Netlify URL
   - **If using root domain**: Add A records pointing to Netlify's IPs

4. **Enable HTTPS**:
   - Netlify will automatically provision SSL certificates
   - Wait 24-48 hours for DNS propagation

### C. Update Environment Variables (Optional)
If you want to restrict auth redirects to your custom domain:
1. In your Supabase dashboard → Authentication → URL Configuration
2. Update **Site URL** to your custom domain
3. Update **Redirect URLs** to include your custom domain

---

## 👤 Step 2: Create Your First Admin User Account

### A. Sign Up as Admin
1. **Visit your live site**: https://same-2nr30oidwic-latest.netlify.app
2. **Click "Sign up"** in the top navigation
3. **Fill out the form**:
   ```
   Email: admin@yourcompany.com
   Password: [Strong password]
   Full Name: [Your name]
   Department: Leadership
   ```
4. **Check your email** for verification link
5. **Verify your account** and sign in

### B. Test Authentication Flow
1. **Sign out** and **sign back in**
2. **Check your profile** appears in navigation
3. **Test the notification bell** (should be empty initially)
4. **Verify you can access all pages**: Upload, Request, Resources, Community

---

## 🎙️ Step 3: Upload Your First Podcast

### A. Create Test Podcast
1. **Click "Upload Your Podcast"** or the prominent "Start Your Podcast Journey Today!" button
2. **Fill out the form**:
   ```
   Title: "Welcome to Pods for our People"
   Description: "An introduction to our new internal podcasting platform"
   Department: Leadership
   Duration: "5 min"
   Category: Welcome
   Tags: welcome, introduction, platform
   ```
3. **Upload audio file** (or use placeholder for testing)
4. **Submit for approval**

### B. Test Approval Workflow
Since you're the first user, you can approve your own content:

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Navigate to**: Table Editor → podcasts
3. **Find your podcast** and change status from 'pending' to 'approved'
4. **Refresh your site** - the podcast should now appear!

### C. Test Podcast Features
1. **Browse podcasts** page - your podcast should be visible
2. **Click "Listen Now"** to test the podcast player
3. **Try liking** and **commenting** on your podcast
4. **Test search** and **department filtering**

---

## 📧 Step 4: Customize Email Templates

### A. Access Supabase Auth Settings
1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**: gzbpfyhalufspemampho
3. **Navigate to**: Authentication → Email Templates

### B. Customize Templates
Update these templates with your organization's branding:

#### **Confirm Signup Template**:
```html
<h2>Welcome to Pods for our People!</h2>
<p>Hi {{ .Email }},</p>
<p>Welcome to [Your Company]'s internal podcasting platform! Click the link below to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your account</a></p>
<p>Start sharing your voice and connecting with colleagues through the power of podcasting.</p>
<p>Best regards,<br>[Your Company] Team</p>
```

#### **Reset Password Template**:
```html
<h2>Reset Your Password</h2>
<p>Hi {{ .Email }},</p>
<p>Someone requested a password reset for your Pods for our People account.</p>
<p><a href="{{ .ConfirmationURL }}">Reset your password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>Best regards,<br>[Your Company] Team</p>
```

#### **Magic Link Template**:
```html
<h2>Sign in to Pods for our People</h2>
<p>Hi {{ .Email }},</p>
<p>Click the link below to sign in to your account:</p>
<p><a href="{{ .ConfirmationURL }}">Sign in to your account</a></p>
<p>Best regards,<br>[Your Company] Team</p>
```

### C. Configure Email Settings
1. **SMTP Settings** (optional): Configure custom SMTP for branded emails
2. **Rate Limiting**: Adjust email rate limits for your organization size
3. **Test the emails**: Send test emails to verify they work

---

## 👥 Step 5: Set Up Admin Roles and Permissions

### A. Create Admin Role System
Add this SQL to create an admin role system:

1. **Go to Supabase Dashboard** → SQL Editor
2. **Run this SQL**:

```sql
-- Add admin role to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create admin role type
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
ALTER TABLE public.profiles ALTER COLUMN role TYPE user_role USING role::user_role;

-- Make your account an admin (replace with your email)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@yourcompany.com';

-- Create admin policies
CREATE POLICY "Admins can approve podcasts" ON public.podcasts
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'moderator')
  )
);

-- Create moderator functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_moderator_or_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### B. Create Additional Admin Users
1. **Invite team members** to sign up normally
2. **In Supabase** → Table Editor → profiles
3. **Update their role** to 'admin' or 'moderator' as needed

### C. Admin Dashboard Features
Admins can now:
- **Approve/reject podcasts** directly in the database
- **Moderate comments** and discussions
- **Manage user accounts** and roles
- **Access analytics** and engagement data

---

## 🔧 Step 6: Additional Production Configurations

### A. Content Moderation Setup
1. **Review Guidelines**: Update the "Educational Resources" page with your content guidelines
2. **Approval Process**: Train moderators on the approval workflow
3. **Reporting System**: Users can report inappropriate content via comments

### B. Analytics and Monitoring
1. **Supabase Dashboard**: Monitor database usage and performance
2. **Netlify Analytics**: Track website traffic and performance
3. **User Engagement**: Monitor podcast views, likes, and comments

### C. Backup and Security
1. **Database Backups**: Supabase automatically backs up your data
2. **Security Policies**: All RLS policies are already configured
3. **Environment Variables**: Keep your .env.local secure and never commit it

---

## ✅ Production Checklist

After completing all steps, verify:

- [ ] Custom domain is working and HTTPS is enabled
- [ ] Admin user can sign in and access all features
- [ ] Podcast upload → approval → publish workflow works
- [ ] Email notifications are being sent with your branding
- [ ] Admin roles are working for content moderation
- [ ] All real-time features work (notifications, chat)
- [ ] Mobile responsiveness is working on phones/tablets
- [ ] Search and filtering work correctly
- [ ] User profiles and departments are configured

---

## 🎉 You're Ready to Launch!

Your **Pods for our People** platform is now fully configured and ready for your organization to start using immediately!

### 📢 **Announce to Your Team:**
"We're excited to launch our new internal podcasting platform! Sign up at [your-domain] to start sharing knowledge, building community, and connecting with colleagues through podcasting."

### 🚀 **Next Steps:**
1. **Train content moderators** on the approval process
2. **Create initial content** to seed the platform
3. **Encourage department leads** to create welcome podcasts
4. **Share the platform** in team meetings and internal communications
5. **Gather feedback** and iterate on features

**Happy podcasting! 🎙️✨**
