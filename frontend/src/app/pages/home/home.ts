import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../service/product';
import { Product } from '../../model/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { Footer } from "../../component/footer/footer";

@Component({
  selector: 'app-home',
  imports: [RouterLink, CurrencyPipe, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home {
  private readonly productsService = inject(ProductService);
  protected readonly products = toSignal(this.productsService.getProducts(), { initialValue: [] });
}
