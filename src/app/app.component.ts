import { Component, OnInit, ViewChild } from '@angular/core';
import {DataService} from './services/data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('alert', {static: false}) alert;

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.init();
  }
}
