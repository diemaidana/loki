import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../model/product';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:3000/products";

  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductsById(id: number |string){
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product){
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string | number, product: Product){
    return this.http.put<Product>(this.apiUrl, product);
  }

  deleteProduct(id: string | number){
    return this.http.delete<Product>(`${this.apiUrl}/${id}`);
  }

    generateMercadoPagoLink(productId: string | number): Observable<string> {
    // 🛑 ADVERTENCIA: Esta es una SIMULACIÓN. 
    // En producción, aquí harías una llamada HTTP POST a tu propio backend:
    // return this.http.post<{ checkoutUrl: string }>(`${this.apiUrl}/checkout`, { productId })
    //   .pipe(map(response => response.checkoutUrl));
    
    // SIMULACIÓN (Ejemplo de Mercado Pago Sandbox URL):
    const mockCheckoutUrl = 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=YOUR_PREFERENCE_ID';

    return of(mockCheckoutUrl).pipe(
      delay(1500) // Simular latencia de red
    );
  }
}
