import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':slug/open-house/:publicCode',
    loadComponent: () =>
      import('./landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
];
