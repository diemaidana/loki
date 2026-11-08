import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../service/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { UserService } from '../../service/user-service';
import { AuthService } from '../../auth/service/auth-service';
import { Account } from '../../model/account';

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
    currentAccount: Account | null = null;
  
  ngOnInit(): void{
      this.authService.account$.subscribe((account) => {
        this.isLoggedIn = !!account;
        this.currentAccount = account;
      });
    }

  navigateTo(id: string | number | undefined){
    this.router.navigateByUrl(`/product-detail/${id}`);
  }
}
