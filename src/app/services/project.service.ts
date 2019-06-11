import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, from } from 'rxjs';
import {Project} from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  filters = {};
  db;
  constructor(private data: DataService) {
    this.db = this.data.db;
  }

  getProjects(projectFilter?): Observable<Project[]> {
    if (projectFilter) {
      if (projectFilter.value) {
        this.filters[projectFilter.field] = projectFilter.value;
      } else {
        delete this.filters[projectFilter.field];
      }
    }

    const projects = this.db.projects.filter(project => {
      const include = Object.keys(this.filters).reduce((acc, key) => {
        if (projectFilter.partial) {
          const partial = new RegExp(this.filters[key], 'i');
          acc = acc && partial.test(project[key]);
        } else {
          acc = acc && this.filters[key] === project[key];
        }
        return acc;
      }, true);

      return include;
    }).toArray();

    return from<Observable<Project[]>>(projects);
  }

  updateProject(project) {
    return from(this.db.projects.update(project.id, {
      [project.field]: project.value
    }));
  }
}
