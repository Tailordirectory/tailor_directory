import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as fromSearchActions from '../actions/search.actions';
import * as fromSearchSelectors from '../selectors/search.selectors';
import * as businessListActions from '../actions/tailorsList.actions';
import * as businessProfileActions from '../actions/business-profile.actions';
import {debounceTime, map, switchMap, take} from 'rxjs/operators';
import {BusinessListState} from '../reducers/businessList.reducer';
import {Store} from '@ngrx/store';
import {SearchService} from '../../services/search.service';
import {AddressSearchModel, GeocodingSearchModel, SearchFilterModel} from '../../models/search.model';
import {BusinessProfileState} from '../reducers/business-profile.reducer';

@Injectable()
export class SearchEffects {

  constructor(
    private actions: Actions,
    private businessListState: Store<BusinessListState>,
    private businessProfileState: Store<BusinessProfileState>,
    private searchService: SearchService
  ) {
  }


  $loadTailors = createEffect(() => this.actions.pipe(
    ofType(fromSearchActions.loadResultsActions),
    take(1),
    debounceTime(500),
    switchMap(() => {
      return this.businessListState.select(fromSearchSelectors.getSearchSelector).pipe(switchMap(d => {
        const address: AddressSearchModel = {
          address: d.address,
          distance: d.distance,
          city: d.city,
          country: d.country
        };
        const filter: SearchFilterModel = {
          tags: d.tags,
          businessType: d.businessType
        };
        const geolocation: GeocodingSearchModel = {
          lat: d.lat,
          long: d.long
        };
        return this.searchService.findTailors(address, filter, geolocation).pipe(map((result) => {
          this.businessProfileState.dispatch(businessProfileActions.hideUserProfileStateAction());
          return (businessListActions.loadedTailorsList({list: (result) ? result.docs : []}));
        }));
      }));
    })
  ));

}
