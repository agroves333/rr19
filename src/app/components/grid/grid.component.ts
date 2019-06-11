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
import { map, debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data;
  @Input() headers: string[];
  @ViewChildren('filter') filters: QueryList<any>;
  @Output() filter: EventEmitter<any> = new EventEmitter();
  private subscriptions = new Subscription();

  constructor() {
  }

  ngAfterViewInit() {
    this.filters.forEach(filter => {
      const filter$ = fromEvent(filter.nativeElement, 'keyup')
        .pipe(
          map((e: any) => {
            const el = e.target;
            return {
              value: el.value,
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
}
