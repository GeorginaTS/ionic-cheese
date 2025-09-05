# Cheesely Coding Conventions

## Project Structure
- `src/app/pages` → feature pages (e.g., `cheese-list`, `user-profile`)
- `src/app/components` → shared reusable components
- `src/app/services` → Angular services (data, auth, utilities)
- `src/app/models` → TypeScript interfaces and models
- `src/environments` → environment configurations

## Naming
- **Components**: `PascalCase` (e.g., `CheeseCardComponent`)
- **Services**: `PascalCase` with suffix `Service` (e.g., `AuthService`)
- **Selectors**: `kebab-case` (e.g., `app-cheese-card`)
- **Files**: `kebab-case` (e.g., `cheese-card.component.ts`)

## Angular Guidelines
- Use **standalone components** instead of NgModules.
- Use **Angular Router with lazy loading** for feature pages.
- Protect private routes with **AuthGuards**.
- Use **RxJS and Observables** for state and async data handling.
- Avoid direct DOM manipulation; rely on Angular templates and directives.

## UI & Styling
- Use **Ionic components** for UI structure and interactivity.
- Apply **Tailwind CSS** utility classes for styling and layout.
- Avoid custom SCSS unless Tailwind cannot cover the case.
- Keep UI components presentational; delegate logic to services.

## Firebase & Backend
- Use **AngularFire** for Firebase integration:
  - Authentication
  - Firestore
  - Storage
- Use **MongoDB + Mongoose** for backend entities:
  - Cheese
  - User
  - Board
  - Favorites
  - CommunityPost

## Capacitor
- Use Capacitor plugins for native features:
  - Camera
  - Geolocation
  - Filesystem
- Always handle permission requests gracefully.

## Testing
- TODO

---
