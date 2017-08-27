/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// required for this specific test
import { MaterialModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';

import { GameService } from '../../../_services/game.service';
import { HttpModule } from '@angular/http';
import { GameDig } from './../../../_models/gamedig';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/timeout';
import { interval } from 'rxjs/Observable/interval';

import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameService: GameService;

  beforeEach(async(() => {
    const gameServiceStub = {
      queryGameServer(): Observable<{ message: string; serverState?: GameDig; timedOut?: boolean}> {
        const obs = Observable.of({
          'message': 'Request timed out',
          'timedOut': true,
        });
        return obs;
      }
    };
    TestBed.configureTestingModule({
      declarations: [ GameComponent ],
      imports: [
        MaterialModule,
        RouterTestingModule,
        MomentModule,
        HttpModule
      ],
      providers: [ { provide: GameService, useValue: gameServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    gameService = TestBed.get(GameService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
