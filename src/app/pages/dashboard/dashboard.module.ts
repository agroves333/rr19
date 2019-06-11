import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {GridComponent} from '../../components/grid/grid.component';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    DashboardComponent,
    GridComponent,
    NgbDatepicker
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {
}
