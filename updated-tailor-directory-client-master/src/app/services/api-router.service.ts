import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class ApiRouterService {
  private API_BASE_ROUTE = environment.apiBaseUrl;

  constructor() {
  }
  public readonly SEARCH_BUSINESS = this.API_BASE_ROUTE + 'business';
  public readonly BUSINESS = this.API_BASE_ROUTE + 'business';
  public readonly TAGS_LIST = this.API_BASE_ROUTE + 'tags';
  public readonly I18N = this.API_BASE_ROUTE + 'i18n';
  public readonly AUTH = this.API_BASE_ROUTE + 'auth';
  public readonly USERS = this.API_BASE_ROUTE + 'users';
  public readonly REVIEWS = this.API_BASE_ROUTE + 'reviews';
  public readonly ONE_TIME = this.API_BASE_ROUTE + 'one-time-pass';
  public readonly CLAIM_REQUEST = this.API_BASE_ROUTE + 'claim-request';
  public readonly OFFERS = this.API_BASE_ROUTE + 'profiles';
}
