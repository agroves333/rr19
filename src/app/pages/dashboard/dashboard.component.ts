import { Component, OnDestroy, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ProjectStore } from '../../store/project/project.store';
import { Project } from '../../interfaces/project.interface';
import { AlertService } from '../../services/alert/alert.service';
import { UtilityService } from '../../services/utility/utility.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  projects: Project[];
  totalProjects: number;
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
      type: 'currency',
      partial: true,
      editable: true
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

  constructor(private projectStore: ProjectStore, private titleService: Title, private alertService: AlertService,
              private utils: UtilityService) {
    this.titleService.setTitle('Project Dashboard');
  }

  ngOnInit() {
    this.subscriptions$.add(
      this.projectStore.state$.subscribe(state => {
        this.projects = state.projects;
      })
    );
    this.totalProjects = this.projectStore.projects.length;
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  filterProjects(filter?) {
    this.projectStore.filterProjects(filter);
  }

  updateProject({field, value, type, id}) {
    this.projectStore.updateProject({field, value, type, id});
    const columnName = this.gridHeaders.find(header => header.field === field).name;
    this.alertService.alert(`Project ${id} ${columnName} Updated`);
  }
}
