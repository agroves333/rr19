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
import { Subscription, fromEvent } from 'rxjs';
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
  @ViewChildren('filter') filters: QueryList<any>;
  @Output() filter: EventEmitter<any> = new EventEmitter();
  private subscriptions = new Subscription();

  constructor() {
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
              field: el && el.dataset && el.dataset.field,
              partial: el && el.dataset && el.dataset.partial
            };
          }),
          debounceTime(1000)
        );
      this.subscriptions.add(filter$.subscribe(x => {
        this.filter.emit(x);
      }));
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onDateSelect(event) {
    console.log(event);
  }
}
