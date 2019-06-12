import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import data from '../../../mocks/projects.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public db;

  constructor() {
  }

  init() {
    this.db = new Dexie('rr19');

    // Declare tables, IDs and indexes
    this.db.version(1).stores({
      projects: '++id, title, division, product_owner, budget, status, created, modified'
    });

    // Open DB
    this.db.open().catch(err => {
      console.error (err.stack || err);
    });

    this.db.projects.count(count => {
      if (count === 0) {
        this.seed();
      }
    });
  }

  seed() {
    data.forEach(project => {
      this.db.projects.add(project)
        .then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err);
      });
    });
  }
}

