import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../service/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';

import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CartService } from '../../service/cart-service';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    ImageModule,
    ButtonModule,
    DialogModule,
    InputNumberModule
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);

  private readonly id = this.route.snapshot.paramMap.get('id');

  protected product = toSignal(this.productService.getProductsById(this.id!));

  protected showOfferInput = signal(false);
  protected minAmount = 0;

  protected dialogVisible: boolean = false;

  changeOffer() {
    this.dialogVisible = !this.dialogVisible;
  }

  offer() {
    alert("La oferta por el producto: "+this.product()?.name! + " se realizo con exito");
    this.router.navigateByUrl("/");
    this.dialogVisible = false;
  }

  buy(){
    const productData = this.product();
    
    if (!productData) {
      alert('Error: El producto no está cargado.');
      return;
    }

    this.cartService.addToCart(productData);
    this.router.navigateByUrl('/');
  }
}
