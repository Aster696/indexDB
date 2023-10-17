import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate,  Router, RouterStateSnapshot } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private message: NzMessageService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('iyc_user_token')) {
      return true; // Authentication is successful, allow access to the route
    } else {
      this.message.info('Please login')
      this.router.navigate(['/authentication/login']); // Navigate to the login route if authentication fails
      return false; // Prevent access to the route
    }
  }
}
