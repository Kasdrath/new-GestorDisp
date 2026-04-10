import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { FilterService, MenuItem } from 'primeng/api';
import { OnInit } from '@angular/core';




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
        this.filterService.filter([target.value], ['name'], 'contains', 'AND');
    }
}