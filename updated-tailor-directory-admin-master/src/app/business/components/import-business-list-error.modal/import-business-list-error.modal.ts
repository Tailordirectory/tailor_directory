import {Component, ViewChild} from "@angular/core";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {BusinessImportErrorModel} from "../../../models/business-import-error.model";

@Component({
  selector: 'app-import-business-list-error',
  templateUrl: './import-business-list-error.modal.html',
  styleUrls: ['./import-business-list-error.modal.scss']
})
export class ImportBusinessListErrorModal {

  modal: NgbModalRef;
  @ViewChild('content') content: Element;

  constructor(
    private modalService: NgbModal
  ) {
  }

  onShowModal(errors: BusinessImportErrorModel[]) {
    this.modal = this.modalService.open(this.content);
  }

}
