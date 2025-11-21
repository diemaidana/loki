import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly router = inject(Router);
  onSearch(name: string){
    const n = (name ?? "").trim();
    if(n){
      this.router.navigate(['/search'], { queryParams: { q: n } });
    }else{
      this.router.navigateByUrl('/list-products');
    }
  }
}
