import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/inicio/inicio').then(m => m.Inicio),
  },
  {
    path: 'prueba',
    loadComponent: () => import('./components/prueba/prueba').then(m => m.Prueba),
  }
];
