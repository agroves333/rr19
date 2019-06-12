import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {ProjectService} from '../../services/project/project.service';
import { Project } from '../../interfaces/project.interface';
import {AlertService} from '../../services/alert/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  projects: Project[];
  gridHeaders = [
    {
      name: 'Project ID',
      field: 'id',
      editable: false
    },
    {
      name: 'Title',
      field: 'title',
      partial: true,
      editable: true,
    },
    {
      name: 'Division',
      field: 'division',
      partial: true,
      editable: true,
    },
    {
      name: 'Project Owner',
      field: 'project_owner',
      partial: true,
      editable: true,
    },
    {
      name: 'Budget',
      field: 'budget',
      partial: true,
      editable: true,
    },
    {
      name: 'Status',
      field: 'status',
      partial: true,
      editable: true,
    },
    {
      name: 'Create Date',
      field: 'created',
      type: 'date',
      editable: true,
    },
    {
      name: 'Modified Data',
      field: 'modified',
      type: 'date',
      editable: true,
    },
  ];
  private projectsSubscription$: Subscription = new Subscription();

  constructor(private projectService: ProjectService, private titleService: Title, private alertService: AlertService) {
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

  updateProject(project) {
    this.projectService.updateProject(project)
      .subscribe(success => {
        if (success) {
          this.alertService.open(`Project ${project.id} Updated`);
        }
      });
  }
}
