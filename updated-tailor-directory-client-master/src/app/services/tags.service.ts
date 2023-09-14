import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiRouterService} from './api-router.service';
import {TagsResponseModel} from '../models/tags-response.model';
import {Store} from '@ngrx/store';

@Injectable()
export class TagsService {
  constructor(
    private http: HttpClient,
    private apiService: ApiRouterService) {
  }

  loadTagsList(page: number, limit: number, search?: string): Observable<TagsResponseModel> {
    const data = {
      page: page.toString(),
      limit: limit.toString()
    };
    if (search) {
      Object.assign(data, {name: search});
    }
    return this.http.get<TagsResponseModel>(this.apiService.TAGS_LIST, {params: data});
  }

}
