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
    try {
      if (projectFilter) {
        if (projectFilter.value) {
          this.filters[projectFilter.field] = projectFilter.value;
        } else {
          delete this.filters[projectFilter.field];
        }
      }

      let projects: Observable<Project[]>;

      if (Object.keys(this.filters).length) {
        projects = this.db.projects
          .where(this.filters)
          .toArray();
      } else {
        projects = this.db.projects
          .toCollection()
          .toArray();
      }

      return from<Observable<Project[]>>(projects);
    } catch (err) {
      console.log(err);
    }
  }
}
