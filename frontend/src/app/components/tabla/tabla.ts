
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

@Component({
    templateUrl: './tabla.html',
    standalone: true,
    selector:'app-table-demo',
    imports: [
        TableModule, 
        CommonModule,
        FormsModule,
        SelectModule,
        IconFieldModule,
        InputIconModule,
        MultiSelectModule,
        TagModule,
        InputTextModule
    ]
})
export class TableBasicDemo implements OnInit {
    @Input() dispositivos: any[] = [];
    @Input() columnas: any[] = [];
    @Input() camposFiltroGlobal: string[] = ['numeroSerie', 'marcaDisp', 'modeloDisp'];
    loading: boolean = true;

    ngOnInit() {
        this.loading = false;
    }



    clear(table: Table) {
        table.clear();
    }

    getSeverity(estado: boolean) {
        return estado ? 'success' : 'danger';
    }
}
