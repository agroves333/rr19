import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {GridComponent} from '../../components/grid/grid.component';

@NgModule({
  declarations: [
    DashboardComponent,
    GridComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {
}
