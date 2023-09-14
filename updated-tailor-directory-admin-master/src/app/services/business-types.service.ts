import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiRouterService} from "./api-router.service";
import {BusinessTypesModel} from "../models/business-types.model";

@Injectable({
  providedIn: 'root'
})
export class BusinessTypesService {
  constructor(
    private http: HttpClient,
    private apiRouterService: ApiRouterService
  ) {
  }

  getList(): Observable<BusinessTypesModel[]> {
    return this.http.get<BusinessTypesModel[]>(this.apiRouterService.BUSINESS + '/types');
  }

  addTag(name: string): Observable<BusinessTypesModel> {
    return this.http.post<BusinessTypesModel>(this.apiRouterService.BUSINESS_TYPES, {name: name});
  }

  editTag(id: string, name: string): Observable<BusinessTypesModel> {
    return this.http.patch<BusinessTypesModel>(this.apiRouterService.BUSINESS_TYPES + '/' + id, {name: name});
  }

  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(this.apiRouterService.BUSINESS_TYPES + '/' + id);
  }

  updateIcon(id: string, file: FormData): Observable<{ doc: string }> {
    return this.http.post<{ doc: string }>(this.apiRouterService.BUSINESS_TYPES + '/icon/' + id, file);
  }

}
