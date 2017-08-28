import { Component } from '@angular/core';

@Component({
  selector: 'app-base-component',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
    public nav;

    constructor() {
      this.nav = [
        { 'name': 'DNL Server', 'url': '/dnl' },
        // { 'name': 'bob', 'url': '/bob' },
      ];
    }
}
