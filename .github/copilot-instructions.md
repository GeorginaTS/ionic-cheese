# Copil## 🔘 General Guidelines

- Always use **TypeScript** with **strict mode** enabled.
- Follow **Angular standalone components** architecture (no NgModules).
- Angular version: **20.x**
- Ionic version: **8.x**
- Tailwind CSS version: **3.x**
- Firebase version: **9.x** (modular SDK)
- Use **strict typing** and avoid `any`. Use proper interfaces from `/src/app/interfaces/`.
- Use **modern control flow** syntax: `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`, `*ngSwitchCase`.
- Use **dependency injection** with `inject()` function pattern, not constructor injection.
- Use **services** (`PascalCaseService`) for data fetching, business logic, and Firebase interaction.
- Use **RxJS Observables** instead of Promises when possible.
- Do **not** use jQuery or direct DOM manipulation.
- Follow **reactive programming** patterns with proper error handling using `catchError` operator.ns for Caseus

This repository is **Caseus**, a community and cheese management app## 🧪 Testing

- Use **Jasmine + Karma** for Angular tests.
- Write unit tests for:
  - **Components**: Test user interactions and data binding
  - **Services**: Test business logic and API calls with mocked dependencies
  - **Guards**: Test route protection logic
- **Testing patterns**:
  - Use `TestBed.configureTestingModule()` with standalone components
  - Mock services with `jasmine.createSpyObj()`
  - Use `of()` and `throwError()` for Observable testing
  - Test async operations with `fakeAsync()` and `tick()`

---

## 🛠️ Development Best Practices

- **Error Handling**: Always implement proper error handling with user feedback
- **Loading States**: Show loading indicators for async operations
- **Form Validation**: Use reactive forms with proper validation and error messages
- **Memory Management**: Unsubscribe from Observables using `takeUntilDestroyed()`
- **Performance**: Use `OnPush` change detection strategy where appropriate
- **Accessibility**: Include proper ARIA labels and semantic HTML
- **Code Organization**: Keep components focused and use composition over inheritanceith **Angular 20 + Ionic 8 + Tailwind + Capacitor + Firebase**.  
  Copilot should follow these rules and preferences when suggesting code:

---

## 🟢 General Guidelines

- Always use **TypeScript**.
- Follow **Angular standalone components** architecture (no NgModules).
- Angular version: **20.x**
- Ionic version: **8.x**
- Tailwind CSS version: **3.x**
- Firebase version: **9.x** (modular SDK)
- Use **strict typing** and avoid `any`.
- use @if and @for, instead of *ngIf and *ngFor, in templates.
- Use **services** (`PascalCaseService`) for data fetching, business logic, and Firebase interaction.
- Use **RxJS Observables** instead of Promises when possible.
- Do **not** use jQuery or direct DOM manipulation.

---

## 🎨 UI & Styling

- Build UI with **Ionic components** (IonButton, IonInput, IonModal, etc.) using standalone imports.
- Apply **Tailwind utility classes** for styling, following the existing pattern in `src/global.scss`.
- Use **global CSS classes** defined in `global.scss` for consistent spacing and layouts:
  - `.page-container`, `.card-container`, `.form-container`
  - `.text-primary`, `.text-secondary`, `.text-accent`
  - `.button-primary`, `.button-secondary`
- **Avoid inline styles** and minimize custom SCSS files.
- **Component organization**:
  - Feature pages → `/src/app/pages/[feature]/`
  - Shared UI components → `/src/app/components/[category]/`
  - Page-specific components → `/src/app/pages/[feature]/components/`

---

## 🔒 Routing & Auth

- Use **Angular Router with lazy loading** for all feature pages.
- Implement route protection using **functional guards** (not class-based guards).
- Use `AuthService.currentUser` to check authentication state.
- **Authentication flow**:
  - Redirect unauthenticated users to `/home` (login/register)
  - After login, redirect to `/my-cheeses` or intended route
  - Use Firebase Auth with Google OAuth and Email/Password
