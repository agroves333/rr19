import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  Input,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements AfterViewInit, OnDestroy {
  @Input() public suggestions;
  @Input() public value;
  @Input() public displayPath;
  @Output() public keyUp: EventEmitter<any> = new EventEmitter();
  @Output() public suggestionClick: EventEmitter<any> = new EventEmitter();

  private searchInput: ElementRef;

  @ViewChild('searchInput', { static: false }) set content(content: ElementRef) {
    this.searchInput = content;
  }

  private subscription: Subscription;

  constructor() {
  }

  ngAfterViewInit(): void {
    const terms$ = fromEvent<any>(this.searchInput.nativeElement.el, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''),
        debounceTime(400),
        distinctUntilChanged()
      );
    this.subscription = terms$
      .subscribe(suggestion => {
        this.keyUp.emit(suggestion);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSuggestionClick(suggestion) {
    this.suggestionClick.emit(suggestion);
    this.suggestions = [];
  }

  getDisplayValue(suggestion) {
    return this.displayPath.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, suggestion);
  }
}
