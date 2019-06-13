import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  getCurrencyValue(value) {
    return Number(value).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
  }

  formatPercentage(percentage) {
    return `${Math.floor(percentage  * 100)} %`;
  }

  capitalize(s) {
    if (typeof s !== 'string') { return ''; }
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
