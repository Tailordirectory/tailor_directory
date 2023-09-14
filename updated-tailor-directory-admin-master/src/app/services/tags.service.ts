import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiRouterService} from './api-router.service';
import {TagsResponseModel} from '../models/tags-response.model';
import {TagsFilterModel, TagsModel} from "../models/tags.model";

@Injectable({
  providedIn: "root"
})
export class TagsService {
  constructor(
    private http: HttpClient,
    private apiService: ApiRouterService) {
  }

  loadTagsList(filter?: TagsFilterModel, page?: number, limit?: number, sortBy?: string, asc?: boolean): Observable<TagsResponseModel> {

    const data = {};
    if (page != undefined && limit != undefined) {
      Object.assign(data, {
        page: page.toString(),
        limit: limit.toString()
      })
    }
    if (sortBy != undefined && asc != undefined) {
      Object.assign(data, {
        sortBy: sortBy,
        sortType: (asc) ? 'asc' : 'desc'
      })
    }
    if (filter != undefined) {
      if (filter.name) {
        Object.assign(data, {'name': filter.name});
      }
      if (filter.date) {
        Object.assign(data, {
          createdFrom: filter.date.createdFrom,
          createdTo: filter.date.createdTo,
        })
      }
    }
    return this.http.get<TagsResponseModel>(this.apiService.SERVICES, {params: data});
  }

  addTag(name: string): Observable<TagsModel> {
    return this.http.post<TagsModel>(this.apiService.SERVICES, {name: name});
  }

  updateTag(id: string, name: string): Observable<TagsModel> {
    return this.http.patch<TagsModel>(this.apiService.SERVICES + '/' + id, {name: name});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiService.SERVICES + '/' + id);
  }

}
