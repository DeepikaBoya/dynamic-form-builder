import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'forms',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'forms',
    canActivate: [authGuard],
    loadComponent: () => import('./components/form-list/form-list.component').then(m => m.FormListComponent)
  },
  {
    path: 'forms/create',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () => import('./components/form-builder/form-builder.component').then(m => m.FormBuilderComponent)
  },
  {
    path: 'forms/:id/edit',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () => import('./components/form-builder/form-builder.component').then(m => m.FormBuilderComponent)
  },
  {
    path: 'forms/:id/preview',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () => import('./components/form-submission/form-submission.component').then(m => m.FormSubmissionComponent)
  },
  {
    path: 'forms/:id/fill',
    canActivate: [authGuard],
    loadComponent: () => import('./components/form-submission/form-submission.component').then(m => m.FormSubmissionComponent)
  },
  {
    path: 'forms/:id/submissions',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () => import('./components/form-preview/form-preview.component').then(m => m.FormPreviewComponent)
  },
  {
    path: '**',
    redirectTo: 'forms'
  }
];
