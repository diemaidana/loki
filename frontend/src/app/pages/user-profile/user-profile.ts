import { Component, inject, linkedSignal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../service/user-service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../model/user';

@Component({
  selector: 'app-user-profile',
  imports: [ConfirmDialogModule, ButtonModule, ToastModule, IconFieldModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {

  private readonly service = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly params = this.route.snapshot.paramMap.get('id')!;

  private readonly userProvider = toSignal(this.service.getUserById(this.params));

  user = this.service.getUserById(this.params);

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  confirm() {
    this.confirmationService.confirm({
      header: 'Desea guardar??',
      message: 'Confirmar para guardar los cambios',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Guardado!' });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }
}
