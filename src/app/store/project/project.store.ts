import { Injectable, OnDestroy } from '@angular/core';
import moment from 'moment';
import { Store } from '../store';
import { Project } from '../../interfaces/project.interface';
import { ProjectState } from './project.state';
import mockData from '../../../mocks/projects.json';

@Injectable({
  providedIn: 'root'
})
export class ProjectStore extends Store<ProjectState> implements OnDestroy {

  constructor() {
    super(new ProjectState());
    this.setState({
      ...this.state,
      projects: this.seedProjects()
    });

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('projects', JSON.stringify(this.state.projects));
    });
  }

  seedProjects() {
    const serializedProjects = localStorage.getItem('projects');
    if (serializedProjects) {
      return JSON.parse(serializedProjects);
    }
    return mockData.map((project, id) => {
      return {
        ...project,
        id
      };
    });
  }

  ngOnDestroy() {
    // Persist projects when refreshed
    localStorage.setItem('projects', JSON.stringify(this.state.projects));
  }

  getProjects(filters?): Project[] {
    return this.state.projects.filter(project => {
      const include = Object.keys(filters).reduce((acc, key) => {
        if (filters[key].partial) {
          // Handle full text search for text inputs
          const partial = new RegExp(filters[key].value, 'i');
          acc = acc && partial.test(project[key]);
        } else if (filters.type === 'date') {
          // Handle date ranges
          const isFromDate = /_from$/i.test(key);
          const isToDate = /_to$/i.test(key);

          if (isFromDate || isToDate) {
            const dateKey = key.replace(/_(to|from)$/ig, '');
            const filterDate = moment(filters[key], 'MM/DD/YYYY');
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
          acc = acc && filters[key].value === project[key];
        }
        return acc;
      }, true);
      return include;
    });
  }

  updateProject(project: Project): void {
    this.setState({
      ...this.state,
      projects: this.state.projects.map<any>(p => {
        if (project.id === p.id) {
          return {project};
        }
        return p;
      })
    });
  }
}
