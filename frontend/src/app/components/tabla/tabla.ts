import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
    templateUrl: './tabla.html',
    standalone: true,
    selector:'app-table-demo',
    imports: [TableModule, CommonModule ]
})
export class TableBasicDemo implements OnInit {
    dispositivos: any[] = [];
    datosCargados: boolean = false;
    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.http.get<any[]>('http://localhost:8080/api/dispositivos').subscribe({
            next: (data) => {
                console.log('Datos recibidos del backend:', data);
                this.dispositivos = [...data];
                this.datosCargados = true;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error al obtener los datos del backend:', error);
            }
        });
    }
}
