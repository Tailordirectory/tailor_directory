import {HttpClient} from '@angular/common/http';
import {ApiRouterService} from './api-router.service';
import {Injectable} from '@angular/core';
import {Observable, of, Subject, throwError} from 'rxjs';
import {ReviewResponseModel} from '../search/models/review-response.model';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ReviewService {

  private showModal: Subject<{ businessId: string, callback: (() => void) }> = new Subject<{ businessId: string, callback: (() => void) }>();

  constructor(
    private http: HttpClient,
    private apiService: ApiRouterService) {
  }

  sendReview(stars: number, comment: string, businessId: string): Observable<any> {
    return this.http.post(this.apiService.REVIEWS + '/business/' + businessId, {
      stars,
      comment
    });
  }

  getReviewListById(businessId: string): Observable<ReviewResponseModel> {
    return this.http.get<ReviewResponseModel>(this.apiService.REVIEWS + '/business/' + businessId);
  }

  canSendReview(businessId: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(this.apiService.REVIEWS + '/business/is-exists/' + businessId).pipe(catchError(err => {
      if (err.status === 403) {
        return of({exists: true});
      } else {
        return throwError(err);
      }
    }));
  }

  onShowModal(businessId: string, callback: (() => void)) {
    this.showModal.next({businessId, callback});
  }

  getOnShowModal(): Subject<{ businessId: string, callback: (() => void) }> {
    return this.showModal;
  }

}
