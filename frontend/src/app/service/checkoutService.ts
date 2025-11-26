import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Checkout } from '../model/checkout';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:3000/purchases"; 

  /* Guarda una nueva compra en la base de datos */
  savePurchase(checkout: Checkout): Observable<Checkout> {
    return this.http.post<Checkout>(this.apiUrl, checkout );
  }

  /* Obtener el historial de compras de un comprador específico */
  getPurchasesById(id: string | number): Observable<Checkout[]> {
    return this.http.get<Checkout[]>(`${this.apiUrl}/${id}`);
  }
}
