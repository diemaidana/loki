import { Component, inject } from '@angular/core';
import { CartService } from '../../service/cart-service';


/* PrimeNG imports */
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from "primeng/toast";
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CommonModule,
    ImageModule,
    InputNumberModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private router = inject(Router);
  public readonly cartService = inject(CartService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  updateQty(productId: string, qty: number) {
    this.cartService.updateQuantity(productId, qty);
  }


  // Aquí iría la lógica final de compra (conexion con MP)
  proceedToPayment() {
    if (this.cartService.count() > 0) {
        console.log("Iniciando pago por monto: ", this.cartService.totalAmount());
        this.confirm1(new Event('click'));
        // this.paymentService.init(this.cartService.items())...
    }
  }


  confirm1(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Quiere proceder con el pago?',
            header: 'Confirmation',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Pagar',
                icon: 'pi pi-check',
            },
            accept: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Pago exitoso',
                  detail: 'Pago aceptado. Redirigiendo' 
                });

                setTimeout(() => {
                    this.router.navigateByUrl("/");
                    this.cartService.clearCart();
                }, 2000);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Pago cancelado',
                    life: 3000,
                });
            },
        });
    }
}