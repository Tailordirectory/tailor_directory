import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {BusinessTypesModel} from "../../../models/business-types.model";
import {BusinessTypesService} from "../../../services/business-types.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-delete-business-types-modal',
  templateUrl: './delete-confirmation.modal.html',
  styleUrls: ['./delete-confirmation.modal.scss']
})
export class DeleteConfirmationModal {
  modal: NgbModalRef;
  type: BusinessTypesModel;
  isLoading: boolean;

  @ViewChild('content') content: Element;
  @Output('onClose') onClose: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private modalService: NgbModal,
    private businessTypesService: BusinessTypesService,
    private notificationService: NotificationService
  ) {
  }

  onShowModal(type: BusinessTypesModel) {
    this.type = type;
    this.modal = this.modalService.open(this.content);
  }

  onDelete() {
    this.isLoading = true;
    this.businessTypesService.deleteTag(this.type._id).pipe(catchError(e => {
      this.isLoading = false;
      return throwError(e);
    })).subscribe(r => {
      this.isLoading = false;
      this.modal.close();
      this.notificationService.notify('Business type has been successfully deleted.', 'success')
      this.onClose.emit();
    })
  }
}
