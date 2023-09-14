import {Component, OnInit, ViewChild} from '@angular/core';
import {SetNoticeComponent} from "./components/set-notice/set-notice.component";
import {ClaimRequestService} from "../services/claim-request.service";
import {NotificationService} from "../services/notification.service";
import {ClaimModel, ClaimRequestModel} from "../models/claim-request.model";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {DeleteConfirmationModal} from "./components/delete-confirmation.modal/delete-confirmation.modal";

@Component({
  selector: 'app-claim-requests',
  templateUrl: './claim-requests.component.html',
  styleUrls: ['./claim-requests.component.scss']
})
export class ClaimRequestsComponent implements OnInit {

  @ViewChild('setNotice') setNoticeModal: SetNoticeComponent;
  @ViewChild('deleteModal') deleteModal: DeleteConfirmationModal;
  page: number;
  currentPageSize: number;
  pageSize: number;
  pageList = [20, 40, 60, 100];
  statusList: string[] = ['accepted', 'pending', 'declined'];
  claimRequestList: ClaimModel[];
  total: number;
  isLoading: boolean;
  sortBy: string;
  asc: boolean;
  filterForm: FormGroup = new FormGroup({
    fName: new FormControl(''),
    lName: new FormControl(''),
    businessName: new FormControl(''),
    status: new FormControl(null),
    country: new FormControl(''),
    date: new FormControl(''),
  });

  constructor(
    private claimRequestService: ClaimRequestService,
    private notificationService: NotificationService
  ) {
    this.currentPageSize = this.pageSize = this.pageList[0];
  }

  onSetNotice(request: ClaimModel) {
    this.setNoticeModal.onShowModal(request);
  }

  onAccept(id: string) {
    this.isLoading = true;
    this.claimRequestService.accept(id).pipe(catchError(e => {
      this.isLoading = false;
      return throwError(e);
    })).subscribe(r => {
      this.notificationService.notify('Request has been successfully accepted.', 'success');
      this.getList();
    });
  }

  onDecline(claim: ClaimModel) {
    this.deleteModal.onShowModal(claim);
  }

  onChangeSorting(sortBy: string) {
    if (sortBy === this.sortBy) {
      this.asc = !this.asc;
    }
    this.sortBy = sortBy;
    this.page = 1;
    this.getList(this.page, this.sortBy);
  }

  skipFilter() {
    this.filterForm.get('fName')?.setValue('');
    this.filterForm.get('lName')?.setValue('');
    this.filterForm.get('businessName')?.setValue('');
    this.filterForm.get('status')?.setValue(null);
    this.filterForm.get('country')?.setValue('');
    this.filterForm.get('date')?.setValue('');
    this.getList(1);
  }

  getList(page?: number, sortBy?: string) {
    if (page) {
      this.page = page;
    }
    if (sortBy == undefined) {
      this.sortBy = '';
      this.asc = true;
    }
    const filter: ClaimRequestModel = {};
    const form = this.filterForm.getRawValue();
    if (form.fName && form.fName !== '') {
      Object.assign(filter, {firstName: form.fName});
    }
    if (form.lName && form.lName !== '') {
      Object.assign(filter, {lastName: form.lName});
    }
    if (form.businessName && form.businessName !== '') {
      Object.assign(filter, {businessName: form.businessName});
    }
    if (form.status && form.status !== '') {
      Object.assign(filter, {status: form.status});
    }
    if (form.country && form.country !== '') {
      Object.assign(filter, {country: form.country});
    }
    if (form.date !== '' && form.date[0] !== null) {
      form.date[0].setHours(0);
      form.date[0].setMinutes(0);
      form.date[1].setHours(23);
      form.date[1].setMinutes(59);
      const date = {
        createdFrom: form.date[0].toString(),
        createdTo: form.date[1].toString(),
      }
      Object.assign(filter, {date: date});
    }
    if (this.currentPageSize != this.pageSize) {
      this.page = 1;
    }
    this.currentPageSize = this.pageSize;
    this.isLoading = true;
    this.claimRequestService.getList(this.page, this.currentPageSize, filter, this.sortBy, this.asc).pipe(catchError(e => {
      this.isLoading = false;
      return throwError(e);
    })).subscribe(data => {
      this.claimRequestList = data.docs;
      this.total = data.total;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getList(1);
  }

}
