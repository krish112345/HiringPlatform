# Veridia Hire (Veridia.io)

host link:https://hiring-platform-hazel.vercel.app

A modern, AI-powered hiring platform that streamlines the recruitment process for both candidates and HR teams. Built with Next.js 15, Firebase, and Google Genkit for an intelligent and efficient hiring experience.

## 🚀 Features

### For Candidates
- **Easy Registration & Login**: Secure authentication system
- **Dynamic Application Forms**: Customizable forms similar to Google Forms
- **Personal Dashboard**: Track application status and manage profile
- **One-Click Applications**: Quick application process with saved profile data

### For HR Teams & Admins
- **Admin Dashboard**: Comprehensive management interface
- **Advanced Candidate Search**: Powerful filtering and search capabilities
- **Application Management**: Full lifecycle management from submission to offer
- **Real-time Analytics**: Track recruitment metrics and insights

### Technical Features
- **AI-Powered**: Google Genkit integration for intelligent candidate matching
- **Real-time Updates**: Firebase real-time database for instant updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI Components**: Built with Radix UI and shadcn/ui
- **Type Safety**: Full TypeScript implementation

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, shadcn/ui components
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **AI**: Google Genkit for intelligent features
- **Deployment**: Firebase App Hosting
- **Development**: Turbopack for fast development

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account and project
- Google Cloud project (for Genkit AI features)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd hiring-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Genkit AI (Optional)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key
```

### 4. Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage
3. Update your Firebase security rules (see `firestore.rules`)
4. Copy your Firebase config to `.env.local`

### 5. Run Development Server

```bash
# Start the development server
npm run dev

# Start with AI features (requires Google Genkit setup)
npm run genkit:dev
```

The application will be available at `https://hiring-platform-hazel.vercel.app/`

## 🏗 Project Structure

```
src/
├── ai/                 # AI and Genkit related code
├── app/                # Next.js app router pages
│   ├── admin/         # Admin dashboard pages
│   ├── dashboard/     # Candidate dashboard pages
│   ├── login/         # Authentication pages
│   ├── register/      # Registration pages
│   └── page.tsx       # Landing page
├── components/         # Reusable UI components
│   └── ui/           # shadcn/ui components
├── firebase/          # Firebase configuration and utilities
├── hooks/             # Custom React hooks
└── lib/               # Utility functions and configurations
```

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run genkit:dev       # Start with AI development features
npm run genkit:watch     # Watch mode for AI development

# Building & Production
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint           # Run ESLint
npm run typecheck      # TypeScript type checking
```

## 🎨 Styling Guidelines

- **Primary Color**: Light blue (#A7D1AB) - professional and trustworthy
- **Background**: Very light blue (#F0F8FF)
- **Accent Color**: Darker blue (#558B2F) for CTAs
- **Typography**: 'Playfair' for headlines, 'PT Sans' for body text
- **Icons**: Lucide React icons throughout the application

## 🔐 Authentication

The platform uses Firebase Authentication with:
- Email/Password authentication
- Protected routes for dashboard and admin areas
- Role-based access control (candidate vs admin)

### Admin Access
- **Admin Email**: hrverdia@gmail.com
- **Admin password**: 1234567890

- Admin users have access to the full management dashboard and can view all applications
- Contact the development team to request admin privileges

## 🤖 AI Features

Powered by Google Genkit:
- Intelligent candidate-job matching
- Automated application screening
- Smart resume parsing and analysis
- AI-powered interview question generation

## 📊 Database Structure

### Firestore Collections
- `users` - User profiles and authentication data
- `applications` - Job applications and status tracking
- `jobs` - Job postings and requirements
- `companies` - Company information and settings

## 🚀 Deployment

### Firebase Hosting (Current Setup)

1. Build the application:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

### Alternative Deployment Options

The project includes `apphosting.yaml` for Firebase App Hosting. For other platforms:

**Vercel**:
```bash
npm i -g vercel
vercel --prod
```

**Netlify**:
```bash
npm run build
npm run export  # if using static export
```

## 🔄 CI/CD

Set up automated deployments with GitHub Actions or your preferred CI/CD platform. The project includes configuration for Firebase App Hosting.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and not licensed for public use.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Updates

- **Version**: 0.1.0
- **Last Updated**: October 2025
- **Next.js**: 15.3.3
- **React**: 18.3.1

--

**Veridia.io** - Transforming recruitment through technology and AI.
