import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, filter, take, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Add auth header if we have a token and it's not an auth endpoint
    if (this.authService.getAccessToken() && !this.isAuthEndpoint(request.url)) {
      request = this.addAuthHeader(request, this.authService.getAccessToken()!);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // If we get a 401 and it's not an auth endpoint, try to refresh token
        if (error.status === 401 && !this.isAuthEndpoint(request.url)) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/auth/login') ||
           url.includes('/auth/signup') ||
           url.includes('/auth/refresh') ||
           url.includes('/auth/logout');
  }

  private addAuthHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken);

          // Retry the original request with new token
          return next.handle(this.addAuthHeader(request, response.accessToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;

          // Refresh failed, redirect to login
          this.authService.logout().subscribe();
          this.router.navigate(['/login']);

          return throwError(() => error);
        })
      );
    } else {
      // If we're already refreshing, wait for the new token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addAuthHeader(request, token)))
      );
    }
  }
}