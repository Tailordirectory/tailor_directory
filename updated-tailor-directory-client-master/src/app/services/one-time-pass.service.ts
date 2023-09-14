import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiRouterService} from './api-router.service';
import {Observable} from 'rxjs';

@Injectable()
export class OneTimePassService {

  constructor(protected http: HttpClient,
              protected apiService: ApiRouterService) {
  }

  onVerifyEmail(id: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiService.ONE_TIME + '/init-email/' + id, {});
  }

}
