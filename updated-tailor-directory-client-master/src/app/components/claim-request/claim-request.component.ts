import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {BusinessModel} from '../../models/business.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {catchError, takeUntil} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppUserModel} from '../../models/app-user.model';
import {AppState} from '../../storage/selectors';
import {AppAuthService} from '../../services/auth.service';
import {ClaimRequestService} from '../../services/claim-request.service';
import * as fromUserSelectors from '../../storage/selectors/user.selector';

@Component({
  selector: 'app-claim-request',
  templateUrl: './claim-request.component.html',
  styleUrls: ['./claim-request.component.scss']
})
export class ClaimRequestComponent implements OnDestroy{

  @Input('business') business: BusinessModel;
  @ViewChild('content') content: Element;
  modal: NgbModalRef;
  description: string;
  onSendRequest: boolean;
  requestSend: boolean;
  user: AppUserModel | null;
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private appState: Store<AppState>,
    private authService: AppAuthService,
    private claimRequestService: ClaimRequestService
  ) {
    this.appState.pipe(select(fromUserSelectors.getUserSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
    });
  }

  onClaimClick() {
    this.onSendRequest = true;
    this.claimRequestService.onSendClaimRequest(this.business._id, this.description)
      .pipe(catchError(e => {
        this.onSendRequest = false;
        return throwError(e);
      }))
      .subscribe(r => {
        this.requestSend = true;
        this.onSendRequest = false;
        this.modal.close();
      });
  }

  onShowModal() {
    if (this.user) {
      this.modal = this.modalService.open(this.content);
    } else {
      this.authService.$showSignInModal.next(() => {
        this.modal = this.modalService.open(this.content);
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
