import { Injectable } from '@angular/core';
import moment from 'moment';
import { Project } from '../../interfaces/project.interface';
import mockData from '../../../mocks/projects.json';
import { Store } from '../store';
import { ProjectState } from './project.state';
import { UtilityService } from '../../services/utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStore extends Store<ProjectState> {

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

  seedProjects() {
    const serializedProjects = localStorage.getItem('projects');
    if (serializedProjects) {
      return JSON.parse(serializedProjects);
    }
    return mockData.map((project, id) => {
      return {
        ...project,
        id,
        created: moment(project.created, 'MM/DD/YYYY').format('YYYY-MM-DD'),
        modified: moment(project.modified, 'MM/DD/YYYY').format('YYYY-MM-DD')
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
