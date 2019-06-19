import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription, Subject, fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import moment from 'moment';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnDestroy {

  @Input() data: any[];
  @Input() headers: any[];
  @Input() debounceTime = 1000;
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Output() editCell: EventEmitter<any> = new EventEmitter();
  private subscriptions$ = new Subscription();
  editCellKeyups$ = new Subject<Event>();
  gridForm = new FormGroup({});

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    const filterGroup = new FormGroup({});
    this.headers.map(header => {
      if (header.field) {
        filterGroup.addControl(header.field, new FormControl());
      }
    });

    this.gridForm.addControl('filters', filterGroup);

    this.editCellKeyups$
      .pipe(debounceTime(1000))
      .subscribe(data => {
        this.editCell.emit(data);
      });
  }

  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
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
}
