import { Component} from '@angular/core';
import { PanelmenuBasicDemo } from "../menupanel/menupanel";
import { ToolbarBasicDemo } from '../toolbar/toolbar';
import { TableBasicDemo } from '../tabla/tabla';


@Component({
  selector: 'app-inicio',
  imports: [PanelmenuBasicDemo,ToolbarBasicDemo,TableBasicDemo],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
})
export class Inicio{
//sdsd
}
