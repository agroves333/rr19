import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  QueryList,
  ViewChildren,
  EventEmitter
} from '@angular/core';
import { Subscription, Subject, fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import moment from 'moment';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data: any[];
  @Input() headers: string[];
  @Input() debounceTime = 1000;
  @ViewChildren('filter') filters: QueryList<any>;
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Output() editCell: EventEmitter<any> = new EventEmitter();
  private subscriptions$ = new Subscription();
  editCellKeyups$ = new Subject<Event>();

  constructor() {
  }

  ngOnInit() {
    this.editCellKeyups$
      .pipe(debounceTime(1000))
      .subscribe(data => {
        this.editCell.emit(data);
      });
  }

  ngAfterViewInit() {
    this.filters.forEach(filter => {
      const filter$ = fromEvent(filter.nativeElement, 'input')
        .pipe(
          map((e: any) => {
            const el = e.target;
            let value = el.value;
            const type = el.type;
            if (type === 'date' && value) {
              value = moment(value, 'YYYY-MM-DD').format('MM/DD/YYYY');
            }
            return {
              value,
              type,
              field: el && el.dataset && el.dataset.field,
              partial: el && el.dataset && el.dataset.partial,
            };
          }),
          debounceTime(this.debounceTime)
        );
      this.subscriptions$.add(filter$.subscribe(x => {
        this.filter.emit(x);
      }));
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
}
