import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiRouterService} from './api-router.service';
import {Observable} from 'rxjs';

@Injectable()
export class ClaimRequestService {

  constructor(
    protected http: HttpClient,
    protected apiService: ApiRouterService
  ) {
  }

  onSendClaimRequest(businessId: string, description?: string): Observable<boolean> {
    const body = {businessId};
    if (description) {
      Object.assign(body, {message: description});
    }
    return this.http.post<boolean>(this.apiService.CLAIM_REQUEST, body);
  }

}
