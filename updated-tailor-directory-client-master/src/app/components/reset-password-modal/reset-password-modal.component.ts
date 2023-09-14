import {Component, ViewChild} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppAuthService} from '../../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.scss']
})
export class ResetPasswordModalComponent {

  @ViewChild('content') content: Element;
  modal: NgbModalRef;
  isResetSuccess: boolean;
  isResetError: boolean;
  sendingRequest: boolean;
  resetForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private modalService: NgbModal,
    private authService: AppAuthService) {
    this.authService.$showResetPasswordModal.asObservable().subscribe(r => {
      this.modal = this.modalService.open(this.content, {windowClass: 'auth-modal'});
      this.modal.result.finally(() => {
        this.isResetError = false;
        this.isResetSuccess = false;
        this.resetForm.reset();
      });
    });
  }

  onResetPassword() {
    if (this.resetForm.invalid) {
      return;
    }
    this.sendingRequest = true;
    const email = this.resetForm.get('email')?.value;
    this.authService.onResetPassword(email).pipe(catchError(e => {
      this.sendingRequest = false;
      this.isResetError = true;
      return throwError(e);
    })).subscribe(r => {
      this.sendingRequest = false;
      this.isResetSuccess = true;
    });
  }

}
