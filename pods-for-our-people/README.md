# 🎙️ Pods for our People

**Your internal podcasting platform for communication, education, and engagement.**

![Platform Screenshot](https://same-2nr30oidwic-latest.netlify.app/og-image.png)

## 🌟 Live Demo

**🔗 Production Site**: [https://same-2nr30oidwic-latest.netlify.app](https://same-2nr30oidwic-latest.netlify.app)

## ✨ Features

- 🎙️ **Podcast Creation & Upload** - Easy audio/video podcast publishing
- 🔐 **User Authentication** - Secure sign up/sign in with profiles
- 📡 **Real-time Features** - Live notifications, streaming, and chat
- 🏢 **Department Organization** - Browse content by team/department
- 💬 **Community Engagement** - Comments, likes, discussions, and requests
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Live Streaming** - Real-time streaming with interactive chat
- 🔔 **Smart Notifications** - Real-time updates for new content and interactions
- 🔍 **Advanced Search** - Find content by title, host, department, or topic
- 👥 **User Profiles** - Personalized profiles with department and bio information

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Real-time + Storage)
- **Deployment**: Netlify (Dynamic deployment with auto-builds)
- **Version Control**: GitHub with automatic CI/CD
- **Package Manager**: Bun (faster than npm)

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Git

### 1. Clone & Install
```bash
git clone https://github.com/joehulsizer/pods-for-our-people.git
cd pods-for-our-people
bun install
```

### 2. Environment Setup
The `.env.local` file is already configured with Supabase credentials. For production, you may want to:
- Create your own Supabase project
- Update the environment variables
- Follow the database setup in `src/lib/database.sql`

### 3. Run Development Server
```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the platform!

## 🗄️ Database Schema

The platform includes a comprehensive database schema with:
- **15 tables** for users, podcasts, interactions, live streams, discussions
- **Real-time subscriptions** for live features
- **Row Level Security (RLS)** for data protection
- **Custom functions** for business logic
- **Triggers** for automated operations

See `src/lib/database.sql` for the complete schema.

## 📋 Production Setup

For a complete production deployment, follow our detailed guide:

**📖 [PRODUCTION_SETUP_GUIDE.md](./PRODUCTION_SETUP_GUIDE.md)**

This guide covers:
1. Setting up custom domain in Netlify
2. Creating admin user accounts
3. Testing the podcast workflow
4. Customizing email templates
5. Setting up admin roles and permissions

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── auth/           # Authentication pages
│   ├── podcasts/       # Podcast browsing
│   ├── upload/         # Podcast creation
│   └── ...             # Other pages
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── Navigation.tsx  # Main navigation
│   ├── PodcastPlayer.tsx # Audio/video player
│   └── ...            # Other components
├── contexts/          # React contexts
├── lib/               # Utilities and services
│   ├── database.sql   # Complete database schema
│   ├── database-service.ts # Database operations
│   └── supabase.ts    # Supabase client
└── hooks/             # Custom React hooks
```

### Key Commands
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run linting and type checking
```

## 🌐 Deployment

### Automatic Deployment
- **GitHub**: Push to main branch
- **Netlify**: Automatically builds and deploys
- **Live URL**: https://same-2nr30oidwic-latest.netlify.app

### Manual Deployment
1. Build the project: `bun run build`
2. Deploy the `.next` folder to your hosting provider
3. Ensure environment variables are configured

## 🔒 Security

- **Row Level Security** enabled on all database tables
- **Authentication** required for all user actions
- **Input validation** on all forms and API calls
- **HTTPS** enforced in production
- **Environment variables** secured and not committed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## 📧 Support

For questions or issues:
- Check the [Production Setup Guide](./PRODUCTION_SETUP_GUIDE.md)
- Review the [Supabase Setup Guide](./SUPABASE_SETUP.md)
- Open an issue on GitHub

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🎉 Ready to transform your organization's internal communication through podcasting!**
