import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  getCurrencyValue(value) {
    return Number(value).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
  }

  convertCurrencyToNumber(value) {
    if (typeof value === 'string') {
      return Number(value.replace(/[^0-9.-]+/g, ''));
    }
    return value;
  }

  formatPercentage(percentage) {
    return `${Math.floor(percentage  * 100)} %`;
  }

  capitalize(s) {
    if (typeof s !== 'string') { return ''; }
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
