import { Injectable, OnDestroy } from '@angular/core';
import Dexie from 'dexie';
import { Subscription, from } from 'rxjs';
import data from '../../../mocks/projects.json';
import {AlertService} from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {

  public db = null;
  private subscriptions$: Subscription = new Subscription();

  constructor(private alertService: AlertService) {
    if (!this.db) {
      this.subscriptions$.add(
        this.init().subscribe(count => {
          if (count === 0) {
            this.seed();
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
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

    return from(this.db.projects.count());
  }

  seed() {
    data.forEach(project => {
      this.db.projects.add(project);
    });
    this.alertService.alert('success', `Database Seeded`);
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
}

