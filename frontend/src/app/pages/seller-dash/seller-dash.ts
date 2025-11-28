import { Component, computed, effect, inject, Input, OnInit, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Product } from '../../model/product';

import { TabsModule } from 'primeng/tabs';
import { ProductService } from '../../service/product';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { AuthService } from '../../auth/service/auth-service';
import { Checkout } from '../../model/checkout';
import { CheckoutService } from '../../service/checkoutService';
import { Offer } from '../../model/offer';
import { OfferService } from '../../service/offer-service';
import { DialogModule } from "primeng/dialog";
import { NotificationService } from '../../service/notification-service';
import { Notification } from '../../model/notification';
import { CartService } from '../../service/cart-service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-seller-dash',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    TabsModule,
    TableModule,
    ImageModule,
    ButtonModule,
    ToastModule,
    CardModule,
    FloatLabelModule,
    MessageModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    DatePipe,
    DialogModule
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './seller-dash.html',
  styleUrl: './seller-dash.css',
})
export class SellerDash implements OnInit{

  
  /* inyecciones */
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private checkoutService = inject(CheckoutService);
  private offerService = inject(OfferService);
  private readonly authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  protected currentUser = toSignal(this.authService.userState$);
  protected notifications = signal<Notification[]>([]);
  protected isLoading = signal<boolean>(true);
  protected products = signal<Product[]>([]);
  protected purchases = signal<Checkout[]>([]);
  protected myOffers = signal<Offer[]>([]);
  @Input() protected readonly product?:Product;
  private formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  protected editOfferDialog = false;
  private readonly router = inject(Router);

  activeTab = signal<string>('0');
  isEditing = signal<boolean>(false);
  editingProductId: string | number | null = null;
  isProcessingPay: any;
  
  protected mySales = computed(() => {
    const currentId = this.currentUser()?.id;
    
    if (!currentId || !this.purchases().length) return [];

    if(this.currentUser()?.isSeller){
      return this.purchases()
        .map(order => {
          const myItems = order.items.filter(item => item.idSeller == currentId);
          if (myItems.length === 0) return null;
          const myTotal = myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
          return {
            ...order,
            items: myItems,
            totalAmount: myTotal
          };
      })
      .filter(order => order !== null) as Checkout[];
    }else{
      return this.purchases().filter(p => p.id_buyer == currentId )
    } 
  });

  constructor() {
    // Usamos effect() para reaccionar cuando el usuario cargue
    effect(() => {
      const user = this.currentUser();
      // untracked evita bucles infinitos si modificamos otras señales dentro
      untracked(() => {
        if (user) {
          this.loadNotifications(user.id!);
          // Aquí también puedes cargar offers y products si dependen del usuario
          this.productService.getProductsBySellerId(user.id!).subscribe(d => this.products.set(d));
          this.offerService.getOffersBySeller(user.id!).subscribe(d => this.myOffers.set(d));
        }
      });
    });
  }
  protected productForm = this.formBuilder.nonNullable.group({
    name:["", [Validators.required]],
    brand: ["", [Validators.required]],
    description: ["", [Validators.required]],
    category: ["", [Validators.required]],
    stock: [0, [Validators.required]],
    image: [""],
    price: this.formBuilder.control(1, [Validators.required, Validators.min(1)])
  })



  get name() {
    return this.productForm.controls.name;
  }

  get brand() {
    return this.productForm.controls.brand;
  }

  get description() {
    return this.productForm.controls.description;
  }

  get cateegory() {
    return this.productForm.controls.category;
  }
  
  get image() {
    return this.productForm.controls.image;
  }
  
  get price() {
    return this.productForm.controls.price;
  }

  get touched() {
    return this.productForm.touched;
  }

