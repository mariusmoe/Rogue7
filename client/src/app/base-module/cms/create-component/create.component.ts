import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CMSService } from '../../../_services/cms.service';
import { AuthService } from '../../../_services/auth.service';

import { CmsContent } from '../../../_models/cms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-create-component',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  contentForm: FormGroup;
  accessChoices: string[] = ['everyone', 'user'];
  inputContent: CmsContent;


  disallowedRoutes(contentList: BehaviorSubject<CmsContent[]>) {
    return (control: AbstractControl): { [key: string]: any} => {
      const list = contentList.getValue();
      if (list && list.some( (content) => content.route === control.value )) {
        return { routeAlreadyTaken: true };
      }
    };
  }


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public cmsService: CMSService,
    public authService: AuthService) {

    this.contentForm = fb.group({
      'route': ['', this.disallowedRoutes(cmsService.getContentList())],
      'title': ['', Validators.required],
      'access': ['everyone', Validators.required],
      'content': ['', Validators.required]
    });
    const param = route.snapshot.params['route'];
    if (param) {
      this.cmsService.requestContent(param).subscribe(
        data => {
          this.inputContent = data;
          this.contentForm.controls['route'].disable();
          this.contentForm.controls['route'].setValue(data.route);
          this.contentForm.controls['title'].setValue(data.title);
          this.contentForm.controls['access'].setValue(data.access);
          this.contentForm.controls['content'].setValue(data.content);
        },
        err => {
          router.navigate(['/admin']);
        },
      );
    }
   }

  ngOnInit() {
    this.authService.getUser().takeUntil(this.ngUnsubscribe).subscribe( user => {
      // sub.unsubscribe();
      if (user && user.role === 'admin') {
        this.accessChoices.push('admin');
        return;
      }
    });
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submitForm() {
    const content: CmsContent = this.contentForm.value;
    if (this.inputContent) {
      // disabled fields do not deliver content on the .value, so we'll manually add it back.
      content.route = this.inputContent.route;
      this.onSubmit(this.cmsService.updateContent(content.route, content), content.route);
      return;
    }
    this.onSubmit(this.cmsService.createContent(content), content.route);
  }

  private onSubmit(obs: Observable<CmsContent>, redirect: string) {
    const sub = obs.subscribe(
      newContent => {
        sub.unsubscribe();
        if (newContent) {
          this.cmsService.getContentList(true);
          this.router.navigate([redirect]);
          return;
        }
      },
      error => {
        sub.unsubscribe();
      },
    );
  }
}
