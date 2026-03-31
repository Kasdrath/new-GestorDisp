import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prueba',
  imports: [],
  templateUrl: './prueba.html',
  styleUrl: './prueba.css',
})
export class Prueba {
  @Input() numero = 0;
}

