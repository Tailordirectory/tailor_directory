import {Injectable} from "@angular/core";
import {ApiRouterService} from "./api-router.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ManageService {

  constructor(
    private apiRouterService: ApiRouterService,
    private http: HttpClient
  ) {
  }

  updateLogo(formData: FormData) {
    return this.http.patch(this.apiRouterService.MANAGE, formData)
  }

}
