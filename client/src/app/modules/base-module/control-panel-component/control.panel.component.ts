import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@app/services';


@Component({
  selector: 'app-control-panel-component',
  templateUrl: './control.panel.component.html',
  styleUrls: ['./control.panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlPanelComponent {
  constructor(public authService: AuthService) {}
}
