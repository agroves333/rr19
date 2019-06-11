import { Component, OnInit, AfterViewInit, OnDestroy, Input, QueryList, ViewChildren} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data;
  @Input() headers: string[];
  @ViewChildren('filter') filters: QueryList<any>;
  private subscriptions = new Subscription();

  constructor() {
  }

  ngAfterViewInit() {
    this.filters.forEach(filter => {
      const filter$ = fromEvent(filter.nativeElement, 'keyup')
        .pipe(
          map(x => x.currentTarget.value),
          debounceTime(1000)
        );
      this.subscriptions.add(filter$.subscribe(x => {
        console.log(x);
      }));
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
