import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { AuthService } from '../../../_services/auth.service';


@Component({
  selector: 'app-control-panel-component',
  templateUrl: './control.panel.component.html',
  styleUrls: ['./control.panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class ControlPanelComponent {
  @Output() navigated: EventEmitter<boolean> = new EventEmitter();

  constructor(public authService: AuthService) {}

  /**
   * Emits upon navigation
   */
  emit(): void {
    this.navigated.emit(true);
  }
}
