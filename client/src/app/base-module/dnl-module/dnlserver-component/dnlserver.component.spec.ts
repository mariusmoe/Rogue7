/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// required for this specific test
import { MaterialModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { DateFnsModule } from 'ngx-date-fns';

import { DNLService } from '../../../_services/dnl.service';
import { HttpModule } from '@angular/http';
import { GameDig, GameDigStates } from './../../../_models/gamedig';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/timeout';
import { interval } from 'rxjs/Observable/interval';

import { DNLServerComponent } from './dnlserver.component';

describe('DNLServerComponent', () => {
  let component: DNLServerComponent;
  let fixture: ComponentFixture<DNLServerComponent>;
  let dnlService: DNLService;

  beforeEach(async(() => {
    const dnlServiceStub = {
      queryGameServer(): Observable<{ message: string; serverState?: GameDig; state: GameDigStates }> {
        const obs = Observable.of({
          'message': 'Request timed out',
          'timedOut': true,
          'state': GameDigStates.TimedOut
        });
        return obs;
      }
    };
    TestBed.configureTestingModule({
      declarations: [ DNLServerComponent ],
      imports: [
        MaterialModule,
        RouterTestingModule,
        DateFnsModule,
        HttpModule
      ],
      providers: [ { provide: DNLService, useValue: dnlServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DNLServerComponent);
    component = fixture.componentInstance;
    dnlService = TestBed.get(DNLService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
