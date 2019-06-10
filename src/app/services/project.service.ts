import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import projects from '../../mocks/projects.json';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() {}

  getProjects() {
    return of(projects);
  }
}
