import {Component, OnDestroy, ViewChild} from '@angular/core';
import {ReviewService} from '../../services/review.service';
import {catchError, takeUntil} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-leave-review-modal',
  templateUrl: './leave-a-review-modal.component.html',
  styleUrls: ['./leave-a-review-modal.component.scss']
})
export class LeaveAReviewModalComponent implements OnDestroy {
  businessId: string;
  isSending = false;
  modal: NgbModalRef;
  unsubscribe$: Subject<void> = new Subject<void>();
  reviewStars = 1;
  reviewComment = '';
  callback: (() => void);
  @ViewChild('content') content: Element;

  constructor(
    private reviewService: ReviewService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {
    this.reviewService.getOnShowModal().pipe(takeUntil(this.unsubscribe$)).subscribe(state => {
      this.modal = this.modalService.open(this.content);
      this.businessId = state.businessId;
      this.callback = state.callback;
    });
  }

  setReviewStar(stars: number) {
    this.reviewStars = stars;
  }

  onHoverInStar(event: Event, star: number) {
    const element: Element = event.target as Element;
    const parent: Element = element.parentElement as Element;
    this.setStars(parent, star);
  }

  onHoverOutStar(event: Event) {
    const element: Element = event.target as Element;
    const parent: Element = element.parentElement as Element;
    this.setStars(parent, this.reviewStars);
  }

  private setStars(element: Element, stars: number) {
    const starsList = Array.prototype.slice.call(element.getElementsByClassName('star'));
    starsList.forEach((star: Element) => {
      star.classList.remove('active');
    });
    if (stars && stars > 0) {
      for (let i = 0; i < stars; i++) {
        starsList[i].classList.add('active');
      }
    }
  }

  onLeaveReview() {
    this.isSending = true;
    this.reviewService.sendReview(this.reviewStars, this.reviewComment, this.businessId).pipe(catchError(err => {
      this.isSending = false;
      return throwError(err);
    })).subscribe(res => {
      this.isSending = false;
      this.notificationService.notify('leave_review.success', 'success');
      this.callback();
      this.reviewStars = 1;
      this.reviewComment = '';
      this.modal.close();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
