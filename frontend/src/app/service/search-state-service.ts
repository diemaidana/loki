import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchStateService {
  private searchTermSubject = new BehaviorSubject<string>('');
  public searchTerm: Observable<string> = this.searchTermSubject.asObservable();

  setSearchTerm(term: string): void {
    const cleanTerm = term.toLowerCase().trim();
    this.searchTermSubject.next(cleanTerm);
  }
}
