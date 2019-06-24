import { Injectable, OnDestroy } from '@angular/core';
import moment from 'moment';
import { Store } from '../store';
import { Project } from '../../interfaces/project.interface';
import { ProjectState } from './project.state';
import mockData from '../../../mocks/projects.json';
import {UtilityService} from '../../services/utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStore extends Store<ProjectState> implements OnDestroy {

  constructor(public utils: UtilityService) {
    super(new ProjectState());
    this.setState({
      ...this.state,
      projects: this.seedProjects()
    });

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('projects', JSON.stringify(this.state.projects));
    });
  }

  ngOnDestroy() {
    // Persist projects when refreshed
    localStorage.setItem('projects', JSON.stringify(this.state.projects));
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

  patchProject({field, value, type, id}): void {
    if (type === 'currency') {
      value = this.utils.convertCurrencyToNumber(value);
    }

    this.setState({
      ...this.state,
      projects: this.state.projects.map<any>(p => {
        if (id === p.id) {
          return {
            ...p,
            [field]: value,
            modified: moment().format('YYYY-MM-DD'),
          };
        }
        return p;
      })
    });
  }
}
