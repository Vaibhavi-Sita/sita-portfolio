import { Routes } from '@angular/router';
import { LayoutController } from './controllers';

export const routes: Routes = [
  // Admin routes - independent from public layout
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  // Public routes - with navbar and footer
  {
    path: '',
    component: LayoutController,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./controllers/home/home.controller').then((m) => m.HomeController),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
