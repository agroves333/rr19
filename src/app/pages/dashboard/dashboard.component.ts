import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {ProjectService} from '../../services/project.service';
import { Project } from '../../interfaces/project.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  projects: Project[];
  gridHeaders = [
    {
      name: 'Title',
      field: 'title',
      partial: true,
    },
    {
      name: 'Division',
      field: 'division',
      partial: true,
    },
    {
      name: 'Project Owner',
      field: 'project_owner',
      partial: true,
    },
    {
      name: 'Budget',
      field: 'budget',
      partial: true,
    },
    {
      name: 'Status',
      field: 'status',
      partial: true,
    },
    {
      name: 'Create Date',
      field: 'created',
      type: 'date',
    },
    {
      name: 'Modified Data',
      field: 'modified',
      type: 'date',
    },
  ];
  private projectsSubscription$: Subscription = new Subscription();

  constructor(private projectService: ProjectService, private titleService: Title) {
    this.titleService.setTitle('Project Dashboard');
  }

  ngOnInit() {
    this.getProjects();
  }

  ngOnDestroy(): void {
    this.projectsSubscription$.unsubscribe();
  }

  getProjects(filter?) {
    this.projectsSubscription$.add(
      this.projectService.getProjects(filter)
      .subscribe(projects => {
        this.projects = projects;
      })
    );
  }
}
