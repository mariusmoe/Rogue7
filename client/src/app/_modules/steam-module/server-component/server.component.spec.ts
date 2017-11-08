import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ARKComponent } from './ark.component';

describe('ARKComponent', () => {
  let component: ARKComponent;
  let fixture: ComponentFixture<ARKComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ARKComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ARKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
