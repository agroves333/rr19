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
      field: 'title'
    },
    {
      name: 'Division',
      field: 'division'
    },
    {
      name: 'Project Owner',
      field: 'project_owner'
    },
    {
      name: 'Budget',
      field: 'budget'
    },
    {
      name: 'Status',
      field: 'status'
    },
    {
      name: 'Create Date',
      field: 'created'
    },
    {
      name: 'Modified Data',
      field: 'modified'
    },
  ];
  private projectsSubcription$: Subscription;

  constructor(private projectService: ProjectService, private titleService: Title) {
    this.titleService.setTitle('Project Dashboard');
  }

  ngOnInit() {
    this.projectsSubcription$ = this.projectService.getProjects()
      .subscribe(projects => {
        this.projects = projects;
      });
  }

  ngOnDestroy(): void {
    this.projectsSubcription$.unsubscribe();
  }
}
