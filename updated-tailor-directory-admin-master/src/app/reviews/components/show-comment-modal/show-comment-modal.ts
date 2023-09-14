import {Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ReviewModel} from "../../../models/review.model";
import {ReviewsService} from "../../../services/reviews.service";

@Component({
  selector: 'app-show-comment-modal',
  templateUrl: './show-comment-modal.html',
  styleUrls: ['./show-comment-modal.scss']
})
export class ShowCommentModal {

  @ViewChild('content') content: ElementRef;
  modal: NgbModalRef;
  review: ReviewModel;
  @Output('onDelete') delete: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private modalService: NgbModal,
    private reviewService: ReviewsService
  ) {
  }

  onDeleteReview() {
    this.delete.emit(this.review._id);
    this.modal.close();
  }

  onShowModal(review: ReviewModel) {
    this.review = review;
    this.modal = this.modalService.open(this.content);
  }

}
