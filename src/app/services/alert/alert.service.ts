import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  message = '';
  type = 'success';
  isOpen = false;

  constructor() { }

  open(message) {
    this.message = '';
    this.isOpen = true;
    this.message = message;

    setTimeout(() => {
      this.close();
    }, 3000);
  }

  close() {
    this.isOpen = false;
  }
}
