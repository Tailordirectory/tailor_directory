import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OwnersFilterModel, OwnersResponseModel} from "../models/owners-response.model";
import {OwnerModel} from "../models/owner.model";
import {ApiRouterService} from "./api-router.service";


@Injectable({
  providedIn: 'root'
})
export class OwnersService {

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRouterService,
  ) {
  }

  getList(page: number, limit: number, filter?: OwnersFilterModel, sortBy?: string, asc?: boolean): Observable<OwnersResponseModel> {
    const data = {
      role: 'business',
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
      if (filter.firstName) {
        Object.assign(data, {
          firstName: filter.firstName
        })
      }
      if (filter.lastName) {
        Object.assign(data, {
          lastName: filter.lastName
        })
      }
      if (filter.email) {
        Object.assign(data, {
          email: filter.email
        })
      }
      if (filter.profileType) {
        Object.assign(data, {
          profileType: filter.profileType
        })
      }
      if (filter.date) {
        Object.assign(data, {
          createdFrom: filter.date.createdFrom,
          createdTo: filter.date.createdTo,
        })
      }
    }
    return this.http.get<OwnersResponseModel>(this.apiRoutes.OWNERS, {params: data});
  }

  findById(ownerId: string): Observable<OwnerModel> {
    return this.http.get<OwnerModel>(this.apiRoutes.OWNERS + '/' + ownerId);
  }

  onDelete(ownerId: string): Observable<void> {
    return this.http.delete<void>(this.apiRoutes.OWNERS + '/' + ownerId);
  }

  onAddNew(firstName: string, lastName: string, email: string): Observable<OwnerModel> {
    const password = Math.random().toString(36).substring(4);
    return this.http.post<OwnerModel>(this.apiRoutes.OWNERS, {firstName, lastName, email, password, role: 'business'});
  }

  onEdit(firstName: string, lastName: string, id: string): Observable<OwnerModel> {
    return this.http.patch<OwnerModel>(this.apiRoutes.OWNERS + '/' + id, {firstName, lastName});
  }

}
