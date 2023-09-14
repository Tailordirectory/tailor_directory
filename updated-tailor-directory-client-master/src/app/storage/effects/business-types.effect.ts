import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {BusinessTypesService} from '../../services/business-types.service';
import * as formActions from '../actions/business-type.actions';
import {map, switchMap} from 'rxjs/operators';

@Injectable()
export class BusinessTypesEffect {

  constructor(
    private actions: Actions,
    private businessTypesService: BusinessTypesService
  ) {
  }

  $businessList = createEffect(() => this.actions.pipe(
    ofType(formActions.loadBusinessTypeAction),
    switchMap(() => this.businessTypesService.getList().pipe(map(d => {
      return (formActions.loadedBusinessTypeAction({list: d}));
    })))));
}
