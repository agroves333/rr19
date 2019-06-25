import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { GridModule } from '../../components/grid/grid.module';
import { StatsModule } from '../../components/stats/stats.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GridModule,
    StatsModule
  ]
})
export class DashboardModule {
}
