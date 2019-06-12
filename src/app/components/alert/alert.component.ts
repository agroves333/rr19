import { Component } from '@angular/core';
import {AlertService} from '../../services/alert/alert.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        top: '-5px',
        opacity: 1,
      })),
      state('closed', style({
        top: '-100px',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class AlertComponent {

  constructor(private alertService: AlertService) { }
}
