import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';
import { Prueba } from './components/prueba/prueba';




export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'prueba', component: Prueba }

];
