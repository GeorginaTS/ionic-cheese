# Copilot Instructions for Caseus

This repository is **Caseus**, a community and cheese management app built with **Angular 20 + Ionic 8 + Tailwind + Capacitor + Firebase**.  
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

- Build UI with **Ionic components** (buttons, inputs, modals, etc.).
- Apply **Tailwind utility classes** for styling.
- Avoid inline styles and minimize custom SCSS.
- Organize:
  - Feature pages → `/src/app/pages`
  - Shared UI components → `/src/app/components`

---

## 🔒 Routing & Auth

- Use **Angular Router with lazy loading** for feature pages.
- Protect private routes with **AuthGuards**.
- Redirect unauthenticated users to the login page.
- Use AngularFire Auth for authentication (Google, Email/Password).

---

## ☁️ Firebase & Backend

- Use **AngularFire** for:
  - Authentication
  - Firestore
  - Storage
- Use **MongoDB with Mongoose** for backend entities (Cheese, User, Board, Favorites, CommunityPost).

---

## 📱 Capacitor

- Use **Capacitor plugins** for native features:
  - Camera
  - Geolocation
  - Filesystem
- Always check and request permissions properly.

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

- **Components**: `PascalCase` (e.g., `CheeseCardComponent`)
- **Services**: `PascalCaseService` (e.g., `AuthService`)
- **Selectors**: `kebab-case` (e.g., `app-cheese-card`)
- **Files**: `kebab-case` (e.g., `cheese-card.component.ts`)

---
