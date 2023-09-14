import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiRouterService {

  private API_BASE_ROUTE = environment.apiBaseUrl;

  constructor() {
  }

  public readonly BUSINESS_TYPES = this.API_BASE_ROUTE + 'admin/business-types';
  public readonly BUSINESS = this.API_BASE_ROUTE + 'admin/business';
  public readonly OWNERS = this.API_BASE_ROUTE + 'admin/users';
  public readonly USERS = this.API_BASE_ROUTE + 'admin/users';
  public readonly SERVICES = this.API_BASE_ROUTE + 'admin/tags';
  public readonly I18N = this.API_BASE_ROUTE + 'i18n';
  public readonly AUTH = this.API_BASE_ROUTE + 'admin/auth';
  public readonly PROFILE_TYPES = this.API_BASE_ROUTE + 'admin/profiles/permissions';
  public readonly REVIEWS = this.API_BASE_ROUTE + 'admin/reviews';
  public readonly CLAIMS = this.API_BASE_ROUTE + 'admin/claims';
  public readonly STATISTIC = this.API_BASE_ROUTE + 'admin/stats';
  public readonly MANAGE = this.API_BASE_ROUTE + 'admin/manage';

}
