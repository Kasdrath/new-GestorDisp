import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { Component, Input, OnInit } from '@angular/core';
import { Button } from "primeng/button";
import { DialogModule } from 'primeng/dialog';

@Component({
    templateUrl: './tabla.html',
    standalone: true,
    selector: 'app-table-demo',
    imports: [
        TableModule,
        CommonModule,
        FormsModule,
        SelectModule,
        IconFieldModule,
        InputIconModule,
        MultiSelectModule,
        TagModule,
        InputTextModule,
        Button,
        DialogModule
    ]
})
export class TableBasicDemo implements OnInit {
    @Input() datos: any[] = [];
    @Input() columnas: any[] = [];
    @Input() camposFiltroGlobal: string[] = [];
    loading: boolean = true;
    dispositivo: any = {};
    submitted: boolean = false;
    productDialog: boolean = false;

    get camposFiltroDinamico(): string[] {
        if (this.camposFiltroGlobal && this.camposFiltroGlobal.length > 0) {
            return this.camposFiltroGlobal;
        }
        return this.columnas.map(col => col.field);
    }

    ngOnInit() {
        this.loading = false;
    }

    clear(table: Table) {
        table.clear();
    }

    getSeverity(estado: boolean) {
        return estado ? 'success' : 'danger';
    }

    openNewDispositivo() {
        this.dispositivo = {};
        this.submitted = false;
        this.productDialog = true;
    }
}
