import {Component, Input} from '@angular/core';
import {ReviewModel} from '../../models/review.model';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent {
  @Input('review') review: ReviewModel;
  @Input('businessId') businessId: string;

  constructor() {
  }
}
