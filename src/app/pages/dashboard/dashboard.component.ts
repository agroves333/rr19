import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import moment from 'moment';
import {ProjectService} from '../../services/project/project.service';
import { Project } from '../../interfaces/project.interface';
import {AlertService} from '../../services/alert/alert.service';
import {UtilityService} from '../../services/utility/utility.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  projects: Project[];
  totalProjects = 0;
  totalBudget;
  statusCounts = {};
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
      type: 'text',
      partial: true,
      editable: true,
    },
    {
      name: 'Division',
      field: 'division',
      type: 'text',
      partial: true,
      editable: true,
    },
    {
      name: 'Project Owner',
      field: 'project_owner',
      type: 'text',
      partial: true,
      editable: true,
    },
    {
      name: 'Budget',
      field: 'budget',
      type: 'text',
      partial: true,
      editable: true,
      format: 'currency'
    },
    {
      name: 'Status',
      field: 'status',
      partial: true,
      editable: true,
      type: 'select',
      options: {
        new: 'New',
        working: 'Working',
        delivered: 'Delivered',
        archived: 'Archived'
      }
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
  private subscriptions$: Subscription = new Subscription();

  constructor(private projectService: ProjectService, private titleService: Title, private alertService: AlertService,
              private utils: UtilityService) {
    this.titleService.setTitle('Project Dashboard');
  }

  ngOnInit() {
    this.getProjects();
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  getProjects(filter?) {
    this.subscriptions$.add(
      this.projectService.getProjects(filter)
      .subscribe(projects => {
        this.projects = projects;
        this.getStats();
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
    this.subscriptions$.add(
      this.projectService.updateProject(project)
        .subscribe(success => {
          if (success) {
            this.getStats();
            this.alertService.alert('success', `Project ${project.id} Updated`);
          }
        })
    );
  }

  getStats() {
    const stats = this.projectService.getStats();
    this.totalProjects = stats.totalProjects;
    this.totalBudget = stats.totalBudget;
    this.statusCounts = stats.statusCounts;
  }
}
