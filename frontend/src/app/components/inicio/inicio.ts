import { Component } from '@angular/core';
import { ButtonModule, Button } from 'primeng/button';
import { Prueba } from "../prueba/prueba";
@Component({
  selector: 'app-inicio',
  imports: [ButtonModule, Prueba],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {}
