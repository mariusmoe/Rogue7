import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// required for this specific test
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';


import { TableComponent } from './table.component';


describe('TableComponent', () => {
	let component: TableComponent;
	let fixture: ComponentFixture<TableComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TableComponent],
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
		fixture = TestBed.createComponent(TableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
