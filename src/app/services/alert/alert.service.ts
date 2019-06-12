import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  message = '';
  type = '';
  isOpen = false;

  constructor() { }

  alert(type, message = 'success') {
    this.message = '';
    this.type = type;
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
