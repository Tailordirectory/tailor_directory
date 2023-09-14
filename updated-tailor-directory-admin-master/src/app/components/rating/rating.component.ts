import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
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
  stars = ['inactive', 'inactive', 'inactive', 'inactive', 'inactive'];
  activeStars = 0;
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
