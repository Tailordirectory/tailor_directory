import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as fromActions from '../actions/offers.action';
import {State} from '@ngrx/store';
import {AppState} from '../selectors';
import {OffersService} from '../../services/offers.service';
import {map, switchMap} from 'rxjs/operators';

@Injectable()
export class OffersEffect {

  constructor(
    private actions: Actions,
    private appState: State<AppState>,
    private offersService: OffersService
  ) {
  }

  loadOffersEffect$ = createEffect(() =>
    this.actions.pipe(ofType(fromActions.loadOffers),
      switchMap(() => this.offersService.loadOffers().pipe(
        map(m => (fromActions.loadedOffers({accounts: m})))))));
}
