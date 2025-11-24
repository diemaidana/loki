import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../service/user-service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../model/user';
import { filter, map, switchMap } from 'rxjs';

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
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  private readonly userSource$ = this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter((id): id is string => !!id),
    switchMap(id => this.service.getUserById(id)) 
  );

  private readonly userResource = toSignal(this.userSource$, { initialValue: null });
  userForm = signal<User | null>(null);

  isLoading = computed(() => this.userResource() === undefined);
  hasError = computed(() => this.userResource() === null);




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
