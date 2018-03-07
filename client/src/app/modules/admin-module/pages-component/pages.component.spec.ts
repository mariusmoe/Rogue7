import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// required for this specific test
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';


import { PagesComponent } from './pages.component';


describe('PagesComponent', () => {
	let component: PagesComponent;
	let fixture: ComponentFixture<PagesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PagesComponent],
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
		fixture = TestBed.createComponent(PagesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
