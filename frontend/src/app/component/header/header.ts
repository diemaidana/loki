import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { User } from '../../model/user';
import { SearchBar } from '../search-bar/search-bar';
import { AuthService } from '../../auth/service/auth-service';
import { SearchStateService } from '../../service/search-state-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, SearchBar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly searchStateService = inject(SearchStateService);
  
  // Valores default sin usuario logueado
  protected isLoggedIn : boolean = false;
  protected currentUser: User | null = null;

  /* ngOnInit(): void{
    this.authService.loginState.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
  } */

    onSearchUpdated(term: string) {
    // 1. Enviamos el término al servicio (para que ListProducts se entere)
    this.searchStateService.setSearchTerm(term);

    // 2. Si el usuario no está en la lista de productos, lo llevamos ahí
    // (Ignoramos los query params actuales con split)
    if (this.router.url.split('?')[0] !== '/list-products') {
      void this.router.navigate(['/list-products']);
    }
  }

  logout(){
    this.authService.logout();
    void this.router.navigateByUrl('/');
  }

  onSearch(name: string, event?: Event){
    // prevenir recarga si recibe el evento
    if(event) event.preventDefault();

    const n = (name ?? "").trim();
    if(n){
      this.router.navigate(['/list-products'], { queryParams: { q: n } });
    }else{
      this.router.navigateByUrl('/list-products');
    }
  }
}
