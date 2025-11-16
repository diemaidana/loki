import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../service/product';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-list-products',
  imports: [CurrencyPipe],
  templateUrl: './list-products.html',
  styleUrl: './list-products.css',
})
export class ListProducts {
  private readonly http = inject(ProductService);
  protected readonly products = toSignal(this.http.getProducts(), { initialValue: []});

  protected categories = computed(() => {
    const prods = this.products();
    return [...new Set(prods?.map(p => p.category))];
  })

  protected currentPage = signal(1);
  private pageSize = 9;

  protected paginatedProducts = computed(() => {
    const page = this.currentPage();
    const allProducts = this.products();

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.products()?.slice(start, end);
  })

  previousPage() {
    if(this.currentPage() > 1){
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage() {
    const pages = Math.ceil(this.products().length / this.pageSize);
    if(this.currentPage() < pages){
      this.currentPage.update(page => page + 1);
    }
  }


}
