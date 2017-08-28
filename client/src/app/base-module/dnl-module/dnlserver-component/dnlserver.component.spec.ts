/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    const dnlServiceStub = {
      queryGameServer(): Observable<{ message: string; serverState?: GameDig; state: GameDigStates }> {
        const serviceState = component.state;
        switch (<GameDigStates>serviceState) {
          case GameDigStates.TimedOut:
            return Observable.of({
              'message': 'Request timed out',
              'state': GameDigStates.TimedOut
            });
          case GameDigStates.Success:
            return Observable.of({
              'message': 'Server is online',
              'state': GameDigStates.Success,
              'serverState': successServerState
            });
          case GameDigStates.Error:
            return Observable.of({
              'message': 'Error! Some error!',
              'state': GameDigStates.Error,
            });
          default: // happens for state: Loading. We can ignore this one.
            return Observable.of({});
        }
      }
    };
    TestBed.configureTestingModule({
      declarations: [ DNLServerComponent ],
      imports: [
        MaterialModule,
        RouterTestingModule,
        DateFnsModule,
        HttpModule,
        BrowserAnimationsModule
      ],
      providers: [ { provide: DNLService, useValue: dnlServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DNLServerComponent);
    component = fixture.componentInstance;
    dnlService = TestBed.get(DNLService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading when state = Loading', () => {
    fixture.detectChanges();
    component.state = GameDigStates.Loading;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('md-progress-bar.loading'));
    expect(de).toBeDefined();
    el = de.nativeElement;
    expect(el).toBeDefined();
  });

  it('should show dnlData when state = Success', () => {
    component.state = GameDigStates.Success;
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('.gameData'));
    expect(de).toBeDefined();
    el = de.nativeElement;
    expect(el).toBeDefined();
    de = fixture.debugElement.query(By.css('.gameDataTable'));
    expect(de).toBeDefined();
    el = de.nativeElement;
    expect(el).toBeDefined();
    de = fixture.debugElement.query(By.css('.playerName'));
    expect(de).toBeDefined();
    el = de.nativeElement;
    expect(el).toBeDefined();
    expect(el.innerText).toEqual(successServerState.players[0].name);
  });


  it('should show timedOut when state = TimedOut', () => {
    component.state = GameDigStates.TimedOut;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('.serverStatus.timedOut'));
    expect(de).toBeDefined();
    el = de.nativeElement;
    expect(el).toBeDefined();
  });


  it('should show offline when state = Error', () => {
    component.state = GameDigStates.Error;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('.serverStatus.offline'));
    expect(de).toBeDefined();
    el = de.nativeElement;
    expect(el).toBeDefined();
    de = fixture.debugElement.query(By.css('.error'));
    expect(de).toBeDefined();
    el = de.nativeElement;
    expect(el).toBeDefined();
  });

});


const successServerState: GameDig = {
      'name': 'someName',
      'map': 'someMap',
      'password': true,
      'raw': {
          'protocol': 0,
          'folder': 'someFolder',
          'game': 'someGame',
          'steamappid': 0,
          'numplayers': 3,
          'numbots': 0,
          'listentype': 'd',
          'environment': 'w',
          'secure': 1,
          'version': '1.0.0.0',
          'port': 7777,
          'steamid': '99999999999999999',
          'tags': ',comma=yay,separated=awesome,tags=magnificent',
          'gameid': '999999',
          'rules': {
              'BuildId_s': '100',
              'CUSTOMSERVERNAME_s': 'someServer',
              'DayTime_s': '00:00',
              'GameMode_s': 'someMode',
              'MATCHTIMEOUT_f': '000.000000',
              'MINORBUILDID_s': '1000',
              'ModId_l': '0',
              'Networking_i': '0',
              'NUMOPENPUBCONN': '20',
              'OFFICIALSERVER_i': '0',
              'OWNINGID': '99999999999999999',
              'OWNINGNAME': '99999999999999999',
              'P2PADDR': '99999999999999999',
              'P2PPORT': '7777',
              'SEARCHKEYWORDS_s': 'Custom',
              'ServerPassword_b': 'true',
              'SERVERUSESBATTLEYE_b': 'false',
              'SESSIONFLAGS': '683'
          }
      },
      'maxplayers': 20,
      'players': [
          {
              'name': 'somePlayer',
              'score': 0,
              'time': 100
          },
          {
              'name': 'someOtherPlayer',
              'score': 0,
              'time': 1000
          },
          {
              'name': 'someThirdPlayer',
              'score': 0,
              'time': 1000000
          }
      ],
      'bots': <any>[],
      'query': {
          'host': '000.000.000.0',
          'address': '000.000.000.0',
          'port': 0,
          'port_query': 0,
          'type': 'someType',
          'pretty': 'somePretty'
      }
};
