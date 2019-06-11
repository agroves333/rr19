import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Project } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  filters = {};

  constructor(private http: HttpClient) {}

  getProjects(projectFilter?) {
    if (projectFilter) {
      const filterKey = `${projectFilter.field}${projectFilter.partial && '_like'}`;
      if (projectFilter.value) {
        this.filters[filterKey] = projectFilter.value;
      } else {
        delete this.filters[filterKey];
      }
    }

    return this.http.get<Project[]>(`${environment.apiUrl}/projects`, {
      params: this.filters
    });
  }
}
