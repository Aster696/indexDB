import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http'; // Import HttpResponse
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class OfflineApiInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(caches.open('api')).pipe(
      catchError(() => of(undefined)),
      switchMap((cache) => {
        if (!cache) {
          return next.handle(request);
        }

        // Create a new Request object with the URL of the original request
        const cachedRequest = new Request(request.url);

        return from(cache.match(cachedRequest)).pipe(
          catchError(() => of(undefined)),
          switchMap((response) => {
            if (response) {
              return of(new HttpResponse({ body: response }));
            }
            return next.handle(request);
          })
        );
      })
    );
  }
}
