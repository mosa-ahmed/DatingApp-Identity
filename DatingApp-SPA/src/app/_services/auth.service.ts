import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
baseUrl = environment.apiUrl + 'auth/';
jwtHelper = new JwtHelperService();
decodedToken: any;
currentUser: User;
photoUrl = new BehaviorSubject<string>('../../assets/user.png');
currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  changeMemberPhoto(photoUrl: string){
    this.photoUrl.next(photoUrl);
  }

  // tslint:disable-next-line: typedef
  login(model: any){
    return this.http.post(this.baseUrl + 'login', model)
    .pipe(
      map((response: any) => {
        const user = response;
        if ( user ){
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }
  // tslint:disable-next-line: typedef
  register(user: User){
    return this.http.post(this.baseUrl + 'register', user);
  }
  // tslint:disable-next-line: typedef
  loggedIn(){
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;
        // and we don't want to continue check as soon as we found a match so we will return out of this foreach
        return;
      }
    });
    return isMatch;
  }

}