import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../model/product';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { ProductQuery } from './product-query';
import { ProductSummary } from '../model/product-summary';
import { ProductRequest } from '../model/product-request';
import { ProductDetail } from '../model/product-detail';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly basePath = '/products';

  // Todos los productos publicados SIN portada.
  getAllProducts(query: ProductQuery = {}): Observable<Page<Product>> {
    return this.http.get<Page<Product>>(`${this.basePath}`, { params: this.toParams(query) });
  }

  // Todos los productos publicados CON portada.
  getPublishedProduct(query: ProductQuery = {}): Observable<Page<ProductSummary>> {
    return this.http.get<Page<ProductSummary>>(`${this.basePath}/published`, { params: this.toParams(query) });
  }

  // El prodcucto publicado con portada y detalle de imágenes.
  getProductDetail(productCode: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.basePath}/${productCode}`);
  }

  create(request: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.basePath, request);
  }
  
  update(productCode: string, request: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.basePath}/${productCode}`, request);
  }
  
  deleteProduct(productCode: string): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${productCode}`);
  }

  private toParams(query: ProductQuery): HttpParams {
    let params = new HttpParams();

    if (query.title) params = params.set('title', query.title);
    if (query.minPrice != null) params = params.set('minPrice', query.minPrice);
    if (query.maxPrice != null) params = params.set('maxPrice', query.maxPrice);
    if (query.page != null) params = params.set('page', query.page);
    if (query.size != null) params = params.set('size', query.size);

    for (const code of query.categoryCodes ?? []) {
      params = params.append('categoryCodes', code);
    }

    return params;
  }
  
/*   private readonly http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:3000/products";

  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductsById(id: number |string){
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsBySellerId(sellerID: number | string){
    return this.http.get<Product[]>(`${this.apiUrl}?id_seller=${sellerID}`);
  }

  addProduct(product: Product){
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string | number, product: Product){
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
*/
}
