import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// required for this specific test
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';


import { AdminComponent } from './admin.component';


describe('AdminComponent', () => {
	let component: AdminComponent;
	let fixture: ComponentFixture<AdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AdminComponent],
			imports: [
				BrowserAnimationsModule,
				ReactiveFormsModule,
				RouterTestingModule,
				HttpClientModule
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
