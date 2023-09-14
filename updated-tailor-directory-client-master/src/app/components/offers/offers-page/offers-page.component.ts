import {Component, OnDestroy, ViewChild} from '@angular/core';
import {AppUserModel} from '../../../models/app-user.model';
import {Observable, Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OffersService} from '../../../services/offers.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../storage/selectors';
import * as fromUserSelectors from '../../../storage/selectors/user.selector';
import {takeUntil} from 'rxjs/operators';
import * as fromOfferSelectors from '../../../storage/selectors/offers.selector';

@Component({
  selector: 'app-offers-page',
  templateUrl: './offers-page.component.html',
  styleUrls: ['./offers-page.component.scss']
})
export class OffersPageComponent implements OnDestroy {

  user: AppUserModel;
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
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onChangeOffer(offer: string) {
    this.offersService.changeOffer(offer, this.user).subscribe(r => {
    });
  }

}