  ngOnInit(): void {
    
    this.checkoutService.getPurchases().subscribe((data) => {
      this.purchases.set(data);
    })
    
    if(this.currentUser()?.isSeller){
      this.offerService.getOffersBySeller(this.currentUser()?.id!).subscribe((data) => {
        this.myOffers.set(data);
      });

      this.productService.getProductsBySellerId(this.currentUser()?.id!).subscribe((data) => {
        this.products.set(data);
      })
    }else{
        this.offerService.getOffersByUser(this.currentUser()?.id!).subscribe((data) => {
          this.myOffers.set(data);
        })
    }

    if (this.currentUser()) {
      this.loadNotifications(this.currentUser()?.id!);
    } else {
      this.isLoading.set(false);
    }
  }

  saveProduct(){
    if(this.productForm.invalid) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Formulario inválido'});
      return;
    }

    if(this.isEditing()){
      this.handleUpdate();
    }else{
      this.handleAdd();
    }
  }

  private handleUpdate() {
    const rawValue = this.productForm.getRawValue();
    const newProduct: Product = {
      ...rawValue,
      id: this.editingProductId!.toString(),
      id_seller: this.currentUser()?.id,
      price: rawValue.price ?? 0
    };
    
    this.productService.updateProduct(newProduct.id!, newProduct).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Producto modificado con éxito' });
        
        this.products.update((current) => 
          current.map( (p) => p.id === newProduct.id ? newProduct : p)
        );

        this.resetForm();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el producto' });
        console.error(err);          
      }
    })
  }


  private handleAdd(){
    const rawValue = this.productForm.getRawValue();
      const newProduct: Product = {
        ...rawValue,
        id_seller: this.currentUser()?.id,
        price: rawValue.price ?? 0,
        image: rawValue.image ?  rawValue.image : "Image-not-found.png" 
      }

      this.productService.addProduct(newProduct).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Producto agregado con éxito' });
          this.products.update(current => [...current, newProduct]);
          this.resetForm();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el producto' });
          console.error(err); 
        }
      });
    }
  
  onTabChange(tabIndex: string | number | undefined) {
    const indexStr = String(tabIndex);
    if (indexStr !== '1') {
      this.resetForm();
      
    }
  }

  resetForm() {
    this.productForm.reset();
    this.isEditing.set(false);
    this.editingProductId = null;
  }

  editProduct(product: Product) {
    this.isEditing.set(true);
    this.editingProductId = product.id!;

    this.productForm.patchValue({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      image: product.image,
    });

    this.activeTab.set('1');
  }

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product.id!).subscribe({
      next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Producto eliminado con éxito' });
          this.products.update((current) => 
            current.filter((p) => p.id !== product.id)
          );
      },
      error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto' });
      }
    })
  }

  private updateOffer(offer: Offer) {
    if(offer.status === 'aceptada'){
      this.offerService.updateOfferStatus(offer.id!, offer.status).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Oferta aceptada con éxito' });

            if(this.currentUser()?.isSeller){
              this.notificationService.notifyBuyerOfOfferUpdate( offer.userId, offer.sellerId , offer.productName, offer.productId).subscribe();
            }else{
              console.log("es drogadicto"); 
              this.notificationService.notifySellerOfOffer(offer.userId, offer.sellerId, offer.productName, offer.productId).subscribe();
            }

          this.myOffers.update(currentList => 
            currentList.map(o => o.id === offer.id ? { ...o, status: 'aceptada' } : o)
          );
        },
        error: (err) => {
          this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo aceptar la oferta' });
        },
      });

    }else if (offer.status === 'pendiente'){
    
      this.offerService.updateOffer(offer).subscribe({
        next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Contra-Oferta enviada con éxito' });
            this.myOffers.update(currentList => 
              currentList.map(o => o.id === offer.id ? { ...o, status: 'pendiente' } : o)
            );
            
            console.log(this.currentUser()?.isSeller);

            if(this.currentUser()?.isSeller){
              this.notificationService.notifyBuyerOfOfferUpdate( offer.userId, offer.sellerId , offer.productName, offer.productId).subscribe();
            }else{
              console.log("es drogadicto"); 
              this.notificationService.notifySellerOfOffer(offer.userId, offer.sellerId, offer.productName, offer.productId).subscribe();
            }
          },
          error: () =>{
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo actualizar la oferta' });
          }
        }
      );
    }else {
      this.offerService.updateOfferStatus(offer.id!, offer.status).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Oferta rechazada con éxito' });
            this.myOffers.update(currentList => 
              currentList.map(o => o.id === offer.id ? { ...o, status: 'rechazada' } : o)
            );
            if(this.currentUser()?.isSeller){
              this.notificationService.notifyBuyerOfOfferUpdate( offer.userId, offer.sellerId , offer.productName, offer.productId).subscribe();
            }else{
              console.log("es drogadicto"); 
              this.notificationService.notifySellerOfOffer(offer.userId, offer.sellerId, offer.productName, offer.productId).subscribe();
            }
          },
          error: () =>{
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo rechazar la oferta' });
          }
        }
      )
    }
  }

  acceptOffer(offer: Offer){
    offer.status = 'aceptada';
    this.updateOffer(offer);
  }

  editOffer(offer: Offer, priceOffer: number){
    offer.amount = priceOffer;
    offer.lastOffer = !(offer.lastOffer);

    this.updateOffer(offer);
  }

  rejectOffer(offer: Offer){
    offer.status = 'rechazada'
    this.updateOffer(offer);
  }

  showEditDialog(offer: Offer) {
    this.editOfferDialog = true;
  }

  loadNotifications(userId: string | number) {

    this.isLoading.set(true);
    
    this.notificationService.getUserNotifications(userId).subscribe({
      next: (data) => {
        const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        console.log(this.notifications());
        this.notifications.set(sorted);
        console.log(this.notifications());
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando notificaciones', err);
        this.isLoading.set(false);
      }
    });
    console.log(this.notifications());
  }

  leido(noti : Notification){
    this.notificationService.toggleRead(noti).subscribe({
      next:() =>{
        this.messageService.add({ severity: 'info', summary: 'Vista', detail: 'Marcada como leida.' })
          if(this.currentUser()?.isSeller){
            if(noti.type === "compra"){
              this.activeTab.set("2")
            } else {
              this.activeTab.set("3")
            }
          }
          else{
            if(noti.type === "compra"){
              this.activeTab.set("0")
            } else {
              this.activeTab.set("1")
            }
          }
        },
        error: (err) => {
          this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo marcar.' })
        }
      })
  }

  goToPay(notif: Notification) {
    if (!this.currentUser) return;
    this.isProcessingPay.set(true);

    this.offerService.getOffersByProduct(notif.productId).subscribe({
        next: (offers) => {
            const acceptedOffer = offers.find(o => 
                o.userId == this.currentUser()!.id && 
                o.status === 'aceptada'
            );

            if (acceptedOffer) {
                this.addToCartWithOfferPrice(notif.productId, acceptedOffer.amount);
            } else {
                this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Esta oferta no está disponible para pago.' });
                this.isProcessingPay.set(false);
                this.router.navigate(['/product', notif.productId]);
            }
        },
        error: (err) => {
            console.error(err);
            this.isProcessingPay.set(false);
        }
    });
  }

  private addToCartWithOfferPrice(productId: string | number, offerPrice: number) {
      this.productService.getProductsById(productId).subscribe({
          next: (product) => {
              if (product) {
                  const offerProduct = { ...product, price: offerPrice };
                  this.cartService.clearCart();
                  this.cartService.addToCart(offerProduct);
                  
                  this.messageService.add({ severity: 'success', summary: 'Oferta Aplicada', detail: 'Redirigiendo al pago...' });
                  
                  setTimeout(() => {
                      this.router.navigate(['/checkout']);
                  }, 1000);
              }
          },
          complete: () => this.isProcessingPay.set(false)
      });
  }
}
