import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMSNewComponent } from './cms-new.component';

describe('CMSNewComponent', () => {
  let component: CMSNewComponent;
  let fixture: ComponentFixture<CMSNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMSNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
