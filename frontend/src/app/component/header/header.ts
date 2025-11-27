import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';

import { User } from '../../model/user';
import { SearchBar } from '../search-bar/search-bar';
import { AuthService } from '../../auth/service/auth-service';
import { SearchStateService } from '../../service/search-state-service';
import { MenuItem } from 'primeng/api';
import { CartService } from '../../service/cart-service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    SearchBar,
    ToolbarModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SplitButtonModule,
    BadgeModule,
    ToastModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly searchStateService = inject(SearchStateService);
  
  // Valores default sin usuario logueado
  protected isLoggedIn : boolean = false;
  protected cartService = inject(CartService);
  currentUser: User | null = null;


  ngOnInit(): void{
    this.authService.userState$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
  }

  onSearchUpdated(term: string) {
    // 1. Enviamos el término al servicio (para que ListProducts se entere)
    this.searchStateService.setSearchTerm(term);

    // 2. Si el usuario no está en la lista de productos, lo llevamos ahí
    // (Ignoramos los query params actuales con split)
    if (this.router.url.split('?')[0] !== '/list-products') {
      void this.router.navigate(['/list-products']);
    }
  }

  logout(): void{
    // Limpiamos el estado del AuthService
    this.authService.logout();
    this.router.navigateByUrl("/");
  }

  goToProfile(): void{
    this.router.navigateByUrl("/profile/" + this.currentUser?.fullName), {queryParams: {fullName  : this.currentUser!.fullName} };
  }

  goToCart(): void{
    this.router.navigateByUrl("/"+ this.currentUser?.fullName+"/cart");
  }
  items: MenuItem[];

    constructor() {
        this.items = [
          {
              label: 'Dashboard',
              icon: 'pi pi-fw pi-clipboard',
              command: () => this.router.navigateByUrl("/"+this.currentUser?.fullName+"/dashboard")
          },
          {
              separator: true
          },
          {
              label: 'Cerrar sesion',
              icon: 'pi pi-fw pi-sign-out',
              command: () => this.logout()
          }
        ];
    }
}
