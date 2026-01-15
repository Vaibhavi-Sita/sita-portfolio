import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '../guards';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('./layout/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'profile' },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile-admin.component').then((m) => m.ProfileAdminComponent),
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./experience/experience-admin.component').then((m) => m.ExperienceAdminComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./projects/projects-admin.component').then((m) => m.ProjectsAdminComponent),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./skills/skills-admin.component').then((m) => m.SkillsAdminComponent),
      },
      {
        path: 'education',
        loadComponent: () =>
          import('./education/education-admin.component').then((m) => m.EducationAdminComponent),
      },
      {
        path: 'certifications',
        loadComponent: () =>
          import('./certifications/certifications-admin.component').then(
            (m) => m.CertificationsAdminComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./contact/contact-admin.component').then((m) => m.ContactAdminComponent),
      },
      {
        path: 'import',
        loadComponent: () =>
          import('./import/import-admin.component').then((m) => m.ImportAdminComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
    ],
  },
];
