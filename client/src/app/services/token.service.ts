import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class TokenService {

  private _platformID: Object;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this._platformID = platformId;
  }


  get token(): string {
    if (isPlatformBrowser(this._platformID)) {
      return localStorage.getItem('token');
    }
    return '';
  }

  set token(newToken: string) {
    if (isPlatformBrowser(this._platformID)) {
      if (newToken) {
        localStorage.setItem('token', newToken);
        return;
      }
      localStorage.removeItem('token');
    }
  }
}
