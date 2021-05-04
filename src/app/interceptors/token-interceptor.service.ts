// Al parecer los interceptores no funcionan con fetch solo con peticiones http

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class TokenInterceptorService implements HttpInterceptor {
  constructor() { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Paso por las armas del interceptor de token");
    return next.handle(req);
    // throw new Error('Method not implemented.');
  }
}
