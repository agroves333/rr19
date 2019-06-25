import { Component, OnInit } from '@angular/core';
import { ProjectStore } from '../../store/project/project.store';
import {UtilityService} from '../../services/utility/utility.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  totalProjects: number;
  totalBudget: number;
  statusCounts: any;

  constructor(private projectStore: ProjectStore, private utils: UtilityService) { }

  ngOnInit() {
    this.projectStore.state$.subscribe(state => {
      this.totalProjects = state.projects.length;
      this.totalBudget = state.stats.totalBudget;
      this.statusCounts = state.stats.statusCounts;
    });
  }
}
