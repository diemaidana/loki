import { Component, inject, signal } from '@angular/core';
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
import { Router } from '@angular/router';
import { CheckoutService } from '../../service/checkoutService';
import { AuthService } from '../../auth/service/auth-service';
import { User } from '../../model/user';
import { Checkout } from '../../model/checkout';
import { CheckoutItemDetail } from '../../model/check-out-item-detail';
import { NotificationService } from '../../service/notification-service';
import { ProductService } from '../../service/product';


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
  private notificationService = inject(NotificationService);
  private productService = inject(ProductService);
  private readonly checkoutService = inject(CheckoutService);

  private readonly authService = inject(AuthService);

  currentUser: User | null = null;
  isProcessing = signal(false); // Señal para bloquear el botón durante el proceso de pago
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


  proceedToPayment(event: Event) {
    // Validaciones previas
    if (this.cartService.count() === 0) return;
    if (this.isProcessing()) return;

    if (!this.currentUser) {
        this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Inicia sesión para comprar.' });
        return;
    }

    this.confirmPayment(event);
  }

  confirmPayment(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: `¿Confirmar pago total de $${this.cartService.totalAmount()}?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Pagar',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-secondary',
        
        accept: () => {
            this.isProcessing.set(true); 
            this.createSingleOrder();
        },
        reject: () => {
            this.messageService.add({
                severity: 'info',
                summary: 'Cancelado',
                detail: 'Operación cancelada',
                life: 3000,
            });
        },
    });
  }

  private createSingleOrder() {
    if (!this.currentUser) return;

    const checkoutItems = this.getCartItemsForCheckout(); 
    const sellerIds = this.getSellerIds();
    const newOrder: Checkout = {
        id_buyer: this.currentUser.id!,
        date: new Date().toISOString(),
        items: checkoutItems,
        totalAmount: this.cartService.totalAmount(), 
    };

    this.checkoutService.savePurchase(newOrder).subscribe({
        next: () => {
            this.cartService.items().forEach(cartItem => {
                const product = cartItem.product;
                const sellerId = (product as any).id_seller;

                if (sellerId) {
                    this.notificationService.notifySellerOfPurchase(
                        sellerId,               // Vendedor
                        this.currentUser!.id!,  // Comprador (Sender)
                        product.name,           // Nombre del Producto
                        product.id!              // ID del Producto
                    ).subscribe({
                        error: (e) => console.error(`Fallo al notificar venta de ${product.name}`, e)
                    });
                }
            });
            this.messageService.add({ 
                severity: 'success', 
                summary: '¡Pago Exitoso!', 
                detail: 'Redirigiendo al inicio...' 
            });

            setTimeout(() => {
                this.cartService.clearCart();
                this.router.navigateByUrl("/list-products"); 
            }, 2000);
        },
        error: (err) => {
            console.error('Error compra:', err);
            // Si falla, DESBLOQUEAMOS para que pueda intentar de nuevo
            this.isProcessing.set(false); 
            
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'No se pudo procesar el pago.' 
            });
        }
    });
  }

  // --- Métodos Auxiliares ---

  private getCartItemsForCheckout(): CheckoutItemDetail[] {
    return this.cartService.items().map(item => {
      const product = item.product;
      item.product.stock = item.product.stock - item.quantity;
      this.productService.updateProduct(product.id!, product).subscribe();
      return {
          productId: (item.product as any).id, 
          quantity: item.quantity,
          price: item.product.price,
          idSeller: item.product.id_seller!,
          productName: item.product.name
      };
    });
  }

  private getSellerIds(): (string | number)[] {
    const items = this.cartService.items();
    const sellersSet = new Set<string | number>();
    items.forEach(item => {
        const sellerId = (item.product as any).id_seller;
        if (sellerId) sellersSet.add(sellerId);
    });
    return Array.from(sellersSet);
  }

}