import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {ProjectService} from '../../services/project.service';
import { Project } from '../../models/project.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  projects: Project[];
  gridHeaders = [
    'Title',
    'Division',
    'Project Owner',
    'Budget',
    'Status',
    'Create Date',
    'Modified Data'
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
