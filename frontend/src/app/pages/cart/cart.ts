import { Component, inject } from '@angular/core';
import { CartService } from '../../service/cart-service';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cart',
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  // Inyectamos el servicio. Al ser Signals, los usamos directamente en el HTML como funciones: cartService.items()
  public readonly cartService = inject(CartService);

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  updateQty(productId: string, qty: number) {
    this.cartService.updateQuantity(productId, qty);
  }

  // Aquí iría la lógica final de compra (Mercado Pago)
  proceedToPayment() {
    if (this.cartService.count() > 0) {
        console.log("Iniciando pago por monto: ", this.cartService.totalAmount());
        // this.paymentService.init(this.cartService.items())...
    }
  }
}