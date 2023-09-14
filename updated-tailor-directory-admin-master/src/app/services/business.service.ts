import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {BusinessResponseModel} from "../models/business-resopnce.model";
import {HttpClient} from "@angular/common/http";
import {BusinessModel} from "../models/business.model";
import {businessFilterModel} from "../models/business-filter.model";
import {ApiRouterService} from "./api-router.service";
import {UpdateBusinessRequestModel} from "../models/update-business-profile.model";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(
    private http: HttpClient,
    private apiRouterService: ApiRouterService
  ) {
  }

  getList(page: number, limit: number, filter?: businessFilterModel, sortBy?: string, asc?: boolean): Observable<BusinessResponseModel> {
    const data = {
      page: page.toString(),
      limit: limit.toString()
    };
    if (sortBy != undefined && asc != undefined) {
      Object.assign(data, {
        sortBy: sortBy,
        sortType: (asc) ? 'asc' : 'desc'
      })
    }
    if (filter != undefined) {
      if (filter.businessName) {
        Object.assign(data, {
          businessName: filter.businessName
        })
      }
      if (filter['businessTypeId.name']) {
        Object.assign(data, {
          'businessTypeId.name': filter['businessTypeId.name']
        })
      }
      if (filter.country) {
        Object.assign(data, {
          country: filter.country
        })
      }
      if (filter.zip) {
        Object.assign(data, {
          zipCode: filter.zip
        })
      }
      if (filter.createdBy) {
        Object.assign(data, {
          createdBy: filter.createdBy
        })
      }
      if (filter.ownerFName) {
        Object.assign(data, {
          'ownerId.firstName': filter.ownerFName
        });
      }
      if (filter.ownerLName) {
        Object.assign(data, {
          'ownerId.lastName': filter.ownerLName
        });
      }
      if (filter.date) {
        Object.assign(data, {
          createdFrom: filter.date.createdFrom,
          createdTo: filter.date.createdTo,
        })
      }
    }
    return this.http.get<BusinessResponseModel>(this.apiRouterService.BUSINESS, {params: data});
  }

  getDuplicates(): Observable<BusinessResponseModel> {
    return this.http.get<BusinessResponseModel>(this.apiRouterService.BUSINESS + '/duplicates');
  }

  addNew(business: UpdateBusinessRequestModel): Observable<BusinessModel> {
    return this.http.post<BusinessModel>(this.apiRouterService.BUSINESS, business);
  }

  editBusiness(business: UpdateBusinessRequestModel): Observable<BusinessModel> {
    return this.http.patch<BusinessModel>(this.apiRouterService.BUSINESS + '/' + business._id, business);
  }

  deleteBusiness(id: string): Observable<void> {
    return this.http.delete<void>(this.apiRouterService.BUSINESS + '/' + id);
  }

}
