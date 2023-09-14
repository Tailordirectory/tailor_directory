import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {BusinessModel} from "../../../models/business.model";
import {ClaimModel, ClaimRequestModel} from "../../../models/claim-request.model";
import {ClaimRequestService} from "../../../services/claim-request.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-delete-claim-request-modal',
  templateUrl: './delete-confirmation.modal.html',
  styleUrls: ['./delete-confirmation.modal.scss']
})
export class DeleteConfirmationModal {
  modal: NgbModalRef;
  claimRequest: ClaimModel;
  isShowSpinner: boolean;

  @ViewChild('content') content: Element;
  @Output('update') update: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private modalService: NgbModal,
    private claimRequestService: ClaimRequestService,
    private notificationService: NotificationService
  ) {
  }

  onShowModal(claimRequest: ClaimModel) {
    this.claimRequest = claimRequest;
    this.modal = this.modalService.open(this.content);
  }

  onDeleteRequest() {
    this.isShowSpinner = true;
    this.claimRequestService.decline(this.claimRequest._id).pipe(catchError(e => {
      this.isShowSpinner = false;
      return throwError(e);
    })).subscribe(r => {
      this.isShowSpinner = false;
      this.update.emit();
      this.notificationService.notify('Request has been successfully declined.', 'success');
      this.modal.close();
    })
  }
}
