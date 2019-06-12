import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { Observable, from } from 'rxjs';
import {Project} from '../../interfaces/project.interface';
import moment from 'moment';

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
      // Add filter to filter object
      if (projectFilter.value) {
        this.filters[projectFilter.field] = projectFilter.value;
      } else {
        delete this.filters[projectFilter.field];
      }
    }

    const projects = this.db.projects.filter(project => {
      const include = Object.keys(this.filters).reduce((acc, key) => {

        if (projectFilter.partial) {
          // Handle full text search for text inputs
          const partial = new RegExp(this.filters[key], 'i');
          acc = acc && partial.test(project[key]);
        } else if (projectFilter.type === 'date') {
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
          acc = acc && this.filters[key] === project[key];
        }
        return acc;
      }, true);

      return include;
    }).toArray();

    return from<Observable<Project[]>>(projects);
  }

  updateProject(project) {
    return from(this.db.projects.update(project.id, project));
  }
}