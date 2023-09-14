import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ReviewService} from '../../services/review.service';
import {AppAuthService} from '../../services/auth.service';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../storage/selectors';
import {AppUserModel} from '../../models/app-user.model';
import * as fromUserSelectors from '../../storage/selectors/user.selector';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingComponent implements OnInit, OnDestroy {

  @Input('rating') rating: number;
  @Input('reviewCount') reviewsCount: number;
  @Input('hideRating') hideRating?: boolean;
  @Input('hideCount') hideCount?: boolean;
  @Input('hideReview') hideReview?: boolean;
  @Input('businessId') businessId: string;
  stars = ['inactive', 'inactive', 'inactive', 'inactive', 'inactive'];
  activeStars = 0;
  userState: AppUserModel | null;
  isShowLeaveComment: boolean;
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    protected reviewService: ReviewService,
    protected authService: AppAuthService,
    private appStore: Store<AppState>,
    private changeDetectorRef: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.appStore.pipe(select(fromUserSelectors.getUserSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.isShowLeaveComment = false;
      this.userState = user;
      this.changeDetectorRef.detectChanges();
      if (user) {
        if (user.type === 'user') {
          this.reviewService.canSendReview(this.businessId).subscribe(res => {
            if (!res.exists) {
              this.isShowLeaveComment = true;
              this.changeDetectorRef.detectChanges();
            }
          });
        }
      } else {
        this.isShowLeaveComment = true;
        this.changeDetectorRef.detectChanges();
      }
    });
    this.activeStars = Math.trunc(this.rating);
    const fraction = this.rating - this.activeStars;
    const isDouble = fraction > 0;
    if (this.activeStars > 0) {
      for (let i = 0; i < this.activeStars; i++) {
        this.stars[i] = 'active';
      }
    }
    if (isDouble) {
      if (fraction > 0.5) {
        this.stars[this.activeStars] = 'active';
      } else {
        this.stars[this.activeStars] = 'half';
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  onLeaveReview() {
    if (!this.userState) {
      this.authService.onShowSignIn(() => {
        this.reviewService.canSendReview(this.businessId).subscribe(r => {
          if (!r.exists) {
            this.reviewService.onShowModal(this.businessId, () => {
              this.isShowLeaveComment = true;
              this.changeDetectorRef.detectChanges();
            });
          } else {
            this.isShowLeaveComment = false;
            this.changeDetectorRef.detectChanges();
          }
        });
      });
    } else {
      this.reviewService.onShowModal(this.businessId, () => {
        this.isShowLeaveComment = false;
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
