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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from "primeng/toast";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from '../../service/checkoutService';
import { AuthService } from '../../auth/service/auth-service';
import { UserService } from '../../service/user-service';
import { User } from '../../model/user';
import { Checkout } from '../../model/checkout';


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

  private readonly checkoutService = inject(CheckoutService);

  private readonly authService = inject(AuthService);

  currentUser: User | null = null;

  ngOnInit() {
    // Necesitamos al usuario para asignarle el id_buyer
    this.authService.userState$.subscribe(user => this.currentUser = user);
  }

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
                    this.createSingleOrder();
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


  /* Esta funcion aca no deberia ir. Pero bueno ahora mismo no se me ocurre en que lugar lo tendria que hacer. Ya que Oferta y Carrito la usan. */
  private createSingleOrder() {
    if (!this.currentUser) return;

    const items = this.cartService.items();

    // Obtenemos los IDs de los vendedores
    const sellersSet = this.getSellerIds();

    // Creamos la onder de compra.
    const newOrder: Checkout = {
        id_buyer: this.currentUser.id!, // ID del comprador
        id_sellers: Array.from(sellersSet), // obtenemos un listado de IDs de vendedores
        date: new Date().toISOString(), // fecha actual en formato STRING e ISO
        items: items, 
        totalAmount: this.cartService.totalAmount(),
    };

    // Guardamos en el Json-server
    this.checkoutService.savePurchase(newOrder).subscribe({
        next: () => {
            this.messageService.add({ 
                severity: 'success', 
                summary: '¡Compra Exitosa!', 
                detail: 'Tu pedido ha sido procesado correctamente.' 
            });

            // Esperar 2 segundos para que el usuario vea el mensaje
            setTimeout(() => {
                  this.checkoutService.savePurchase(newOrder).subscribe( () => {
                  this.cartService.clearCart(); // Vaciamos el carrito local
                  this.router.navigateByUrl("/"); // Volvemos al home
                });
            }, 2000);
        },
        error: (err) => {
            console.error('Error al procesar compra:', err);
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Hubo un problema al procesar el pago. Intente más tarde.' 
            });
        }
    });
  }


  private getSellerIds(): (string | number)[] {
    const items = this.cartService.items();
    const sellersSet = new Set<string | number>();
    items.forEach(item => {
        const sellerId = (item.product as any).id_seller;
        if (sellerId) {
            sellersSet.add(sellerId);
        }
    });
    return Array.from(sellersSet);
  }
}