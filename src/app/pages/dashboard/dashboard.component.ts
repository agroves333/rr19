import {Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {Title} from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import moment from 'moment';
import { ProjectStore } from '../../store/project/project.store';
import { Project } from '../../interfaces/project.interface';
import {AlertService} from '../../services/alert/alert.service';
import {UtilityService} from '../../services/utility/utility.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  projects: Observable<Project[]>;
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
  filters: any = {};
  private subscriptions$: Subscription = new Subscription();

  constructor(private projectStore: ProjectStore, private titleService: Title, private alertService: AlertService,
              private utils: UtilityService, private cd: ChangeDetectorRef) {
    this.titleService.setTitle('Project Dashboard');
  }

  ngOnInit() {
    this.getProjects();
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  getProjects(projectFilter?) {
    if (projectFilter) {
      // Add filter to filter object
      if (projectFilter.value) {
        this.filters[projectFilter.field] = {
          value: projectFilter.value,
          partial: projectFilter.partial,
          type: projectFilter.type
        };
      } else {
        delete this.filters[projectFilter.field];
      }
    }

    this.projects = this.projectStore.state$.pipe(
      map(state => state.projects),
      filter(project => {
        const include = Object.keys(this.filters).reduce((acc, key) => {
          if (this.filters[key].partial) {
            // Handle full text search for text inputs
            const partial = new RegExp(this.filters[key].value, 'i');
            acc = acc && partial.test(project[key]);
          } else if (this.filters.type === 'date') {
            // Handle date ranges
            const isFromDate = /_from$/i.test(key);
            const isToDate = /_to$/i.test(key);

            if (isFromDate || isToDate) {
              const dateKey = key.replace(/_(to|from)$/ig, '');
              const filterDate = moment(this.filters[key], 'MM/DD/YYYY');
              const projectDate = moment(project[dateKey], 'MM/DD/YYYY');
              if (isFromDate) {
                acc = acc && filterDate.isSameOrAfter(projectDate);
              } else if (isToDate) {
                acc = acc && filterDate.isSameOrBefore(projectDate);
              }
              console.log(dateKey);
            }
          } else {
            // Handle non-partial text searches
            acc = acc && this.filters[key].value === project[key];
          }
          return acc;
        }, true);
        return include;
      })
    );
  }

  patchProject({field, value, type, id}) {
    this.projectStore.patchProject({field, value, type, id});
    this.cd.markForCheck();
  }

  getStats() {
    // const stats = this.projectService.getStats();
    // this.totalProjects = stats.totalProjects;
    // this.totalBudget = stats.totalBudget;
    // this.statusCounts = stats.statusCounts;
  }
}
