import { Routes } from '@angular/router';

export const routes: Routes = [
  {
  path: '',
  redirectTo: 'home',
  pathMatch: 'full',
},
  {
    path: 'home',
    loadComponent: () =>
      import(
        './pages-alternatives/home-alternative/home-alternative.component'
      ).then((m) => m.HomeAlternativeComponent),
  },
  {
    path: 'register-alternative',
    loadComponent: () =>
      import(
        './pages-alternatives/register-alternative/register-alternative.component'
      ).then((m) => m.RegisterAlternativeComponent),
  },
];
