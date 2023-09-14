import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiRouterService} from './api-router.service';
import {Observable} from 'rxjs';
import {BusinessTypesModel} from '../models/business-types.model';

@Injectable()
export class BusinessTypesService {

  constructor(
    private http: HttpClient,
    private apiService: ApiRouterService
  ) {
  }

  getList(): Observable<BusinessTypesModel[]> {
    return this.http.get<BusinessTypesModel[]>(this.apiService.SEARCH_BUSINESS + '/types');
  }

}
