import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddressSearchModel, GeocodingSearchModel, SearchFilterModel} from '../models/search.model';
import {ApiRouterService} from '../../services/api-router.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../storage/selectors';
import * as fromOffersSelector from '../../storage/selectors/offers.selector';
import {AccountRestrictions, BusinessModel} from '../../models/business.model';
import {BusinessResponseModel} from '../../models/business-response.model';

@Injectable()
export class SearchService {

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

  findBusiness(address: AddressSearchModel, filter: SearchFilterModel, geolocation: GeocodingSearchModel, page?: number, limit?: number): Observable<BusinessResponseModel | null> {
    const params = {
      maxDistance: address.distance,
      latitude: geolocation.lat.toString(),
      longitude: geolocation.long.toString(),
      searchByCoordinates: '1',
    };
    if (page !== undefined && limit !== undefined) {
      Object.assign(params, {page: page.toString()});
      Object.assign(params, {limit: limit.toString()});
    }
    if (filter.businessType && filter.businessType !== '') {
      Object.assign(params, {'businessTypeId.name': filter.businessType});
    }
    if (filter.tags && filter.tags.length > 0) {
      Object.assign(params, {tags: filter.tags});
    }
    if (!params.latitude || !params.longitude) {
      return of(null);
    }
    return this.http.get<BusinessResponseModel>(this.apiService.SEARCH_BUSINESS, {
      params
    }).pipe(map(result => {
      if (result.docs.length && result.docs.length > 0) {
        const basic = 'basic';
        result.docs.forEach(b => {
          if (b.ownerId?.profileType && b.ownerId?.profileType !== '') {
            b.restrictions = this.offers[b.ownerId.profileType];
          } else {
            Object.assign(b, {ownerId: {profileType: basic}});
            b.restrictions = this.offers[basic];
          }
        });
      }
      return result;
    }));
  }

  getFullBusinessList(): Observable<BusinessModel[]> {
    return this.http.get<BusinessModel[]>(this.apiService.SEARCH_BUSINESS);
  }

  getBusinessTypeList(): Observable<string[]> {
    return this.http.get<string[]>(this.apiService.SEARCH_BUSINESS + '/types');
  }

}
