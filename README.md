# 🧀 Ionic Cheese App

A hybrid application built with Ionic/Angular to manage, share and explore information about artisan cheeses. The app allows users to document their own cheeses, explore world cheeses and connect with the cheese-making community.

## 🚀 Demo

**Live Deployment:** [https://cheese-29925.web.app/](https://cheese-29925.web.app/)

## ✨ Features

- 📱 **Hybrid App**: Works on web, iOS and Android
- 🔐 **Authentication**: User registration and login with Firebase Auth
- 📸 **Photo Capture**: Document your cheeses with images
- 🗺️ **World Map**: Explore cheeses from different countries
- 👥 **Community**: Share and discover cheeses from other users
- 📊 **Personal Management**: Track the elaboration and maturation of your cheeses
- 🎨 **Modern UI**: Responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Ionic 8 + Angular 18
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Deployment**: Firebase Hosting
- **Maps**: Leaflet
- **Camera**: Capacitor Camera

## 📁 Project Structure

```text
src/
├── app/
│   ├── components/          # Reusable components
│   │   ├── cheese-card/
│   │   ├── cheese-detail/
│   │   ├── cheese-photo-capture/
│   │   └── ...
│   ├── pages/              # Main pages
│   │   ├── home/
│   │   ├── my-cheeses/
│   │   ├── community/
│   │   └── world-cheeses/
│   ├── services/           # Angular services
│   └── interfaces/         # TypeScript types
├── assets/                 # Images and resources
└── environments/           # Environment configuration
```

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

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

## 👨‍💻 Author

**Georgina TS** - [GitHub](https://github.com/GeorginaTS)

---

> Developed with ❤️ for the cheese-making community