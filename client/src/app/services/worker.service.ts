import { SwUpdate } from '@angular/service-worker';

import { environment } from '@env';

import { interval } from 'rxjs/observable/interval';


export class WorkerService {

  // TODO: UNDERSTAND THIS!!

  constructor(updates: SwUpdate) {
    if (!environment.production) { return; }

    interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());

    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      if (true) {
        updates.activateUpdate().then(() => document.location.reload());
      }
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }
}
