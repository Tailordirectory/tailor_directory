import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {OwnerModel} from "../../../models/owner.model";

@Component({
  selector: 'app-delete-owner-modal',
  templateUrl: './delete-confirmation.modal.html',
  styleUrls: ['./delete-confirmation.modal.scss']
})
export class DeleteConfirmationModal {
  modal: NgbModalRef;
  owner: OwnerModel;

  @ViewChild('content') content: Element;
  @Output('onClose') onClose: EventEmitter<OwnerModel | null> = new EventEmitter<OwnerModel | null>();

  constructor(
    private modalService: NgbModal,
  ) {
  }

  onShowModal(owner: OwnerModel) {
    this.owner = owner;
    this.modal = this.modalService.open(this.content);
    this.modal.result.then((reason: boolean) => {
      if (reason) {
        this.onClose.emit(this.owner);
      } else {
        this.onClose.emit(null);
      }
    })
  }
}
