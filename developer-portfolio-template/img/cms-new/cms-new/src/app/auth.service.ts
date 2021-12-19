import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwt: JwtHelperService) { }
  isAuthenticated(): boolean{
    return  !this.jwt.isTokenExpired(localStorage.getItem('id_token'));
  }
}
