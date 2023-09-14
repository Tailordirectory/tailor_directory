import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApiRouterService} from "./api-router.service";
import {Observable} from "rxjs";
import {BusinessStatisticModel, SubscriptionsStatisticModel} from "../models/statistic.model";
import {Router} from "@angular/router";
import {AppAuthService} from "./app-auth.service";

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AppAuthService,
    private apiRouterService: ApiRouterService) {
  }

  getProfileTypes(): Observable<SubscriptionsStatisticModel> {
    return this.http.get<SubscriptionsStatisticModel>(this.apiRouterService.STATISTIC + '/profile-types')
  }

  getRegisteredBusiness(fromDate: Date, toDate: Date): Observable<BusinessStatisticModel> {
    const data = {
      createdFrom: fromDate.toString(),
      createdTo: toDate.toString(),
    }
    return this.http.get<BusinessStatisticModel>(this.apiRouterService.STATISTIC + '/created-by', {params: data})
  }

  getBusinessFile(fromDate: Date, toDate: Date) {
    fromDate.setHours(1);
    fromDate.setMinutes(0);
    toDate.setHours(23);
    toDate.setMinutes(59);
    const createdFrom = fromDate.getTime().toString();
    const createdTo = toDate.getTime().toString();
    const token = this.authService.getToken();
    const url = this.apiRouterService.BUSINESS + `/xls?createdFrom=${createdFrom}&createdTo=${createdTo}&Authorization=Bearer ${token}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }

  getProfileFile() {
    const token = this.authService.getToken();
    const url = this.apiRouterService.USERS + `/owners-xls?role=business&Authorization=Bearer ${token}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }

}
