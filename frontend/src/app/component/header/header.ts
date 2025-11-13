import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  onSearch(name: string){
    if(name.trim().length === 0){
      return;
    }

    console.log(name);
  }

}
