import {Component, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {AppAuthService} from '../../../services/auth.service';
import {SignUpCloseConfirmationModalComponent} from '../sign-up-close-confirmation-modal/sign-up-close-confirmation-modal';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss']
})
export class SignUpModalComponent {

  @ViewChild('closeModal') closeModal: SignUpCloseConfirmationModalComponent;
  @ViewChild('content') content: Element;
  modal: NgbModalRef;

  isUserRegister = false;
  isBusinessRegister = false;
  callback: (() => void) | null;

  constructor(
    private modalService: NgbModal,
    private authService: AppAuthService) {
    this.authService.$showSignUpModal.asObservable().subscribe(callback => {
      this.onShowModal();
      if (callback) {
        this.callback = callback;
      } else {
        this.callback = null;
      }
    });
  }

  private onShowModal() {
    this.modal = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'sign-up-modal auth-modal',
      backdrop: 'static',
      keyboard: false
    });
    this.modal.result.finally(() => {
      this.isUserRegister = false;
      this.isBusinessRegister = false;
    });
  }

  onSetBusiness() {
    this.isBusinessRegister = true;
  }

  onSetUser() {
    this.isUserRegister = true;
  }

  onCloseModal() {
    this.closeModal.onShowModal();
  }

  onClose(isClosed: boolean) {
    if (isClosed) {
      this.modal.close();
    }
  }

  onSignIn() {
    this.modal.close();
    if (this.callback) {
      this.authService.onShowSignIn(this.callback);
    } else {
      this.authService.onShowSignIn();
    }
  }
}
