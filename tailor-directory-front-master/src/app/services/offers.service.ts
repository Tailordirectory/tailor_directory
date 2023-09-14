import {Injectable} from '@angular/core';
import {ApiRouterService} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppState} from '../storage/selectors';
import {Store} from '@ngrx/store';
import {AccountRestrictions} from '../models/business.model';
import {AppUserModel} from '../models/app-user.model';
import {tap} from 'rxjs/operators';
import * as fromUserActions from '../storage/actions/user.actions';
import {OwnerModel} from '../models/owner.model';

@Injectable()
export class OffersService {
  constructor(
    private apiService: ApiRouterService,
    private appState: Store<AppState>,
    private http: HttpClient
  ) {
  }

  loadOffers(): Observable<{ [key: string]: AccountRestrictions }> {
    return this.http.get<{ [key: string]: AccountRestrictions }>(this.apiService.OFFERS + '/permissions');
  }

  changeOffer(offer: string, user: AppUserModel): Observable<OwnerModel> {
    return this.http.post<OwnerModel>(this.apiService.OFFERS + '/profile-type', {profileType: offer}).pipe(tap(() => {
      const updatedUser = {...user, profileType: offer};
      this.appState.dispatch(fromUserActions.loadUserAction({user: updatedUser}));
    }));
  }

}
