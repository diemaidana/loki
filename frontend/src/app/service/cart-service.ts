import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../model/cart-item';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  
  // Leemos el LocalStorage
  private itemsSignal = signal<CartItem[]>(this.loadCartFromStorage());

  // Mostramos el listado de items en modo lectura
  readonly items = this.itemsSignal.asReadonly();

  // Calcula el total de productos
  readonly count = computed(() => 
    this.itemsSignal().reduce((total, item) => total + item.quantity, 0)
  );

  // Calcula el precio total
  readonly totalAmount = computed(() => 
    this.itemsSignal().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );


  /** Agrega un producto al carrito, si existe aumenta la cantidad */
  addToCart(product: Product): void {
    this.itemsSignal.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Si ya existe, creamos un nuevo array con la cantidad actualizada
        return items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Si es nuevo, lo agregamos
        return [...items, { product, quantity: 1 }];
      }
    });
    
    this.saveCartToStorage();
  }

  /** Remueve un ítem completo del carrito */
  removeFromCart(productId: string): void {
    this.itemsSignal.update(items => 
      items.filter(item => item.product.id !== productId)
    );
    this.saveCartToStorage();
  }

  /** Incrementa o decrementa cantidad de un producto específico */
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.itemsSignal.update(items =>
      items.map(item => 
        String(item.product.id) === String(productId) ? { ...item, quantity } : item
      )
    );
    this.saveCartToStorage();
  }

  /** Vacía el carrito */
  clearCart(): void {
    this.itemsSignal.set([]);
    this.saveCartToStorage();
  }

  // --- Persistencia ---
  private saveCartToStorage(): void {
    localStorage.setItem('loki_cart', JSON.stringify(this.itemsSignal()));
  }

  private loadCartFromStorage(): CartItem[] {
    const storedCart = localStorage.getItem('loki_cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }
}