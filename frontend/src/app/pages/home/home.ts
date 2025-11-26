import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../service/product';
import { Product } from '../../model/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { User } from '../../model/user';
import { UserService } from '../../service/user-service';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    CurrencyPipe,
    ButtonModule,
    DividerModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home {
  private readonly productsService = inject(ProductService);
  private readonly router = inject(Router);
  protected readonly products = toSignal(this.productsService.getProducts(), { initialValue: [] });
  private readonly authService = inject(AuthService);

    // Valores default sin usuario logueado
    protected isLoggedIn : boolean = false;
    currentUser: User | null = null;
  
  ngOnInit(): void{
      this.authService.userState$.subscribe((user) => {
        this.isLoggedIn = !!user;
        this.currentUser = user;
      });
    }

  navigateTo(id: string | number | undefined){
    this.router.navigateByUrl(`/product-detail/${id}`);
  }
}
