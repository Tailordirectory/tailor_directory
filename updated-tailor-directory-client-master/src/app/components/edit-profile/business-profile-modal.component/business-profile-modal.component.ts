import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {BusinessModel} from '../../../models/business.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {ConfirmClosingModalComponent} from '../edit-business-profile.component/confirm-closing-modal.component/confirm-closing-modal.component';

@Component({
  selector: 'app-business-profile-modal',
  templateUrl: './business-profile-modal.component.html',
  styleUrls: ['./business-profile-modal.component.scss']
})
export class BusinessProfileModalComponent {

  modal: NgbModalRef;
  isEdit: boolean;
  business: BusinessModel | null;
  @ViewChild('content') content: Element;
  @ViewChild('closingModal') closingModal: ConfirmClosingModalComponent;
  @Output('onSuccess') onSuccess: EventEmitter<void> = new EventEmitter();
  @Input('showPreviewButton') showPreviewButton: boolean;
  submit: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private modalService: NgbModal,
  ) {
  }

  onShowModal(business: BusinessModel | null): void {
    this.business = business;
    if (business) {
      this.isEdit = true;
    }
    this.modal = this.modalService.open(this.content, {size: 'xl', backdrop: 'static', keyboard: false});
  }

  onCloseModal() {
    this.closingModal.onShowModal();
  }

  onClose(isSave: boolean) {
    if (!isSave) {
      this.modal.close();
    } else {
      this.onSubmit();
    }
  }

  success() {
    this.modal.close();
    this.onSuccess.next();
  }

  onSubmit() {
    this.submit.next(false);
  }

  onSubmitAndPreview() {
    this.submit.next(true);
  }

}
