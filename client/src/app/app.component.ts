import { Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'root',
	template: `<router-outlet></router-outlet>`,
	encapsulation: ViewEncapsulation.None
})
export class AppComponent { }
