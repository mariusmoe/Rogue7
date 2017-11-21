import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { environment } from '@env';

import { AuthService } from '@app/services';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add JWT if the request is going to our server.
    if (!req.url.startsWith(environment.URL.base)) { return next.handle(req); }

    // Add Authorization header
    // Remember: HttpHeaders is IMMUTABLE. Using .set creates a new instance of the object.
    let headers = new HttpHeaders().set('authorization', localStorage.getItem('token') || '');
    // If the request is an API request, then add Content-Type: application/json as well.
    if (req.url.startsWith(environment.URL.api)) {
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    }
    // Send it off to the next handle
    return next.handle(req.clone({ headers: headers }));
  }
}
