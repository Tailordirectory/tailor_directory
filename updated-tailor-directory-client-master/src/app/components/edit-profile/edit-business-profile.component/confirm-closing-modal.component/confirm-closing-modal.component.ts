import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {BusinessModel} from '../../../../models/business.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-closing-modal',
  templateUrl: './confirm-closing-modal.component.html',
  styleUrls: ['./confirm-closing-modal.component.scss']
})
export class ConfirmClosingModalComponent {

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

  close() {
    this.modal.close();
    this.onClose.emit(false);
  }

  closeAndSave() {
    this.modal.close();
    this.onClose.emit(true);
  }
}
