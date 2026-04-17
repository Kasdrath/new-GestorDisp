import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-panelmenu [model]="items" class="w-full md:w-80" />
        </div>
    `,
    standalone: true,
    selector:'app-panelmenu-demo',
    imports: [PanelMenuModule]
})
export class PanelmenuBasicDemo implements OnInit {
    @Output() onDeviceSelect = new EventEmitter<string>();

    items: MenuItem[] = [];
    ngOnInit() {
        this.items = [
            {
                label: 'Devices',
                icon: 'pi pi-desktop',
                
                items: [
                    {
                        label: 'Phone',
                        icon: 'pi pi-mobile',
                        command: () => this.onDeviceSelect.emit("Phone"),
                    },
                    {
                        label: 'Desktop',
                        icon: 'pi pi-desktop',
                        command: () => this.onDeviceSelect.emit("Desktop"),
                    },
                    {
                        label: 'Tablet',
                        icon: 'pi pi-tablet',
                        command: () => this.onDeviceSelect.emit("Tablet")
                    }
                ]
            },
            {
                label: 'Empleados',
                icon: 'pi pi-user',
            },    
        ];
    }
}
