import { SwUpdate } from '@angular/service-worker';

import { interval } from 'rxjs/observable/interval';

function promptUser(event): boolean {
  return true;
}

export class WorkerService {

  // TODO: UNDERSTAND THIS!!

  constructor(updates: SwUpdate) {
    interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());

    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      if (promptUser(event)) {
        updates.activateUpdate().then(() => document.location.reload());
      }
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }
}
