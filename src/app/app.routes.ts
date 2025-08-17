import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'community',
    loadComponent: () => import('./pages/community/community.page').then( m => m.CommunityPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'my-cheeses',
    loadComponent: () => import('./pages/my-cheeses/my-cheeses.page').then( m => m.MyCheesesPage)
  },
  {
    path: 'cheese/add',
    loadComponent: () => import('./pages/my-cheeses/add-cheese/add-cheese.page').then( m => m.AddCheesePage)
  },
  {
    path: 'cheese/:id',
    loadComponent: () => import('./pages/my-cheeses/cheese-detail/cheese-detail.page').then( m => m.CheeseDetailPage)
  }
];
