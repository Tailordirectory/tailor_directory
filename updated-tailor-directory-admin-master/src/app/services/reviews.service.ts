import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiRouterService} from "./api-router.service";
import {ReviewsRequestModel, ReviewsResponseModel} from "../models/review.model";
import {ClaimRequestModel} from "../models/claim-request.model";

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(
    private http: HttpClient,
    private apiRouterService: ApiRouterService
  ) {
  }

  getList(filter: ReviewsRequestModel, page: number, limit: number, sortBy?: string, asc?: boolean): Observable<ReviewsResponseModel> {
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
        Object.assign(data, {'businessId.businessName': filter.businessName});
      }
      if (filter.firstName) {
        Object.assign(data, {'userId.firstName': filter.firstName});
      }
      if (filter.lastName) {
        Object.assign(data, {'userId.lastName': filter.lastName});
      }
      if (filter.date) {
        Object.assign(data, {
          createdFrom: filter.date.createdFrom,
          createdTo: filter.date.createdTo,
        })
      }
    }
    return this.http.get<ReviewsResponseModel>(this.apiRouterService.REVIEWS, {params: data});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiRouterService.REVIEWS + '/' + id);
  }

}
