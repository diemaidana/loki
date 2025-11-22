import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../service/product';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-products',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './list-products.html',
  styleUrl: './list-products.css',
})
export class ListProducts {
  private readonly http = inject(ProductService);
  private readonly router = inject(Router);
  private readonly products = toSignal(this.http.getProducts(), { initialValue: []});
  private readonly searchTerm = toSignal(this.searchStateService.searchTerm, { initialValue: '' });


  /*
  private productsToRender = computed(() => {
    return [...this.products()];
  })
  */
  protected categories = computed(() => {
    const prods = this.products();
    return [...new Set(prods?.map(p => p.category))];
  })

  protected currentCategory = signal("");

  protected currentPage = signal(1);
  private pageSize = 9;
  protected totalPages = 0;


  // Filtra por queryParam y Categoria
  protected readonly productFiltered = computed(() => {
    const term = this.searchTerm()?.toLowerCase() || '';
    const category = this.currentCategory();
    let filtered = this.products();

    // Filtro por Buscador
    if (term) {
      filtered = filtered.filter(p => 
        (p.name?.toLowerCase().includes(term)) || 
        (p.description?.toLowerCase().includes(term)) ||
        (p.brand?.toLowerCase().includes(term)) ||
        (p.category?.toLowerCase().includes(term))
      );
    }

    // Filtro por Categoría
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    return filtered;
  });


  // Voy a refactorizar esta funcion.
  protected paginatedProducts = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    const filtered = this.productFiltered();
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    return filtered.slice(start, end);

    /* 
    if(this.currentCategory() === ""){
      const filtered = this.productFiltered();
      this.totalPages = Math.ceil(filtered.length / this.pageSize);
      return this.products().slice(start, end);
    } else {
      const filteredProducts = this.products().filter(p => p.category === this.currentCategory());
      this.totalPages = Math.ceil(filteredProducts.length / this.pageSize);
      return filteredProducts.slice(start, end);
    }
    */ 
    //return this.products()?.slice(start, end);
  })

  previousPage() {
    if(this.currentPage() > 1){
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage() {
/*     const pages = Math.ceil(this.paginatedProducts.length / this.pageSize);
    console.log(this.totalPages); */
    if(this.currentPage() < this.totalPages){
      this.currentPage.update(page => page + 1);
    }
  }

  changeCategory(category: string){
    if(this.currentCategory() === category){
      this.currentCategory.update(cat => "");
    } else {
      this.currentCategory.update(cat => category);
    }
    console.log(this.currentCategory());

    this.currentPage.set(1);
  }

  navigateTo(id: string | number | undefined){
    this.router.navigateByUrl(`/product-detail/${id}`);
  }
}
