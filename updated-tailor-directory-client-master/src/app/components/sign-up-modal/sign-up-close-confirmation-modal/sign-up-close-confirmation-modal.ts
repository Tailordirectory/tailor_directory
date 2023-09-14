import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sign-up-close-confirmation-modal',
  templateUrl: './sign-up-close-confirmation-modal.html',
  styleUrls: ['./sign-up-close-confirmation-modal.scss']
})
export class SignUpCloseConfirmationModalComponent {
  modal: NgbModalRef;
  @ViewChild('content') content: Element;
  @Output('onClose') onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private modalService: NgbModal,
  ) {
  }

  onShowModal(): void {
    this.modal = this.modalService.open(this.content, {backdrop: 'static', keyboard: false});
  }

  onStay() {
    this.modal.close();
  }

  close() {
    this.modal.close();
    this.onClose.emit(true);
  }
}
