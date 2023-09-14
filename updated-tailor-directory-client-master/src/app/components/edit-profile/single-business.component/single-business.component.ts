import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {BusinessModel} from '../../../models/business.model';
import {State, Store} from '@ngrx/store';
import {AppState} from '../../../storage/selectors';
import {showOffersModal} from '../../../storage/actions/offers.action';

@Component({
  selector: 'app-single-business-profile',
  templateUrl: './single-business.component.html',
  styleUrls: ['./single-business.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditSingleBusinessProfileComponent {

  submit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('ownerId') ownerId: string;
  @Input('business') business: BusinessModel;
  @Output('getBusiness') getBusiness: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private appStore: Store<AppState>,
  ) {
  }

  onAddNewBusiness() {
    this.appStore.dispatch(showOffersModal());
  }

  onSubmit() {
    this.submit.next(false);
  }

  onSubmitAndPreview() {
    this.submit.next(true);
  }
}
