import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCKEditor]',
})
export class CKeditorDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
