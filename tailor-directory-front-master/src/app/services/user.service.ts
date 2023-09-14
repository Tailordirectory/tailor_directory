import {Observable} from 'rxjs';
import {AppUserModel} from '../models/app-user.model';
import {HttpClient} from '@angular/common/http';
import {ApiRouterService} from './api-router.service';
import {Injectable} from '@angular/core';

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    private apiService: ApiRouterService) {
  }

  getCurrentUser(): Observable<AppUserModel> {
    return this.http.get<AppUserModel>(this.apiService.USERS + '/me');
  }

}
