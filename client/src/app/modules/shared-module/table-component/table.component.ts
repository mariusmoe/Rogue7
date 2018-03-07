import { Component, ViewChild, Input, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { ColumnSettings, ColumnType, TableSettings } from '@app/models';
import { MobileService } from '@app/services';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
	selector: 'table-component',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, AfterViewInit {
	@ViewChild(MatTable) table: MatTable<Object>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@Input() settings: TableSettings;
	@Input() set data(value: object[]) { this.Source.data = value || []; }

	public readonly ColumnType = ColumnType;

	public readonly pageSizes = [10, 25, 50, 100];
	public readonly Source = new MatTableDataSource<object>([]);
	public displayedColumns: string[];

	private readonly _ngUnsub = new Subject();
	public readonly filterForm: FormGroup;

	constructor(private fb: FormBuilder, public mobileService: MobileService) {
		// Filter form
		this.filterForm = fb.group({ filterControl: [''] });

		this.filterForm.get('filterControl').valueChanges.pipe(
			distinctUntilChanged(), takeUntil(this._ngUnsub)
			// debounceTime(20), -- cannot debounce as the filter implementation is bad.
		).subscribe(value => { this.Source.filter = value.trim().toLowerCase(); });

		// Set initial data to avoid html errors
		this.Source.data = [];
	}

	ngOnInit() {
		if (!this.settings) { throw Error('No settings'); }

		this.table.trackBy = this.settings.trackBy;


		this.mobileService.isMobile().subscribe(isMobile => {
			if (isMobile) {
				this.displayedColumns = this.settings.mobile;
			} else {
				this.displayedColumns = this.settings.columns.map(col => col.property);
			}
		});
	}

	ngAfterViewInit() {
		// These must be placed here; the view must've been initialized.
		this.Source.paginator = this.paginator;
		this.Source.sort = this.sort;
	}
}


