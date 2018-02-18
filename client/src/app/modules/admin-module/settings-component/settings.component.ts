import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@app/services';


@Component({
  selector: 'app-settings-component',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

  constructor(
    public authService: AuthService) {
  }
}
