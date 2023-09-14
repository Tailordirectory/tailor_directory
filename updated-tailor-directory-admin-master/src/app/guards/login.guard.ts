import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AppAuthService} from "../services/app-auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  path: any;

  constructor(
    private authService: AppAuthService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.authService.getToken();
    if (token) {
      return true;
    } else {
      this.authService.onSignOut();
      return false;
    }
  }

}
