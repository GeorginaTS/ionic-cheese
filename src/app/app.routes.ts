import { Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'community',
    loadComponent: () =>
      import('./pages/community/community.page').then((m) => m.CommunityPage),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-cheeses',
    loadComponent: () =>
      import('./pages/my-cheeses/my-cheeses.page').then((m) => m.MyCheesesPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'cheese/add',
    loadComponent: () =>
      import('./pages/my-cheeses/add-cheese/add-cheese.page').then(
        (m) => m.AddCheesePage
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'cheese/:id',
    loadComponent: () =>
      import('./pages/my-cheeses/cheese-detail/cheese-detail.page').then(
        (m) => m.CheeseDetailPage
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'world-cheeses',
    loadComponent: () =>
      import('./pages/world-cheeses/world-cheeses.page').then(
        (m) => m.WorldCheesesPage
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
