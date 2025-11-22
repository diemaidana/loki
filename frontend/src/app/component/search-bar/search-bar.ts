import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search-bar',
  imports: [
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  public searchControl = new FormControl('');

  private subscription!: Subscription;

  @Output() search = new EventEmitter<string>();

  ngOnInit(){
    this.subscription = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.search.emit(value ?? '');
    });
  }

  clearSearch(): void{
    this.searchControl.setValue('');
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
