import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApiRouterService} from "./api-router.service";
import {Observable} from "rxjs";
import {ClaimModel, ClaimRequestModel, ClaimResponseModel} from "../models/claim-request.model";
import {businessFilterModel} from "../models/business-filter.model";

@Injectable({
  providedIn: 'root'
})
export class ClaimRequestService {

  constructor(
    private http: HttpClient,
    private apiRouterService: ApiRouterService
  ) {
  }

  getList(page: number, limit: number, filter?: ClaimRequestModel, sortBy?: string, asc?: boolean): Observable<ClaimResponseModel> {
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
          "businessId.businessName": filter.businessName
        })
      }
      if (filter.firstName) {
        Object.assign(data, {
          "userId.firstName": filter.firstName
        })
      }
      if (filter.lastName) {
        Object.assign(data, {
          "userId.lastName": filter.lastName
        })
      }
      if (filter.country) {
        Object.assign(data, {
          "businessId.country": filter.country
        })
      }
      if (filter.status) {
        Object.assign(data, {
          status: filter.status
        })
      }
      if (filter.date) {
        Object.assign(data, {
          createdFrom: filter.date.createdFrom,
          createdTo: filter.date.createdTo,
        })
      }
    }
    return this.http.get<ClaimResponseModel>(this.apiRouterService.CLAIMS, {params: data});
  }

  accept(id: string): Observable<void> {
    return this.http.post<void>(this.apiRouterService.CLAIMS + '/accept/' + id, {});
  }

  setComment(comment: string, id: string): Observable<ClaimModel> {
    return this.http.post<ClaimModel>(this.apiRouterService.CLAIMS + '/reply/' + id, {message: comment});
  }

  decline(id: string): Observable<void> {
    return this.http.post<void>(this.apiRouterService.CLAIMS + '/decline/' + id, {});
  }

}
