import { Injectable } from '@angular/core';
import { Store } from '../store';
import { Project } from '../../interfaces/project.interface';

export class ProjectState {
  projects: Project[] = [];
}

@Injectable()
export class ProjectStore extends Store<ProjectState> {

  constructor() {
    super(new ProjectState());
  }

  getProjects(): Project[] {
    return this.state.projects;
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
