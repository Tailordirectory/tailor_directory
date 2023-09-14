import {Component, Input, OnDestroy} from '@angular/core';
import {google} from 'google-maps';
import {select, Store} from '@ngrx/store';
import {SearchAppState} from '../../storage/selectors';
import {AppState} from '../../../storage/selectors';
import * as businessTypesSelector from '../../../storage/selectors/business-type.selector';
import * as searchBusinessListSelectors from '../../storage/selectors/business-list.selector';
import {map, takeUntil, tap} from 'rxjs/operators';
import * as searchSelectors from '../../storage/selectors/search.selectors';
import {SearchState} from '../../storage/reducers/search.reducer';
import {Observable, Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {TagsModel} from '../../../models/tags.model';
import * as searchActions from '../../storage/actions/search.actions';
import {TranslateService} from '@ngx-translate/core';
import {BusinessModel} from '../../../models/business.model';
import {BusinessTypesModel} from '../../../models/business-types.model';

@Component({
  selector: 'app-business-result-list',
  templateUrl: './business-result.component.html',
  styleUrls: ['./business-result.component.scss']
})
export class BusinessResultComponent implements OnDestroy {

  resultList$: Observable<BusinessModel[]>;
  map: google.maps.Map;
  searchState: SearchState;
  filterForm: FormGroup = new FormGroup({
    distance: new FormControl('10'),
    businessType: new FormControl(null),
    tags: new FormControl([]),
  });
  $businessTypes: Observable<BusinessTypesModel[]>;
  tags: TagsModel[];
  results = '';
  unsubscribe: Subject<void> = new Subject<void>();
  distanceList = [1, 2, 5, 10, 30];

  @Input('map')
  private set setMap(mainMap: google.maps.Map) {
    this.map = mainMap;
  }

  constructor(
    private searchStore: Store<SearchAppState>,
    private appStore: Store<AppState>,
    private translate: TranslateService,
  ) {
    this.$businessTypes = appStore.pipe(select(businessTypesSelector.getListSelector)).pipe(takeUntil(this.unsubscribe));
    this.resultList$ = searchStore.pipe(select(searchBusinessListSelectors.businessListSelector)).pipe(
      takeUntil(this.unsubscribe),
      map(data => data.businessList),
      tap(list => {
        this.results = '';
        if (list.length === 1) {
          this.translate.get('search_results.found_one_result').subscribe(r => this.results = r);
          return;
        }
        this.translate.get('search_results.found_results', {results: list.length}).subscribe(r => this.results = r);
      })
    );

    this.searchStore.pipe(select(searchSelectors.getSearchSelector)).pipe(takeUntil(this.unsubscribe)).subscribe((state: SearchState) => {
      this.searchState = state;
      this.filterForm.get('distance')?.setValue(state.distance);
      this.filterForm.get('businessType')?.setValue((state.businessType) ? state.businessType : null);
      this.filterForm.get('tags')?.setValue(state.tags);
    });
  }

  onUpdateFilter() {
    const formData = this.filterForm.getRawValue();
    this.searchStore.dispatch(searchActions.updateFilterAction({
      filter: {
        tags: formData.tags,
        businessType: formData.businessType,
        distance: formData.distance + ''
      }
    }));
    this.searchStore.dispatch(searchActions.loadResultsActions());
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onClearDistance() {
    this.filterForm.get('distance')?.setValue(10);
  }
}
