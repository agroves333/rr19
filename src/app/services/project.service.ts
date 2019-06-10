import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import * as projects from '../../mocks/projects.json';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() {}

  getProjects() {
    return from(projects);
  }
}
