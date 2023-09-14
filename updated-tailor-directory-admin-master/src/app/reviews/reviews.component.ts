import {Component, OnInit, ViewChild} from '@angular/core';
import {ReviewsService} from "../services/reviews.service";
import {ReviewModel, ReviewsRequestModel} from "../models/review.model";
import {ShowCommentModal} from "./components/show-comment-modal/show-comment-modal";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  reviews: ReviewModel[];
  page: number;
  pageLimit: number;
  currentPageLimit: number;
  limitList = [20, 40, 60, 100];
  isShowSpinner: boolean;
  total: number;
  sortBy = 'createdAt';
  asc = true;
  @ViewChild("showComment") showCommentModal: ShowCommentModal;

  filterForm: FormGroup = new FormGroup({
    businessName: new FormControl(''),
    fName: new FormControl(''),
    lName: new FormControl(''),
    createdDate: new FormControl(''),
  })

  constructor(
    private reviewService: ReviewsService
  ) {
  }

  onChangeSorting(sortBy: string) {
    if (sortBy === this.sortBy) {
      this.asc = !this.asc;
    }
    this.sortBy = sortBy;
    this.page = 1;
    this.getList(this.page, this.sortBy);
  }

  getList(page?: number, sortBy?: string) {
    this.currentPageLimit = this.pageLimit;
    if (sortBy == undefined) {
      this.sortBy = 'createdAt';
      this.asc = false;
    }
    const form = this.filterForm.getRawValue();
    const filter: ReviewsRequestModel = {};
    if (form.businessName && form.businessName !== '') {
      Object.assign(filter, {businessName: form.businessName});
    }
    if (form.fName && form.fName !== '') {
      Object.assign(filter, {firstName: form.fName});
    }
    if (form.lName && form.lName !== '') {
      Object.assign(filter, {lastName: form.lName});
    }
    if (form.createdDate !== '' && form.createdDate[0] !== null) {
      form.createdDate[0].setHours(0);
      form.createdDate[0].setMinutes(0);
      form.createdDate[1].setHours(23);
      form.createdDate[1].setMinutes(59);
      const date = {
        createdFrom: form.createdDate[0].toString(),
        createdTo: form.createdDate[1].toString(),
      }
      Object.assign(filter, {date: date});
    }
    this.isShowSpinner = true;
    if (page) {
      this.page = page;
    }
    this.reviewService.getList(filter, this.page, this.currentPageLimit, this.sortBy, this.asc).pipe(catchError(e => {
      this.isShowSpinner = false;
      return throwError(e);
    })).subscribe(l => {
      this.reviews = l.docs;
      this.isShowSpinner = false;
      this.total = l.total;
    });
  }

  ngOnInit(): void {
    this.currentPageLimit = this.limitList[0];
    this.pageLimit = this.limitList[0];
    this.getList(1);
  }

  find() {
    this.getList(1);
  }

  clearFilter() {
    this.sortBy = '';
    this.filterForm.get('businessName')?.setValue('');
    this.filterForm.get('fName')?.setValue('');
    this.filterForm.get('lName')?.setValue('');
    this.filterForm.get('createdDate')?.setValue('');
    this.getList(1);
  }

  onShowComment(review: ReviewModel) {
    this.showCommentModal.onShowModal(review);
  }

  onDelete(id: string) {
    this.reviewService.delete(id).subscribe(r => {
      this.getList();
    })
  }
}
