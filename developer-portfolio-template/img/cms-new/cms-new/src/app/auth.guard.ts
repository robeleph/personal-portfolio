import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public ds: DataService, public router: Router) {}

  canActivate(): boolean{
    if (!this.ds.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}