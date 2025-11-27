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

  /**
   * Obtiene las notificaciones de un usuario específico
   */
  getUserNotifications(userId: string | number): Observable<Notification[]> {
    // Ordenamos por fecha descendente
    return this.http.get<Notification[]>(`${this.apiUrl}?recipientId=${userId}&_sort=date&_order=desc`);
  }

  // --- MÉTODOS GENERADORES DE NOTIFICACIONES ---

  /**
   * 🛒 Notificar al Vendedor sobre una COMPRA
   */
  notifySellerOfPurchase(sellerId: string | number, buyerName: string, orderId: string | number): Observable<Notification> {
    const notification: Notification = {

      recipientId: sellerId!,
      type: 'PURCHASE',
      title: '¡Nueva Venta!',
      message: `El usuario ${buyerName} ha realizado una compra de tus productos.`,
      date: new Date().toISOString(),
      relatedEntityId: orderId
    };
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  /**
   * 🏷️ Notificar al Vendedor sobre una OFERTA
   */
  notifySellerOfOffer(sellerId: string | number, buyerName: string, productName: string, amount: number): Observable<Notification> {
    const notification: Notification = {
      recipientId: sellerId,
      type: 'OFFER',
      title: 'Nueva Oferta Recibida',
      message: `${buyerName} ofertó $${amount} por tu producto "${productName}".`,
      date: new Date().toISOString()
    };
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  /**
   * 🔄 Notificar al Comprador sobre actualización de OFERTA (Aceptada/Rechazada)
   */
  notifyBuyerOfOfferUpdate(buyerId: string | number, productName: string, status: string): Observable<Notification> {
    let msg = '';
    if (status === 'accepted') msg = `¡Felicidades! Tu oferta por "${productName}" fue ACEPTADA.`;
    else if (status === 'rejected') msg = `Tu oferta por "${productName}" fue rechazada.`;
    else msg = `El vendedor ha respondido a tu oferta por "${productName}".`;

    const notification: Notification = {
      recipientId: buyerId,
      type: 'OFFER_UPDATE',
      title: 'Actualización de Oferta',
      message: msg,
      date: new Date().toISOString()
    };
    return this.http.post<Notification>(this.apiUrl, notification);
  }
}
