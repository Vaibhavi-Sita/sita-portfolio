import { Routes } from '@angular/router';
import { LayoutController } from './controllers';

export const routes: Routes = [
  {
    path: '',
    component: LayoutController,
    children: [
      {
        path: '',
        loadComponent: () => import('./controllers/home/home.controller')
          .then(m => m.HomeController)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes')
          .then(m => m.ADMIN_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
