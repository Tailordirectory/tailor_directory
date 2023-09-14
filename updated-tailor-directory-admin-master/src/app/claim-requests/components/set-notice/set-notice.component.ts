import {Component, ElementRef, Output, ViewChild} from "@angular/core";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ClaimModel} from "../../../models/claim-request.model";
import {Subject, throwError} from "rxjs";
import {ClaimRequestService} from "../../../services/claim-request.service";
import {catchError} from "rxjs/operators";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-set-notice-modal',
  templateUrl: './set-notice.component.html',
  styleUrls: ['./set-notice.component.scss']
})
export class SetNoticeComponent {

  @Output('update') update: Subject<void> = new Subject<void>();

  @ViewChild('content') content: ElementRef;
  modal: NgbModalRef;
  request: ClaimModel;
  noticeForm: FormGroup = new FormGroup({
    notice: new FormControl('', Validators.required)
  });
  isLoading: boolean;

  constructor(
    private modalService: NgbModal,
    private claimRequestService: ClaimRequestService,
    private notificationService: NotificationService
  ) {
  }

  onShowModal(request: ClaimModel) {
    this.request = request;
    this.modal = this.modalService.open(this.content);
  }

  onSave() {
    this.noticeForm.get('notice')?.markAsTouched();
    if (this.noticeForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.claimRequestService.setComment(this.noticeForm.get('notice')?.value, this.request._id).pipe(
      catchError(e => {
        this.isLoading = false;
        return throwError(e);
      })
    ).subscribe(r => {
      this.isLoading = false;
      this.modal.close();
      this.update.next();
      this.notificationService.notify('Notification has been successfully added.', 'success');
    });
  }

}
