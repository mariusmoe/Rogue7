import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionWrapperComponent } from './sectionwrapper.component';

describe('SectionWrapperComponent', () => {
	let component: SectionWrapperComponent;
	let fixture: ComponentFixture<SectionWrapperComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SectionWrapperComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SectionWrapperComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
