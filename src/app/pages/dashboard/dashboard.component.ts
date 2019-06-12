import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {ProjectService} from '../../services/project/project.service';
import { Project } from '../../interfaces/project.interface';
import {AlertService} from '../../services/alert/alert.service';
import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  projects: Project[];
  totalProjects = 0;
  totalBudget;
  gridHeaders = [
    {
      name: 'Actions',
      type: 'actions',
      components: {
        view: {
          component: 'button',
          link: '/project/:id',
          text: 'View'
        }
      }
    },
    {
      name: 'Project ID',
      field: 'id',
      type: 'number',
      partial: true,
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
      format: 'currency'
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
      name: 'Modified Date',
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
        this.totalProjects = this.projectService.totalProjects;
        this.totalBudget = this.getCurrencyValue(this.projectService.totalBudget);
        this.projects = projects;
      })
    );
  }

  updateProject(data) {
    const project = {...data.row, [data.field]: data.value};
    project.modified = moment().format('MM/DD/YYYY');
    // Update modified cell
    this.projects.forEach(row => {
      if (row.id === data.id) {
        row.modified = project.modified;
      }
    });
    this.projectsSubscription$.add(
      this.projectService.updateProject(project)
        .subscribe(success => {
          if (success) {
            this.alertService.alert('success', `Project ${project.id} Updated`);
          }
        })
    );
  }

  getCurrencyValue(value) {
    return Number(value).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
  }
}
