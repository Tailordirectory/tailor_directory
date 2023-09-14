import {Injectable} from '@angular/core';
import {ApiRouterService} from './api-router.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {OwnerModel} from '../models/owner.model';
import {UpdateOwnerRequestModel} from '../models/update-owner-request.model';

@Injectable()
export class OwnerService {

  constructor(
    private apiService: ApiRouterService,
    private http: HttpClient
  ) {
  }

  getOwner(): Observable<OwnerModel> {
    return this.http.get<OwnerModel>(this.apiService.USERS + '/me');
  }

  updateOwner(owner: UpdateOwnerRequestModel): Observable<OwnerModel> {
    return this.http.patch<OwnerModel>(this.apiService.USERS + '/me', owner);
  }

}
