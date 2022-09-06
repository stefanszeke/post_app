import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const authToken = this.cookieService.get('token');

    const authReq = req.clone({
      headers: req.headers.append('Authorization', `bearer ${authToken}`)
    });

    return next.handle(authReq);
  }
}