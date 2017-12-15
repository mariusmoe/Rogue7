import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CmsContent } from '@app/models';
import { CMSService } from '@app/services';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  @Input() term = '';
  form: FormGroup;

  constructor(
    private cmsService: CMSService,
    private fb: FormBuilder,
    private router: Router) {
      this.form = this.fb.group({ 'search': [''] });
  }

  ngOnInit() {
    this.form.get('search').setValue(this.term);
  }

  /**
   * Perform a search and navigate to the search page
   */
  search() {
    this.router.navigateByUrl('/search/' + this.form.get('search').value);
    // this.form.get('search').setValue('');
  }

  /**
   * Clears the search result
   */
  clear() {
    this.form.get('search').setValue('');
  }

}
