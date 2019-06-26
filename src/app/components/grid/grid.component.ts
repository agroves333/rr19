import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {UtilityService} from '../../services/utility/utility.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  @Input() data: any[];
  @Input() headers: any[];
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Output() editCell: EventEmitter<any> = new EventEmitter();
  gridForm = new FormGroup({});

  constructor(private utils: UtilityService) {}

  ngOnInit() {
    const filterGroup = new FormGroup({});
    this.headers.forEach(header => {
      if (header.field) {
        if (header.type === 'date') {
          filterGroup.addControl(`${header.field}_from`, new FormControl());
          filterGroup.addControl(`${header.field}_to`, new FormControl());
        } else {
          filterGroup.addControl(header.field, new FormControl());
        }
      }
    });

    const gridGroup = new FormGroup({});
    if (this.data && this.headers) {
      // Build form
      this.data.forEach(row => {
        this.headers.forEach(header => {
          if (header.field) {
            const inputName = `${header.field}_${row.id}`;
            const defaultValue = this.getValue(row, header.field, header.type);
            const cellFormControl = new FormControl(defaultValue);
            gridGroup.addControl(inputName, cellFormControl);
          }
        });
        this.gridForm.addControl('filters', filterGroup);
        this.gridForm.addControl('grid', gridGroup);
      });
    }
  }

  updateFilters(field, value, partial, type) {
    this.filter.emit({
      field,
      value,
      partial,
      type
    });
  }

  handleChange(field, value, type, id) {
    this.editCell.emit({
      field,
      value,
      type,
      id
    });
  }

  getValue(row, field, type) {
    if (row && row[field]) {
      const value = row[field];
      if (type === 'currency') {
        return Number(value).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
      }
      return value;
    }
    return '';
  }

  handleCurrencyBlur(field, value, id) {
    const newValue = Number(this.utils.convertCurrencyToNumber(value)).toLocaleString('en-US', {
      style: 'currency', currency: 'USD'
    });
    this.gridForm.get(`grid.${field}_${id}`).setValue(newValue);
  }

  trackByFn(index, item) {
    return (item.id);
  }
}
