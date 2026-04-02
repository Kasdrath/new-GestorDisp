import { Component, OnInit } from '@angular/core';
import { ButtonModule, Button } from 'primeng/button';
import { Prueba } from "../prueba/prueba";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
@Component({
    template: `
        <div class="card">
            <p-toolbar>
                <ng-template #start>
                    <p-button icon="pi pi-plus" class="mr-2" text severity="secondary" />
                    <p-button icon="pi pi-print" class="mr-2" text severity="secondary" />
                    <p-button icon="pi pi-upload" text severity="secondary" />
                </ng-template>
                <ng-template #center>
                    <p-iconfield iconPosition="left">
                        <p-inputicon class="pi pi-search" />
                        <input type="text" pInputText placeholder="Search" />
                    </p-iconfield>
                </ng-template>
                <ng-template #end>
                    <p-splitbutton label="Save" [model]="items" />
                </ng-template>
            </p-toolbar>
        </div>
    `,
    selector:'app-toolbar-demo',
    standalone: true,
    imports: [ButtonModule, IconFieldModule, InputIconModule, SplitButtonModule, ToolbarModule, InputTextModule]
})
export class ToolbarBasicDemo implements OnInit {
    items: MenuItem[] | undefined;
    ngOnInit() {
        this.items = [
            {
                label: 'Update',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Delete',
                icon: 'pi pi-times'
            }
        ];
    }
}
@Component({
  selector: 'app-inicio',
  imports: [ButtonModule, ToolbarBasicDemo],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {}

