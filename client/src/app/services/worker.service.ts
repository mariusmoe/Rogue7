import { Injectable, NgZone } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { environment } from '@env';

import { interval } from 'rxjs/observable/interval';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class WorkerService {

  // TODO: UNDERSTAND THIS!!

  constructor(
    private updates: SwUpdate,
    private ngZone: NgZone,
    private snackBar: MatSnackBar) {

    if (!environment.production) { return; }


    // TODO: revert this back
    // interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());
    ngZone.runOutsideAngular(() => {
      interval(6 * 60 * 60).subscribe(() => {
        this.ngZone.run(() => this.updates.checkForUpdate());
      });
    });

    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      this.openSnackBar(updates);
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }

  /**
   * Opens a snackbar with the given message and action message
   * @param  {string} message The message that is to be displayed
   * @param  {string} action  the action message that is to be displayed
   */
  private openSnackBar(updates: SwUpdate) {
    this.snackBar.open('An update is available!', 'Update', {
      duration: 1000 * 60 * 2, // 2 mins
    }).onAction().subscribe(event => {
      updates.activateUpdate().then(() => document.location.reload());
    });
  }
}
