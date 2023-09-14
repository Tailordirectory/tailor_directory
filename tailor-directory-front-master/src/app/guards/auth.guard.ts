import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {CanActivate} from '@angular/router';
import {AppAuthService} from '../services/auth.service';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../storage/selectors';

@Injectable()
export class AuthGuard implements CanActivate {

  path: any;

  constructor(
    private router: Router,
    private appState: Store<AppState>,
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
