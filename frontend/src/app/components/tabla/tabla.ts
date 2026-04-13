import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

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
    dispositivos: any[] = [];
    datosCargados: boolean = false;

    loading: boolean = true;

    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.http.get<any[]>('http://localhost:8080/api/dispositivos').subscribe({
            next: (data) => {
                console.log('Datos recibidos del backend:', data);
                this.dispositivos = [...data];
                this.datosCargados = true;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error al obtener los datos del backend:', error);
                this.loading = false;
            }
        });
    }

    clear(table: Table) {
        table.clear();
    }

    getSeverity(estado: boolean) {
        return estado ? 'success' : 'danger';
    }
}
