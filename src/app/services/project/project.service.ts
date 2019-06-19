import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import moment from 'moment';
import {Project} from '../../interfaces/project.interface';
import {UtilityService} from '../utility/utility.service';
import {Store} from '../../interfaces/store.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  filters = {};
  totalProjects = 0;
  totalBudget = 0;
  statusCounts: any;

  private initialStore: Store = {
    projects: []
  };
  private projects = new BehaviorSubject<Store>(this.initialStore);

  constructor(private utils: UtilityService) {

  }

  getProjects(projectFilter?) {
    // // Initialize stats
    // this.totalProjects = 0;
    // this.totalBudget = 0;
    // this.statusCounts = {};
    //
    // if (projectFilter) {
    //   // Add filter to filter object
    //   if (projectFilter.value) {
    //     this.filters[projectFilter.field] = projectFilter.value;
    //   } else {
    //     delete this.filters[projectFilter.field];
    //   }
    // }
    // const projects = this.db.projects.filter(project => {
    //   // Calculate stats
    //   this.totalProjects++;
    //   this.totalBudget += Number(project.budget);
    //   if (typeof this.statusCounts[project.status] === 'undefined') {
    //     this.statusCounts[project.status] = 1;
    //   } else {
    //     this.statusCounts[project.status]++;
    //   }
    //
    //   const include = Object.keys(this.filters).reduce((acc, key) => {
    //
    //     if (projectFilter.partial) {
    //       // Handle full text search for text inputs
    //       const partial = new RegExp(this.filters[key], 'i');
    //       acc = acc && partial.test(project[key]);
    //     } else if (projectFilter.type === 'date') {
    //       // Handle date ranges
    //       const isFromDate = /_from$/i.test(key);
    //       const isToDate = /_to$/i.test(key);
    //
    //       if (isFromDate || isToDate) {
    //         const dateKey = key.replace(/_(to|from)$/ig, '');
    //         const filterDate = moment(this.filters[key], 'MM/DD/YYYY');
    //         const projectDate = moment(project[dateKey], 'MM/DD/YYYY');
    //         if (isFromDate) {
    //           acc = acc && filterDate.isSameOrAfter(projectDate);
    //         } else if (isToDate) {
    //           acc = acc && filterDate.isSameOrBefore(projectDate);
    //         }
    //         console.log(dateKey);
    //       }
    //     } else {
    //       // Handle non-partial text searches
    //       acc = acc && this.filters[key] === project[key];
    //     }
    //     return acc;
    //   }, true);
    //   return include;
    // }).toArray();
    // return from<Observable<Project[]>>(projects);
  }

  updateProject(project) {
    // return from(this.db.projects.update(project.id, project));
  }

  getStats() {
    return {
      totalProjects: this.totalProjects,
      totalBudget: this.utils.getCurrencyValue(this.totalBudget),
      statusCounts: this.statusCounts
    };
  }
}