- **Route structure**:
  ```typescript
  {
    path: 'feature',
    loadComponent: () => import('./pages/feature/feature.page').then(m => m.FeaturePage),
    canActivate: [authGuard]
  }
  ```

---

## ☁️ Firebase & Backend

- Use **AngularFire v17+** with modular SDK for:
  - **Authentication**: `Auth`, `user`, `signInWithGoogle`, `signOut`
  - **Firestore**: Use `FirestoreService` for generic operations
  - **Storage**: Use `FirebaseStorageService` for image uploads
  - **Cloud Messaging**: Use `PushService` for notifications
- **Backend Architecture**:
  - **MongoDB with Express.js** for REST API (`environment.apiUrl`)
  - **Firebase** for authentication and real-time features
  - **Firestore** for user profiles and app metadata
  - **Firebase Storage** for cheese images
- **Service patterns**:
  - Use `AuthService.getIdToken$()` for API authentication
  - Implement proper error handling with `catchError` and user feedback
  - Use TypeScript interfaces for all data models

---

## 🔍 SEO & Performance

- Use **SeoService** for all SEO-related functionality:
  - Dynamic meta tags (title, description, keywords)
  - Open Graph tags for social media sharing
  - Twitter Cards for Twitter sharing
  - JSON-LD structured data for rich snippets
  - Canonical URLs to avoid duplicate content
- **Always call SEO updates** when loading dynamic content (cheese details, user profiles)
- Use **Angular Meta and Title services** through SeoService
- Implement **structured data** for better search engine visibility
- **SEO Integration Pattern**:

  ```typescript
  // In page components, inject SeoService
  private seoService = inject(SeoService);

  // Update SEO when data loads
  loadContent() {
    this.dataService.getData().subscribe(data => {
      this.updateSEO(data);
    });
  }

  private updateSEO(data: any): void {
    this.seoService.updatePageMeta({
      title: data.name,
      description: data.description,
      // ... other meta data
    });
  }
  ```

---

## 📱 Capacitor

- Use **Capacitor plugins** for native features:
  - Camera
  - Geolocation
  - Filesystem
  - Push Notifications
- Always check and request permissions properly.
- Use **PushService** for Firebase Cloud Messaging:
  - Handle push notification registration with proper permissions
  - Save FCM tokens securely to user profiles via AuthService
  - Implement comprehensive error handling:
    - `TOO_MANY_REGISTRATIONS`: Clear tokens and re-register
    - `AUTHENTICATION_FAILED`: Re-authenticate user
    - `INVALID_SENDER`: Check Firebase configuration
  - Integrate with Firebase Auth for secure token management
  - Reset tokens on logout to prevent stale notifications

---

## 🧪 Testing

- Use **Jasmine + Karma** for Angular tests.
- Write unit tests for:
  - Components
  - Services
  - Guards
- Use Angular’s `TestBed` to mock dependencies.

---

## 📂 Naming Conventions

- **Components**: `PascalCase` with descriptive suffixes
  - Pages: `CheeseDetailPage`, `CommunityPage`
  - Components: `CheeseCardComponent`, `UserDisplaynameComponent`
- **Services**: `PascalCaseService` (e.g., `AuthService`, `CheeseService`, `SeoService`)
- **Interfaces**: `PascalCase` without suffixes (e.g., `Cheese`, `AppUser`, `WorldCheese`)
- **Selectors**: `app-kebab-case` (e.g., `app-cheese-card`, `app-community-cheese-detail`)
- **Files**: `kebab-case` with appropriate suffixes:
  - Components: `cheese-card.component.ts`
  - Services: `cheese.service.ts`
  - Pages: `community.page.ts`
  - Interfaces: `cheese.ts`
- **Variables & Methods**: `camelCase` with descriptive names
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `DEFAULT_CHEESE_IMAGE`)

---
