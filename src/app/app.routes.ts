import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./open-house-domain-root/open-house-domain-root.component').then(
        (m) => m.OpenHouseDomainRootComponent,
      ),
  },
  {
    path: ':slug/open-house/:publicCode/thank-you',
    loadComponent: () =>
      import('./thank-you-page/thank-you-page.component').then(
        (m) => m.ThankYouPageComponent,
      ),
  },
  {
    path: ':slug/open-house/:publicCode',
    loadComponent: () =>
      import('./landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
  { path: '**', redirectTo: '/home' },
];
