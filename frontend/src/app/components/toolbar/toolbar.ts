import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-toolbar',
  imports: [ButtonModule, ToastModule, ToolbarModule, FileUploadModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
  standalone: true,
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  constructor(private messageService: MessageService) {}
  showToastSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Info',
      detail: 'Creado exitosamente',
    });
    console.log('Archivo subido exitosamente');
  }
  showToastDelete() {
    this.messageService.add({
      severity: 'danger',
      summary: 'Error',
      detail: 'Elemento eliminado',
    });
  }
  
}
