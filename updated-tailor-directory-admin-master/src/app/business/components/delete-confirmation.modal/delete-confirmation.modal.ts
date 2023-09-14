import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {BusinessModel} from "../../../models/business.model";

@Component({
  selector: 'app-delete-business-modal',
  templateUrl: './delete-confirmation.modal.html',
  styleUrls: ['./delete-confirmation.modal.scss']
})
export class DeleteConfirmationModal {
  modal: NgbModalRef;
  business: BusinessModel;

  @ViewChild('content') content: Element;
  @Output('onClose') onClose: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private modalService: NgbModal,
  ) {
  }

  onShowModal(business: BusinessModel) {
    this.business = business;
    this.modal = this.modalService.open(this.content);
  }
}
