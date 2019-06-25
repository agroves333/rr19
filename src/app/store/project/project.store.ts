import { Injectable } from '@angular/core';
import moment from 'moment';
import { map } from 'rxjs/operators';
import { Project } from '../../interfaces/project.interface';
import mockData from '../../../mocks/projects.json';
import { Store } from '../store';
import { ProjectState } from './project.state';
import { UtilityService } from '../../services/utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStore extends Store<ProjectState> {
  filters: any = {};
  // All projects from either localstorage or json file
  projects: Project[];

  constructor(public utils: UtilityService) {
    super(new ProjectState());
    this.initialize();

    // Persist data in localstorage on browser refresh
    window.addEventListener('beforeunload', () => {
      if (this.state.projects) {
        localStorage.setItem('projects', JSON.stringify(this.state.projects));
      }
    });
  }

  initialize() {
    const serializedProjects = localStorage.getItem('projects');

    if (serializedProjects) {
      this.projects = JSON.parse(serializedProjects);
    } else {
      this.projects = mockData.map((project, id) => {
        return {
          ...project,
          id,
          created: moment(project.created, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          modified: moment(project.modified, 'MM/DD/YYYY').format('YYYY-MM-DD')
        };
      });
    }

    let totalBudget = 0;
    const statusCounts = {};

    this.projects.forEach(project => {
      totalBudget += project.budget;

      if (typeof statusCounts[project.status] === 'undefined') {
        statusCounts[project.status] = 1;
      } else {
        statusCounts[project.status]++;
      }
    });

    this.setState({
      ...this.state,
      projects: this.projects,
      stats: {
        totalBudget,
        statusCounts
      }
    });
  }

  filterProjects(projectFilter) {
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
    let totalBudget = 0;
    const statusCounts = {};
    const projects = this.projects.filter(project => {
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

      if (include) {
        totalBudget += project.budget;

        if (typeof statusCounts[project.status] === 'undefined') {
          statusCounts[project.status] = 1;
        } else {
          statusCounts[project.status]++;
        }
      }
      return include;
    });
    this.setState({
      ...this.state,
      projects,
      stats: {
        totalBudget,
        statusCounts
      }
    });
  }

  updateProject({field, value, type, id}): void {
    if (type === 'currency') {
      value = this.utils.convertCurrencyToNumber(value);
    }

    const projects = this.state.projects.map(p => {
      if (id === p.id) {
        return {
          ...p,
          [field]: value,
          modified: moment().format('YYYY-MM-DD'),
        };
      }
      return p;
    });

    let totalBudget = 0;
    const statusCounts = {};
    this.state.projects.forEach(project => {
      totalBudget++;
      if (typeof statusCounts[project.status] === 'undefined') {
        statusCounts[project.status] = 1;
      } else {
        statusCounts[project.status]++;
      }
    });

    this.setState({
      ...this.state,
      projects,
      stats: {
        totalBudget,
        statusCounts
      }
    });
  }
}
