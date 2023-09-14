import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiRouterService} from '../../services/api-router.service';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import * as fromOffersSelector from '../../storage/selectors/offers.selector';
import {Store} from '@ngrx/store';
import {AppState} from '../../storage/selectors';
import {AccountRestrictions, BusinessModel} from '../../models/business.model';

@Injectable()
export class BusinessService {
  offers: { [key: string]: AccountRestrictions };

  constructor(
    private http: HttpClient,
    private apiService: ApiRouterService,
    private appStore: Store<AppState>
  ) {
    this.appStore.select(fromOffersSelector.getOffers).subscribe(offers => {
      this.offers = offers;
    });
  }

  getBusinessById(id: string): Observable<BusinessModel | null> {
    return this.http.get<BusinessModel>(this.apiService.SEARCH_BUSINESS + '/' + id).pipe(map(r => {
      if (r) {
        const basic = 'basic';
        if (r.ownerId?.profileType && r.ownerId?.profileType !== '') {
          r.restrictions = this.offers[r.ownerId.profileType];
        } else {
          Object.assign(r, {ownerId: {profileType: basic}});
          r.restrictions = this.offers[basic];
        }
      }
      return r;
    }), catchError(err => {
      return of(null);
    }));
  }

  getOtherOwnerBusinessList(businessId: string): Observable<BusinessModel[]> {
    return this.http.get<BusinessModel[]>(this.apiService.SEARCH_BUSINESS + '/another/' + businessId);
  }

}
