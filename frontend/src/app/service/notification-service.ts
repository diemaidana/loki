import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../model/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/notifications';

  getUserNotifications(userId: string | number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}?recipientId=${userId}&_sort=date&_order=desc`);
  }

  notifySellerOfPurchase(sellerId: string | number, buyerId: string | number, productName: string, productId: string | number): Observable<Notification> {
    const notification: Notification = {
      recipientId: sellerId,
      senderId: buyerId,
      type: 'compra',
      productName: productName,
      productId: productId,
      date: new Date().toISOString()
    };
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  notifySellerOfOffer(sellerId: string | number, buyerId: string | number, productName: string, productId: string | number): Observable<Notification> {
    const notification: Notification = {
      recipientId: sellerId,
      senderId: buyerId,
      type: 'oferta',
      productName: productName,
      productId: productId,
      date: new Date().toISOString()
    };
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  notifyBuyerOfOfferUpdate(buyerId: string | number, sellerId: string | number, productName: string, productId: string | number): Observable<Notification> {
    const notification: Notification = {
      recipientId: buyerId,
      senderId: sellerId,
      type: 'updateDeOferta',
      productName: productName,
      productId: productId,
      date: new Date().toISOString()
    };
    return this.http.post<Notification>(this.apiUrl, notification);
  }
}
