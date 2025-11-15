import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../model/product';

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

}
