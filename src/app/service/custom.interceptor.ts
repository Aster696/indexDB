import { ApiService } from 'src/app/service/http-service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, retry, tap, map, takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router, ActivationEnd, ActivationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  token = ''
  private pendingHTTPRequests$ = new Subject<void>();

  constructor( private message: NzMessageService, private router : Router, private httpService: ApiService, private global: GlobalService) {
    router.events.subscribe(event => {
      if (event instanceof ActivationStart) {
        // Cancel pending calls
        this.cancelPendingRequests();
      }
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let check_status;
    //  this.httpService.createOnline$().subscribe((isOnline) => {
    //    check_status = isOnline
    //    })
    //   if(!check_status) {
    //     this.message.error('Kindly check your network');  
    //   }
    if(true){
      if(!(req.url.includes("users/auth/send-otp") || req.url.includes("stockist/client-auth/verify-otp"))){
      this.token = localStorage.getItem('iyc_user_token');
      if(this.token){
        req = req.clone({
          setHeaders: {
            Authorization: `Token ${this.token}`,
          }
        });
      }
      }
      return next.handle(req)
      .pipe(
      takeUntil(this.onCancelPendingRequests()),
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if(event.body.success == false){
            this.message.error(event.body.message);
          }
        }
        return event;
      }),
      // Handle errors
      catchError((error: HttpErrorResponse) => {
        if(error.status == 400){
          this.message.error(error.error.errors ? error.error.errors : error.error.message);
        } else if (error.status == 403){
          this.message.error("You don't have permission to access this");
        } else if (error.status == 401){
          // this.router.navigate(['/authentication/login']);
          // if(JSON.parse(localStorage.getItem('biomech_user_data')).user_type.name == 'Stockists'){
            this.router.navigate(['/authentication/login']);
          // } else{
          //   this.router.navigate(['/authentication/employee-login']);
          // }
          this.message.error("Authorization failed, kindly login again");
        } else{
          // this.message.error('Something Went Wrong');
        }
        return throwError(error);
      }),
      );
    } else {
      this.message.error('Kindly check your network');  
    }
  }



  // Cancel Pending HTTP calls
  public cancelPendingRequests() {
    this.pendingHTTPRequests$.next();
  }

  public onCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }


  // intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
  //   return next.handle(req).pipe()
  // }

}
