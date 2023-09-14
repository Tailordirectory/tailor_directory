import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable, Subject, throwError} from 'rxjs';
import {AppAuthService} from '../services/auth.service';
import {catchError, first, switchMap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   * Is refresh token being executed
   */
  private refreshInProgress = false;

  /**
   * Notify all outstanding requests through this subject
   */
  private refreshSubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authService: AppAuthService,
    private injector: Injector,
  ) {
  }

  /**
   * Intercept an outgoing `HttpRequest`
   */
  public intercept(req: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
    if (this.skipRequest(req)) {
      return delegate.handle(req);
    }
    return from(this.processIntercept(req, delegate)).pipe(catchError(err => throwError(err)));
  }

  /**
   * Process all the requests via custom interceptors.
   */
  private async processIntercept(original: HttpRequest<any>, delegate: HttpHandler): Promise<HttpEvent<any>> {
    const clone: HttpRequest<any> = original.clone();
    try {
      const req = await this.request(clone);
      const res = await delegate.handle(req).toPromise();
      return res;
    } catch (err) {
      return this.responseError(clone, err);
    }
  }

  /**
   * Request interceptor. Delays request if refresh is in progress
   * otherwise adds token to the headers
   */
  private request(req: HttpRequest<any>): Promise<HttpRequest<any>> {
    if (this.refreshInProgress) {
      return this.delayRequest(req);
    }
    return this.addToken(req);
  }

  /**
   * Failed request interceptor, check if it has to be processed with refresh
   */
  private async responseError(req: HttpRequest<any>, res: HttpErrorResponse): Promise<HttpEvent<any>> {
    const refreshShouldHappen: boolean = res.status === 401;
    if (refreshShouldHappen && !this.refreshInProgress) {
      this.refreshInProgress = true;
      this.authService.onRefreshToken().toPromise().then((refresh: boolean) => {
        if (!refresh) {
          this.refreshInProgress = false;
          this.refreshSubject.next(false);
        } else {
          this.refreshInProgress = false;
          this.refreshSubject.next(true);
        }
      });
    }

    if (refreshShouldHappen && this.refreshInProgress) {
      return this.retryRequest(req, res);
    }
    throw res;
  }

  /**
   * Add access token to headers or the request
   */
  private async addToken(req: HttpRequest<any>): Promise<HttpRequest<any>> {
    try {
      const isFormData = (req.body instanceof FormData);
      if (!isFormData && !req.headers.has('Content-Type')) {
        req = req.clone({
          headers: req.headers.set('Content-Type', 'application/json; charset=UTF-8')
        });
      }
      // if (req.url.indexOf('/login') > 0 || req.url.indexOf('/i18n') > 0) {
      //   return req;
      // }
      const token = this.authService.getToken();
      if (token) {
        const setHeaders = {Authorization: `Bearer ${token}`};
        return req.clone({setHeaders});
      } else {
        return req;
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Delay request, by subscribing on refresh event, once it finished, process it
   * otherwise throw error
   */
  private delayRequest(req: HttpRequest<any>): Promise<HttpRequest<any>> {
    return this.refreshSubject
      .pipe(
        first(),
        switchMap((status: boolean) => status ? from(this.addToken(req)) : throwError(req))
      )
      .toPromise();
  }

  /**
   * Retry request, by subscribing on refresh event, once it finished, process it
   * otherwise throw error
   */
  private async retryRequest(req: HttpRequest<any>, res: HttpErrorResponse): Promise<HttpEvent<any>> {
    const http: HttpClient = this.injector.get<HttpClient>(HttpClient);

    // wait for token is updated
    return this.refreshSubject
      .pipe(
        first(),
        switchMap((status: boolean) => status ? http.request(req) : throwError(res || req))
      )
      .toPromise();
  }

  /**
   * Checks if request must be skipped by interceptor.
   * By default all request will be not skiped.
   * `Override this method if need`
   */
  private skipRequest(req: HttpRequest<any>): boolean {
    if (req.url.includes('signin/refresh')) {
      return true;
    }
    return false;
  }

}
