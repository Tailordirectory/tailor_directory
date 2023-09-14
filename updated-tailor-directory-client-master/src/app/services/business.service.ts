import {Injectable} from '@angular/core';
import {ApiRouterService} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AccountRestrictions, BusinessModel, MediaModel} from '../models/business.model';
import {UpdateBusinessRequestModel} from '../models/update-business-request.model';
import {UploadGalleryResponseModel, UploadLogoResponseModel} from '../models/upload-media-responce.model';
import {Store} from '@ngrx/store';
import {AppState} from '../storage/selectors';
import * as fromOffersSelector from '../storage/selectors/offers.selector';
import {map} from 'rxjs/operators';

@Injectable()
export class BusinessService {

  offers: { [key: string]: AccountRestrictions };

  constructor(
    private apiService: ApiRouterService,
    private http: HttpClient,
    private appStore: Store<AppState>
  ) {
    this.appStore.select(fromOffersSelector.getOffers).subscribe(offers => {
      this.offers = offers;
    });
  }

  getBusinessById(id: string): Observable<BusinessModel> {
    return this.http.get<BusinessModel>(this.apiService.BUSINESS + '/' + id).pipe(map(b => {
      if (b) {
        const basic = 'basic';
        if (b.ownerId?.profileType && b.ownerId?.profileType !== '') {
          b.restrictions = this.offers[b.ownerId.profileType];
        } else {
          Object.assign(b, {ownerId: {profileType: basic}});
          b.restrictions = this.offers[basic];
        }
      }
      return b;
    }));
  }

  getMyBusinessList(): Observable<BusinessModel[]> {
    return this.http.get<BusinessModel[]>(this.apiService.BUSINESS + '/me').pipe(map(result => {
      if (result.length && result.length > 0) {
        const basic = 'basic';
        result.forEach(b => {
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

  updateBusiness(id: string, business: UpdateBusinessRequestModel): Observable<any> {
    return this.http.patch(this.apiService.BUSINESS + '/' + id, business);
  }

  uploadLogo(id: string, logo: FormData): Observable<UploadLogoResponseModel> {
    return this.http.post<UploadLogoResponseModel>(this.apiService.BUSINESS + '/icon/' + id, logo);
  }

  uploadMedia(id: string, gallery: FormData): Observable<UploadGalleryResponseModel> {
    return this.http.post<UploadGalleryResponseModel>(this.apiService.BUSINESS + '/media/' + id, gallery);
  }

  deleteMedia(id: string, arr: string[]): Observable<UploadGalleryResponseModel> {
    return this.http.delete<UploadGalleryResponseModel>(this.apiService.BUSINESS + '/media/' + id, {params: {ids: arr}});
  }

  deleteBusiness(businessId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.apiService.BUSINESS + '/' + businessId);
  }

  addNewBusiness(business: UpdateBusinessRequestModel): Observable<BusinessModel> {
    return this.http.post<BusinessModel>(this.apiService.BUSINESS, business);
  }

}
