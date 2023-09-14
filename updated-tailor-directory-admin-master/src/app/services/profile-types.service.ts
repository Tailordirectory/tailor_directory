import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiRouterService} from "./api-router.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileTypesService {

  constructor(
    private apiRouterService: ApiRouterService,
    private http: HttpClient
  ) {
  }

  getList(): Observable<object[]> {
    return this.http.get<object[]>(this.apiRouterService.PROFILE_TYPES);
  }

}
