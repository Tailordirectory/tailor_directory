import {Component, Input, ViewChild} from '@angular/core';
import {AppAuthService} from '../../services/auth.service';
import {BusinessModel} from '../../models/business.model';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OneTimePassService} from '../../services/one-time-pass.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {

  @Input('business') business: BusinessModel;
  @ViewChild('content') content: Element;
  modal: NgbModalRef;
  isRequestSend: boolean;
  isClicked: boolean;

  constructor(
    private oneTimePassService: OneTimePassService,
    private modalService: NgbModal
  ) {
  }

  confirmEmail() {
    this.isClicked = true;
    this.oneTimePassService.onVerifyEmail(this.business._id).pipe(catchError(err => {
      this.isClicked = false;
      this.isRequestSend = false;
      return throwError(err);
    })).subscribe(r => {
      this.modal = this.modalService.open(this.content);
      this.isRequestSend = true;
    });
  }

}
