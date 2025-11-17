import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../service/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly id = this.route.snapshot.paramMap.get('id');

  protected product = toSignal(this.productService.getProductsById(this.id!));

  protected showOfferInput = signal(false);
  protected minAmount = 0;

  changeOffer() {
    this.showOfferInput.update(v => !v);
  }

  offer() {
    alert("La oferta por el producto: "+this.product()?.name! + " se realizo con exito");
    this.router.navigateByUrl("/");
  }

  buy(){
    const productData = this.product();
    
    if (!productData) {
      alert('Error: El producto no está cargado.');
      return;
    }

    // 2. Llamar al servicio para obtener el link de pago
    this.productService.generateMercadoPagoLink(productData.id!).subscribe({
      next: (checkoutUrl) => {
        // 3. Redirección final
        alert('Redirigiendo a Mercado Pago...');
        window.location.href = checkoutUrl;
      },
      error: (err) => {
        console.error('Error al generar el link de pago:', err);
        // 4. Mostrar error si falla la comunicación con el backend
        alert('Error: No se pudo generar el link de pago. Intente de nuevo más tarde.');
      }
    });
  }
}
