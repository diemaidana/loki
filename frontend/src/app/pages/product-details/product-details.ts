import { Component, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../service/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';

import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CartService } from '../../service/cart-service';
import { Offer } from '../../model/offer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OfferService } from '../../service/offer-service';
import { AuthService } from '../../auth/service/auth-service';
import { User } from '../../model/user';
import { FormsModule } from '@angular/forms';
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { NotificationService } from '../../service/notification-service';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    ImageModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    FormsModule,
    Toast,
    ConfirmDialog
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);
  private readonly cartService = inject(CartService);
  private readonly offerService = inject(OfferService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  private readonly id = this.route.snapshot.paramMap.get('id');

  // Datos del producto (Signal)
  protected product = toSignal(this.productService.getProductsById(this.id!), { initialValue: null });
  // Usuario actual (Comprador)
  protected currentUser: User | null = null;
  
  // Estado del Modal de Oferta
  protected showOfferDialog = signal(false);
  @Input() offerAmount = signal<number | null>(null);
  protected isSubmittingOffer = signal(false);

  ngOnInit() {
    this.authService.userState$.subscribe(user => this.currentUser = user);
  }

  // --- Lógica del Carrito ---

  addToCart() {
    const p = this.product();
    if (!p) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Producto no disponible.' });
        return;
    }

    this.cartService.addToCart(p);
    this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Producto agregado al carrito' });
    
    // Una vez agregado al carrito, redirigir al listado de productos
    setTimeout(() => this.router.navigate(['/list-products']), 500);
  }

  // --- Lógica de Ofertas ---

  openOfferDialog() {
    // Validamos que este logeado.
    if (!this.currentUser) {
        this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debes iniciar sesión para ofertar.' });

        const currentUrl = this.router.url;
        setTimeout(() => this.router.navigate(['/sign-in'], { queryParams: { returnUrl: currentUrl } }), 1000);
        return;
    }
    
    const p = this.product();
    if (!p) return;

    // 2. Sugerir precio (10% de descuento)
    this.offerAmount.set(p.price * 0.9); 
    this.showOfferDialog.set(true);
  }

  changeOffer() {
    this.showOfferDialog.set(false);
    this.offerAmount.set(null);
    this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'La oferta ha sido cancelada.' });
  }

  submitOffer() {
    const p = this.product();
    const amount = this.offerAmount();
    const buyer = this.currentUser;

    if (!p || !buyer || !amount) return;

    if (amount <= 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El monto debe ser mayor a 0.' });
        return;
    }

    if (amount >= p.price) {
         this.messageService.add({ severity: 'info', summary: 'Consejo', detail: 'Puedes comprar directamente si ofreces el precio total.' });
    }

    this.isSubmittingOffer.set(true);

    const sellerId = (p as any).id_seller;

    if (!sellerId) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Este producto no tiene un vendedor asignado.' });
        this.isSubmittingOffer.set(false);
        return;
    }

    const newOffer: Offer = {
        productId: p.id!,        
        userId: buyer.id!,
        productName: p.name,      
        sellerId: sellerId,     
        amount: amount,         
        date: new Date().toISOString(),
        status: 'pendiente'       
    };

    this.offerService.createOffer(newOffer).subscribe({
        next: () => {
            this.messageService.add({ 
                severity: 'success', 
                summary: 'Oferta Enviada', 
                detail: `Has ofertado $${amount}. El vendedor será notificado.` 
            });

            this.notificationService.notifySellerOfOffer(
                sellerId, 
                buyer.id!,        // Sender ID (Comprador)
                p.name,           // Nombre Producto
                p.id!             // ID Producto
            ).subscribe({
                error: (e) => console.error('Fallo al notificar oferta', e)
            });

            this.isSubmittingOffer.set(false);
            this.showOfferDialog.set(false); // Cerrar modal
            setTimeout(() => {
              this.router.navigateByUrl("/list-products");
            }, 2000);
        },
        error: (err) => {
            console.error('Error creando oferta:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar la oferta. Intente más tarde.' });
            this.isSubmittingOffer.set(false);
        }
    });
  }
}
