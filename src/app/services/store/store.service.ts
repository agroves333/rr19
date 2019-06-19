import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '../../interfaces/store.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private initialStore: Store = {
    projects: []
  };
  private data = new BehaviorSubject<Store>(this.initialStore);

  constructor() { }


}
