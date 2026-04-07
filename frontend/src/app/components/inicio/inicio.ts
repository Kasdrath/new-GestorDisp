import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule, Button } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { FilterService } from '../../services/filter-service';
import { EmpleadoService, Device } from '../../services/empleado-service';
import { Table } from 'primeng/table';

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
                        <input type="text" pInputText placeholder="Search" (input)="onSearch($event)" />
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

    constructor(private filterService: FilterService) {}

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

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.filterService.setFilter(target.value);
    }
}
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
    items: MenuItem[] = [];
    ngOnInit() {
        this.items = [
            {
                label: 'Dispositivos',
                icon: 'pi pi-file',
                items: [
                    {
                        label: 'Documents',
                        icon: 'pi pi-file',
                        items: [
                            {
                                label: 'Invoices',
                                icon: 'pi pi-file-pdf',
                                items: [
                                    {
                                        label: 'Pending',
                                        icon: 'pi pi-stop'
                                    },
                                    {
                                        label: 'Paid',
                                        icon: 'pi pi-check-circle'
                                    }
                                ]
                            },
                            {
                                label: 'Clients',
                                icon: 'pi pi-users'
                            }
                        ]
                    },
                    {
                        label: 'Images',
                        icon: 'pi pi-image',
                        items: [
                            {
                                label: 'Logos',
                                icon: 'pi pi-image'
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Cloud',
                icon: 'pi pi-cloud',
                items: [
                    {
                        label: 'Upload',
                        icon: 'pi pi-cloud-upload'
                    },
                    {
                        label: 'Download',
                        icon: 'pi pi-cloud-download'
                    },
                    {
                        label: 'Sync',
                        icon: 'pi pi-refresh'
                    }
                ]
            },
            {
                label: 'Devices',
                icon: 'pi pi-desktop',
                items: [
                    {
                        label: 'Phone',
                        icon: 'pi pi-mobile'
                    },
                    {
                        label: 'Desktop',
                        icon: 'pi pi-desktop'
                    },
                    {
                        label: 'Tablet',
                        icon: 'pi pi-tablet'
                    }
                ]
            }
        ];
    }
}
@Component({
  selector: 'app-inicio',
  imports: [ToolbarBasicDemo, PanelmenuBasicDemo, TableModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
})
export class Inicio implements OnInit {
  devices: Device[] = [];

  @ViewChild('dt') dt: Table | undefined;

  constructor(private filterService: FilterService, private empleadoService: EmpleadoService) {}

  ngOnInit() {
    this.loadDevices();
    this.filterService.filter$.subscribe(filter => {
      if (this.dt) {
        this.dt.filterGlobal(filter, 'contains');
      }
    });
  }

  loadDevices() {
    this.empleadoService.getDevices().subscribe({
      next: (data) => {
        this.devices = data;
      },
      error: (err) => {
        console.error('Error loading devices:', err);
        // Fallback to sample data if backend is not available
        this.devices = [
          { idDisp: 1, numeroSerie: 'SN123456', marcaDisp: 'Samsung', modeloDIsp: 'Galaxy S21', fechaCompra: '2026-04-06', estadoDisp: 'Activo' },
          { idDisp: 2, numeroSerie: 'SN789012', marcaDisp: 'Apple', modeloDIsp: 'iPhone 13', fechaCompra: '2026-04-01', estadoDisp: 'Inactivo' },
          { idDisp: 3, numeroSerie: 'SN345678', marcaDisp: 'Huawei', modeloDIsp: 'P40', fechaCompra: '2026-03-28', estadoDisp: 'Pendiente' }
        ];
      }
    });
  }
}

