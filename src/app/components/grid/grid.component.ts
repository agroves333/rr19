import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy {
  @Input() data: Observable<any[]>;
  rows: any[];
  @Input() headers: any[];
  @Input() debounceTime = 1000;
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Output() editCell: EventEmitter<any> = new EventEmitter();
  private subscriptions$ = new Subscription();
  gridForm = new FormGroup({});

  constructor() {}

  ngOnInit() {
    const filterGroup = new FormGroup({});
    this.headers.forEach(header => {
      if (header.field) {
        filterGroup.addControl(header.field, new FormControl());
      }
    });

    this.data.subscribe(rows => {
      const gridGroup = new FormGroup({});
      rows.forEach(row => {
        this.headers.forEach(header => {
          if (header.field) {
            const inputName = `${header.field}_${row.id}`;
            const defaultValue = this.getValue(row[header.field], header.type);
            const cellFormControl = new FormControl(defaultValue);
            gridGroup.addControl(inputName, cellFormControl);
          }
        });
      });
      this.rows = [...rows];
      this.gridForm.removeControl('filters');
      this.gridForm.removeControl('grid');
      this.gridForm.addControl('filters', filterGroup);
      this.gridForm.addControl('grid', gridGroup);
    });
  }

  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
  }

  updateFilters(field, value, partial, type) {
    this.gridForm.patchValue({
      filters: {
        [field]: value
      }
    });
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

  getDateValue(date) {
    return moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');
  }

  setDateValue(date) {
    return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
  }

  getValue(value, format) {
    if (format === 'currency') {
      return Number(value).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }
    return value;
  }

  trackByFn(index, item ) {
    console.log( 'TrackBy:', item.id, 'at index', index );
    return( item.id );
  }
}
