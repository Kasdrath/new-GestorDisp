import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
    templateUrl: './menupanel.html',
    standalone: true,
    selector: 'app-panelmenu-demo',
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
                command: () => this.onDeviceSelect.emit("Devices"),
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
                    }
                ]
            },
            {
                label: 'Empleados',
                icon: 'pi pi-user',
                command: () => this.onDeviceSelect.emit("Empleados")
            },
        ];
    }
}
