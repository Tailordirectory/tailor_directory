import {Observable, of, Subject, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiRouterService} from './api-router.service';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {LoginResponseModel} from '../models/login.response.model';
import {AppState} from '../storage/selectors';
import * as fromUserActions from '../storage/actions/user.actions';
import {Store} from '@ngrx/store';
import {AppUserModel} from '../models/app-user.model';
import {SignUpBusinessRequestModel, SignUpClientRequestModel} from '../models/sign-up-request.model';
import {Router} from '@angular/router';

const JWT = 'JWT_TOKEN';
const REFRESH = 'REFRESH_TOKEN';

@Injectable()
export class AppAuthService {
  $showSignInModal = new Subject<(() => void) | null>();
  $showSignUpModal = new Subject<(() => void) | null>();
  $showResetPasswordModal = new Subject<void>();

  constructor(
    private http: HttpClient,
    private appState: Store<AppState>,
    private router: Router,
    private apiService: ApiRouterService) {
  }

  checkRefreshToken() {
    const token = this.getRefreshToken();
    if (token && token !== '') {
      this.onRefreshToken().subscribe(d => d);
    }
  }

  onRefreshToken(): Observable<boolean> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken != null) {
      return this.http.post<LoginResponseModel>(this.apiService.AUTH + '/signin/refresh/', {refreshToken}).pipe(
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
    return window.localStorage.getItem(JWT);
  }

  signUpClient(client: SignUpClientRequestModel): Observable<boolean> {
    return this.http.post<LoginResponseModel>(this.apiService.AUTH + '/signup', client).pipe(
      switchMap((data: LoginResponseModel) => {
        if (!data.token) {
          return of(false);
        }
        return this.logIn(data as LoginResponseModel);
      }));
  }

  signUpBusiness(business: SignUpBusinessRequestModel): Observable<boolean> {
    return this.http.post<LoginResponseModel>(this.apiService.AUTH + '/signup/tailor', business).pipe(
      switchMap((data: LoginResponseModel) => {
        if (!data.token) {
          return of(false);
        }
        return this.logIn(data as LoginResponseModel);
      }));
  }

  private getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH);
  }

  private setToken(token: string) {
    window.localStorage.setItem(JWT, token);
  }

  private setRefreshToken(token: string) {
    window.localStorage.setItem(REFRESH, token);
  }

  onLogIn(email: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponseModel>(this.apiService.AUTH + '/signin', {email, password}).pipe(
      switchMap((result: LoginResponseModel) => {
        if (!result.token) {
          return of(false);
        }
        return this.logIn(result as LoginResponseModel);
      })
    );
  }

  onSignOut() {
    this.appState.dispatch(fromUserActions.loadUserAction({user: null}));
    window.localStorage.clear();
    this.router.navigate(['/']);
  }

  onResetPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiService.AUTH + '/forgot-password', {email});
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
    if (user.groupName) {
      name = user.groupName;
    }
    if (user.companyName) {
      name = user.companyName;
    }
    const userModel: AppUserModel = {
      id: user.userId,
      name,
      type: user.role,
      profileType: user.profileType
    };
    this.appState.dispatch(fromUserActions.loadUserAction({user: userModel}));
  }

  onShowSignIn(callback?: (() => void)) {
    this.$showSignInModal.next(callback);
  }

  onShowSignUp(callback?: (() => void)) {
    this.$showSignUpModal.next(callback);
  }

  onShowResetPassword() {
    this.$showResetPasswordModal.next();
  }

  onChangePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(this.apiService.USERS + '/me/password', {oldPassword, newPassword});
  }

  onSignUpGoogle(token: string) {
    return this.http.post<LoginResponseModel>(this.apiService.AUTH + '/google', {access_token: token}).pipe(switchMap(result => {
      if (!result.token) {
        return of(false);
      }
      return this.logIn(result as LoginResponseModel);
    }));
  }

  onSignUpFacebook(token: string) {
    return this.http.post<LoginResponseModel>(this.apiService.AUTH + '/facebook', {access_token: token}).pipe(switchMap(result => {
      if (!result.token) {
        return of(false);
      }
      return this.logIn(result as LoginResponseModel);
    }));
  }

}
