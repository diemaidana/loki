import { Component, computed, effect, inject, Input, OnInit, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs/operators';
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
  protected mySales = computed(() => {
    const sellerId = this.currentUser()?.id;
    
    if (!sellerId || !this.purchases().length) return [];

    return this.purchases()
      .map(order => {

        const myItems = order.items.filter(item => item.idSeller == sellerId);

        if (myItems.length === 0) return null;

        const myTotal = myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        return {
          ...order,
          items: myItems,
          totalAmount: myTotal
        };
      })
      .filter(order => order !== null) as Checkout[]; 
  });

  protected myOffers = signal<Offer[]>([]);

  @Input() protected readonly product?:Product;

  private formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  protected productForm = this.formBuilder.nonNullable.group({
    name:["", [Validators.required]],
    brand: ["", [Validators.required]],
    description: ["", [Validators.required]],
    category: ["", [Validators.required]],
    image: ["", [Validators.required]],
    price: this.formBuilder.control(1, [Validators.required, Validators.min(1)])
  })

  activeTab = signal<string>('0');
  isEditing = signal<boolean>(false);
  editingProductId: string | number | null = null;

  protected editOfferDialog = false;

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
    this.productService.getProductsBySellerId(this.currentUser()?.id!).subscribe((data) => {
      this.products.set(data);
    })

    this.checkoutService.getPurchases().subscribe((data) => {
      this.purchases.set(data);
    })

    this.offerService.getOffersBySeller(this.currentUser()?.id!).subscribe((data) => {
      this.myOffers.set(data);
    });
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
    console.log(this.editingProductId);
    console.log(newProduct.id);
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
        price: rawValue.price ?? 0
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
      this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Oferta aceptada con éxito' });
      this.offerService.updateOfferStatus(offer.id!, offer.status);

      this.myOffers.update(currentList => 
        currentList.map(o => o.id === offer.id ? { ...o, status: 'aceptada' } : o)
      );
    }else if (offer.status === 'pendiente'){
      this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Contra-Oferta enviada con éxito' });
      this.offerService.updateOffer(offer);
      
      this.myOffers.update(currentList => 
        currentList.map(o => o.id === offer.id ? offer : o)
      );
    }else {
      this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Oferta rechazada con éxito' });
      this.offerService.updateOfferStatus(offer.id!, offer.status);

      this.myOffers.update(currentList => 
        currentList.map(o => o.id === offer.id ? { ...o, status: 'rechazada' } : o)
      );
    }
  }

  acceptOffer(offer: Offer){
    offer.status = 'aceptada';
    this.updateOffer(offer);
  }

  editOffer(offer: Offer, priceOffer: number){
    offer.amount = priceOffer;
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
        
        this.notifications.set(sorted);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando notificaciones', err);
        this.isLoading.set(false);
      }
    });
  }
}
