import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ToolbarModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header{

  onSearch(name: string){
    if(name.trim().length === 0){
      return;
    }

    console.log(name);
  }

}
