import {Component, OnDestroy, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {Store} from '@ngrx/store';
import {AppState} from '../../../storage/selectors';
import {AppUserModel} from '../../../models/app-user.model';
import * as fromOfferSelectors from '../../../storage/selectors/offers.selector';
import * as fromOfferActions from '../../../storage/actions/offers.action';
import * as fromUserSelectors from '../../../storage/selectors/user.selector';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {OffersService} from '../../../services/offers.service';

@Component({
  selector: 'app-offers-modal',
  templateUrl: './offers-modal.component.html',
  styleUrls: ['./offers-modal.component.scss']
})
export class OffersModalComponent implements OnDestroy {

  modal: NgbModalRef;
  user: AppUserModel;
  @ViewChild('content') content: Element;
  unsubscribe: Subject<void> = new Subject<void>();
  $offers: Observable<object>;

  constructor(
    private modalService: NgbModal,
    private offersService: OffersService,
    private appStore: Store<AppState>
  ) {
    this.appStore.select(fromUserSelectors.getUserSelector).pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      this.user = d as AppUserModel;
    });
    this.$offers = this.appStore.select(fromOfferSelectors.getOffers).pipe(takeUntil(this.unsubscribe));
    this.appStore.select(fromOfferSelectors.getModal).pipe(takeUntil(this.unsubscribe)).subscribe(r => {
      if (r && this.user && this.user.type === 'business') {
        this.modal = this.modalService.open(this.content, {size: 'xl'});
        this.modal.result.finally(() => {
          this.appStore.dispatch(fromOfferActions.hideOffersModal());
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onChangeOffer(offer: string) {
    this.offersService.changeOffer(offer, this.user).subscribe(r => {
      this.modal.close();
    });
  }

}
