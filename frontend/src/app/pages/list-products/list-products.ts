import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../service/product';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-list-products',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './list-products.html',
  styleUrl: './list-products.css',
})
export class ListProducts {
  private readonly http = inject(ProductService);
  private readonly products = toSignal(this.http.getProducts(), { initialValue: []});

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

  protected paginatedProducts = computed(() => {
    const page = this.currentPage();
//    const allProducts = this.productsToRender;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    if(this.currentCategory() === ""){
      this.totalPages = Math.ceil(this.products().length / this.pageSize);
      return this.products().slice(start, end);
    } else {
      const filteredProducts = this.products().filter(p => p.category === this.currentCategory());
      this.totalPages = Math.ceil(filteredProducts.length / this.pageSize);
      return filteredProducts.slice(start, end);
    }
    
    //return this.products()?.slice(start, end);
  })

  previousPage() {
    if(this.currentPage() > 1){
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage() {
    const pages = Math.ceil(this.paginatedProducts.length / this.pageSize);
    console.log(this.totalPages);
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
  }
}
