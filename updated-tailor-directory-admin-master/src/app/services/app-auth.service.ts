import {Inject, Injectable, InjectionToken} from '@angular/core';
import {ApiRouterService} from "./api-router.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {AppState} from "../store/selectors";
import {AppUserModel} from "../models/user.model";
import {LoginResponseModel} from "../models/login-response.model";
import {Observable, of} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";
import * as fromUserActions from '../store/actions/user.actions';

const JWT = 'JWT_ADMIN_TOKEN';
const REFRESH = 'REFRESH_ADMIN_TOKEN';

export const BROWSER_STORAGE = new InjectionToken('Browser Local Storage', {
  providedIn: 'root',
  factory: () => localStorage
})

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {

  constructor(
    private http: HttpClient,
    private appState: Store<AppState>,
    private apiRoutes: ApiRouterService,
    private router: Router,
    @Inject(BROWSER_STORAGE) private browserStorage: Storage
  ) {
  }

  checkRefreshToken() {
    const token = this.getRefreshToken();
    if (token && token !== '') {
      this.onRefreshToken().subscribe(d => d);
    } else {
      this.onSignOut();
    }
  }

  onRefreshToken(): Observable<boolean> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken != null) {
      return this.http.post<LoginResponseModel>(this.apiRoutes.AUTH + '/refresh', {refreshToken}).pipe(
        catchError(err => {
          this.onSignOut();
          return of(false);
        }), switchMap(result => {
          if (result === false) {
            return of(result);
          }
          return this.logIn(result as LoginResponseModel);
        }));
    } else {
      return of(false);
    }
  }

  getToken(): string | null {
    return this.browserStorage.getItem(JWT);
  }

  private getRefreshToken(): string | null {
    return this.browserStorage.getItem(REFRESH);
  }

  private setToken(token: string) {
    this.browserStorage.setItem(JWT, token);
  }

  private setRefreshToken(token: string) {
    this.browserStorage.setItem(REFRESH, token);
  }

  onLogIn(email: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponseModel>(this.apiRoutes.AUTH, {email, password}).pipe(
      switchMap((result: LoginResponseModel) => {
        if (!result.token) {
          return of(false);
        }
        return this.logIn(result as LoginResponseModel);
      })
    );
  }

  onSignOut() {
    this.appState.dispatch(fromUserActions.setUserAction({user: null}));
    this.browserStorage.clear();
    this.router.navigate(['/login']);
  }

  private logIn(user: LoginResponseModel): Observable<boolean> {
    this.setRefreshToken(user.refreshToken);
    this.setToken(user.token);
    this.setUserModel(user);
    return of(true);
  }

  private setUserModel(user: LoginResponseModel) {
    let name = '';
    if (user.firstName || user.lastName) {
      name = user.firstName + ' ' + user.lastName;
    }
    const userModel: AppUserModel = {
      id: user.userId,
      name,
      type: user.type,
    };
    this.appState.dispatch(fromUserActions.setUserAction({user: userModel}));
  }
}
