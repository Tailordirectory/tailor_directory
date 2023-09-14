import {
  Component, EventEmitter, Output,
  ViewChild
} from "@angular/core";
import {BusinessModel} from "../../../models/business.model";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";

@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.modal.html',
  styleUrls: ['./edit-business.modal.scss']
})
export class EditBusinessModalComponent {

  @ViewChild('content') content: Element;
  business: BusinessModel;
  modal: NgbModalRef;
  submit: Subject<void> = new Subject<void>();
  @Output('onUpdate') update: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private modalService: NgbModal
  ) {
  }

  onShowModal(business: BusinessModel) {
    this.business = business;
    this.modal = this.modalService.open(this.content, {size: "xl"});
  }

    onSuccess() {
    this.update.next();
    this.modal.close();
  }

  onSubmit() {
    this.submit.next();
  }

}
