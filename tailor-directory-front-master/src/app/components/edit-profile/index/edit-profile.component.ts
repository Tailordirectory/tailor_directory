import {Component, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../storage/selectors';
import * as fromUserSelectors from '../../../storage/selectors/user.selector';
import {Observable, Subject} from 'rxjs';
import {AppUserModel} from '../../../models/app-user.model';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-eidt-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnDestroy {

  user$: Observable<AppUserModel | null>;
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private appState: Store<AppState>,
  ) {
    this.user$ = this.appState.pipe(select(fromUserSelectors.getUserSelector)).pipe(takeUntil(this.unsubscribe));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
