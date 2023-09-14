import {ReviewModel} from './review.model';

export interface ReviewResponseModel {
  docs: ReviewModel[];
  total: number;
}
