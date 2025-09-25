import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'project/:id',
    loadComponent: () => import('./pages/project/project.component').then(m => m.ProjectComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];