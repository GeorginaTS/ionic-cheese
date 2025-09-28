# 🧀 Ionic Cheese App

A hybrid application built with Ionic/Angular to manage, share and explore information about artisan cheeses. The app allows users to document their own cheeses, explore world cheeses and connect with the cheese-making community.

## 🚀 Demo

**Live Deployment:** [https://cheese-29925.web.app/](https://cheese-29925.web.app/)

## ✨ Features

### Core Features
- 📱 **Hybrid App**: Works on web, iOS and Android
- 🔐 **Authentication**: Google Auth & Email/Password with Firebase Auth
- 📸 **Photo Capture**: Document your cheeses with images using Capacitor Camera
- 🗺️ **World Map**: Interactive map with Leaflet to explore cheeses worldwide
- 📊 **Personal Management**: Complete cheese elaboration tracking and maturation

### Community Features (NEW! 🆕)
- 👥 **Community Feed**: Browse and discover cheeses shared by other users
- � **Cheese Details**: Comprehensive cheese information pages with Firebase Storage images
- 👤 **User Profiles**: Display user information with profile cards and displayname components
- 💬 **Social Interactions**: Like and share cheeses using native Capacitor Share
- 🔄 **Real-time Updates**: Live data synchronization with Firestore

### Technical Features
- 🎨 **Modern UI**: Global CSS classes system with Tailwind CSS integration
- 🏗️ **Standalone Components**: Angular 20 standalone architecture with modern @if/@for syntax
- 🔥 **Firebase Integration**: Complete Firebase ecosystem (Auth, Firestore, Storage)
- 📱 **Native Features**: Camera, sharing, and filesystem access via Capacitor
- 🎯 **Optimized Performance**: Minimal SCSS with utility-first CSS approach

## 🛠️ Tech Stack

- **Frontend**: Ionic 8 + Angular 20 (Standalone Components)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: Tailwind CSS + Global SCSS Classes
- **Build**: Vite
- **Deployment**: Firebase Hosting
- **Maps**: Leaflet with custom markers
- **Native Features**: Capacitor (Camera, Share, Filesystem)
- **State Management**: RxJS Observables
- **Authentication**: Firebase Auth (Google + Email/Password)

## 📁 Project Structure

```text
src/
├── app/
│   ├── components/          # Reusable components
│   │   ├── community/       # Community-specific components
│   │   │   └── community-cheese-card/
│   │   ├── user-profile-card/     # User profile components
│   │   ├── user-displayname/      # Compact user display
│   │   ├── cheese-card/
│   │   ├── cheese-detail/
│   │   ├── cheese-photo-capture/
│   │   └── my-cheeses/      # Personal cheese management
│   ├── pages/              # Main pages
│   │   ├── home/
│   │   ├── my-cheeses/
│   │   ├── community/       # Community features
│   │   │   └── community-cheese-detail/
│   │   ├── world-cheeses/
│   │   └── profile/
│   ├── services/           # Angular services
│   │   ├── cheese.service.ts
│   │   ├── user.service.ts  # Firebase user management
│   │   └── world-cheeses.service.ts
│   └── interfaces/         # TypeScript types
│       ├── cheese.ts
│       ├── user.ts
│       └── world-cheese.ts
├── assets/                 # Images and resources
├── environments/           # Environment configuration
└── global.scss            # Global styles and utility classes
```

## 🏛️ Architecture & Design Patterns

### Component Architecture
- **Standalone Components**: Modern Angular 20 architecture without NgModules
- **Control Flow Syntax**: Uses `@if`, `@for` instead of `*ngIf`, `*ngFor`
- **Reactive Programming**: RxJS Observables for data management
- **Firebase Integration**: Direct Firestore integration with converters

### Styling Strategy
- **Global Classes**: Centralized utility classes in `global.scss`
- **Tailwind Integration**: Utility-first CSS with custom Ionic component styles
- **CSS Variables**: Consistent theming with CSS custom properties
- **Responsive Design**: Mobile-first approach with flexible layouts

### Firebase Integration
- **Authentication**: Google OAuth & Email/Password authentication
- **Firestore**: Real-time document-based database with security rules
- **Storage**: Image upload and management with CDN delivery
- **Security**: Row-level security with user-based access control

### Key Components

#### Community Features
- `CommunityCheeseCardComponent`: Optimized card display with social actions
- `UserProfileCardComponent`: Complete user information display
- `UserDisplaynameComponent`: Lightweight user identification
- `CommunityCheeseDetailPage`: Full cheese information with Firebase images

#### Services
- `UserService`: Firebase-based user data management
- `CheeseService`: Complete cheese CRUD operations with image handling
- `WorldCheesesService`: Geographic cheese data management

## 🚀 Development

### Prerequisites

- Node.js 18+
- Ionic CLI (`npm install -g @ionic/cli`)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

```bash
# Clone the repository
git clone https://github.com/GeorginaTS/ionic-cheese.git
cd ionic-cheese

# Install dependencies
npm install

# Configure Firebase (create your own project)
# Update src/environments/environment.ts with your configuration
```

### Local Development

```bash
# Serve the app in development mode
ionic serve

# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

### For Mobile Devices

```bash
# Add platforms
ionic capacitor add ios
ionic capacitor add android

# Build and sync
ionic capacitor build
ionic capacitor sync

# Open in native IDEs
ionic capacitor open ios
ionic capacitor open android
```

## 🔧 Configuration

### Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore and Storage
3. Update `src/environments/environment.ts` with your configuration
4. Configure security rules for Firestore and Storage

### Environment Variables

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
  }
};
```

## 📝 Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Check code with ESLint
npm run e2e        # End-to-end tests
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 🆕 Recent Updates

### v2.0.0 - Community Features Release

#### New Features
- **Community Feed**: Browse public cheeses from other users
- **Social Interactions**: Like and share functionality with native integration
- **User Profiles**: Complete user management with Firebase integration
- **Enhanced Details**: Rich cheese detail pages with Firebase Storage images
- **Google Authentication**: Seamless login with Google accounts

#### Technical Improvements
- **Angular 20 Migration**: Modern standalone components architecture
- **Global CSS System**: Centralized styling with reusable utility classes
- **Firebase Optimization**: Direct Firestore integration with improved performance
- **Capacitor Integration**: Native sharing and camera functionality
- **Code Optimization**: Reduced bundle size with utility-first CSS approach

#### UI/UX Enhancements
- **Modern Control Flow**: Updated to `@if`/`@for` syntax
- **Responsive Design**: Improved mobile experience
- **Performance**: Optimized component rendering and data loading
- **Accessibility**: Enhanced component accessibility features

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

## 👨‍💻 Author

**Georgina TS** - [GitHub](https://github.com/GeorginaTS)

---

> Developed with ❤️ for the cheese-making community