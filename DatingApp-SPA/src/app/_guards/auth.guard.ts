import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from '../_services/auth.service';
import {AlertifyService} from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService){}

  canActivate(next: ActivatedRouteSnapshot): boolean {

    // To get access to chiled routes, we use firstChild
    const roles = next.firstChild.data.roles as Array<string>;
    // tslint:disable-next-line: max-line-length
    // so if sb is trying to activate the admin route, then this const of roles will be populated with the roles array that we specified in that data attribute property in the routes.ys file

    if (roles) {
      const match = this.authService.roleMatch(roles);
      if (match) {
        return true;
      }
      else{
        this.router.navigate(['members']);
        this.alertify.error('You are not authorized to access this area');
      }
    }

    // tslint:disable-next-line: max-line-length
    // and we keep the rest as the same because if dont have any roles we still want to check to see if they are authenticated for the areas that we are protecting with this AuthGuard

    if (this.authService.loggedIn()) {
     return true;
   }
    this.alertify.error('You shall not pass!!!');
    this.router.navigate(['/home']);
    return false;
  }
}
