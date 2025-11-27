import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from '../model/offer';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/offers'; 

  createOffer(offer: Offer): Observable<Offer> {
    return this.http.post<Offer>(this.apiUrl, offer);
  }

  updateOffer(offer: Offer): Observable<Offer> {
    if (!offer.id) {
        throw new Error('No se puede actualizar una oferta sin ID');
    }
    return this.http.put<Offer>(`${this.apiUrl}/${offer.id}`, offer);
  }

  updateOfferStatus(offerId: string | number, status: 'accepted' | 'rejected' | 'pending'): Observable<Offer> {
    return this.http.patch<Offer>(`${this.apiUrl}/${offerId}`, { status });
  }

  getOffersByProduct(productId: string | number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}?productId=${productId}`);
  }

  getOffersByUser(userId: string | number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}?userId=${userId}`);
  }

  getOffersBySeller(sellerId: string | number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}?sellerId=${sellerId}`);
  }
}