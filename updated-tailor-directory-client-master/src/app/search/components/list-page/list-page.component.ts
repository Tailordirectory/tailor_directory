import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {AppState} from '../../../storage/selectors';
import {google} from 'google-maps';
import {SearchState} from '../../storage/reducers/search.reducer';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TagsModel} from '../../../models/tags.model';
import {TranslateService} from '@ngx-translate/core';
import {map, takeUntil, tap} from 'rxjs/operators';
import * as businessTypesSelector from '../../../storage/selectors/business-type.selector';
import {AddressSearchModel, GeocodingSearchModel, SearchFilterModel} from '../../models/search.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../services/search.service';
import {BusinessModel} from '../../../models/business.model';
import {BusinessResponseModel} from '../../../models/business-response.model';
import {BusinessTypesModel} from '../../../models/business-types.model';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnDestroy, AfterViewInit {

  resultList: BusinessModel[];
  autoComplete: google.maps.places.Autocomplete;
  searchState: SearchState;
  searchForm: FormGroup = new FormGroup({
    address: new FormControl('', Validators.required),
    distance: new FormControl('10'),
    businessType: new FormControl(null),
    tags: new FormControl([]),
    pageCount: new FormControl('20')
  });
  $businessTypes: Observable<BusinessTypesModel[]>;
  tags: TagsModel[] = [];
  results = '';
  page = 1;
  pageCount = '20';
  unsubscribe: Subject<void> = new Subject<void>();
  searchCoordinates: google.maps.LatLng;
  distanceList = [1, 2, 5, 10, 30];
  total: number;
  private geocoder: google.maps.Geocoder = new google.maps.Geocoder();
  @ViewChild('address') addressRef: ElementRef;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private appStore: Store<AppState>,
    private searchService: SearchService,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.$businessTypes = this.appStore.pipe(select(businessTypesSelector.getListSelector)).pipe(takeUntil(this.unsubscribe));
  }

  findBusiness() {
    if (this.searchForm.invalid) {
      return;
    }
    const place: google.maps.places.PlaceResult = this.autoComplete.getPlace();
    if (place && place.geometry && place.formatted_address) {
      this.onSuccessSearch(place);
    } else {
      const geocoder = new google.maps.Geocoder();
      const geoRequest: google.maps.GeocoderRequest = {
        address: this.searchForm.get('address')?.value,
        region: 'EU'
      };
      geocoder.geocode(geoRequest, ((results, status) => {
        if (status === 'OK' && results.length > 0) {
          const result: google.maps.GeocoderResult = results[0];
          this.onSuccessSearch(result);
        }
      }));
    }
  }

  private onSuccessSearch(place: google.maps.GeocoderResult | google.maps.places.PlaceResult) {
    if (place && place.geometry && place.formatted_address) {
      const formData = this.searchForm.getRawValue();
      const direction = {lat: place.geometry.location.lat(), long: place.geometry.location.lng()};
      const qp = {};
      Object.assign(qp, {d: formData.distance});
      Object.assign(qp, {t: formData.tags});
      Object.assign(qp, {bt: formData.businessType});
      Object.assign(qp, {a: place.formatted_address});
      Object.assign(qp, {lt: direction.lat});
      Object.assign(qp, {ln: direction.long});
      Object.assign(qp, {c: formData.pageCount});
      Object.assign(qp, {p: (formData.pageCount === this.pageCount) ? this.page : 1});
      this.ngZone.run(() => {
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: qp,
            queryParamsHandling: 'merge',
          });
      });
    }
  }

  // Getting country, city, street and number from search form.
  private getAddressModel(result: google.maps.places.PlaceResult | google.maps.GeocoderResult): AddressSearchModel {
    let streetNumber = '';
    let address = '';
    let city = '';
    let country = '';
    result.address_components?.forEach(item => {
      if (item.types.includes('street_number')) {
        streetNumber = item.long_name;
      }
      if (item.types.includes('route')) {
        address = item.long_name;
      }
      if (item.types.includes('locality')) {
        city = item.long_name;
      }
      if (item.types.includes('country')) {
        country = item.long_name;
      }
    });
    return {
      distance: this.searchForm.get('distance')?.value,
      address: `${address} ${streetNumber}`,
      city,
      country,
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.autoComplete = new google.maps.places.Autocomplete(this.addressRef.nativeElement);
    this.route.queryParams.subscribe(p => {
        const pageCount = this.searchForm.get('pageCount')?.value;
        const filter: SearchFilterModel = {
          businessType: '',
          tags: []
        };
        if (p.c) {
          this.pageCount = pageCount;
          this.searchForm.get('pageCount')?.setValue(p.c);
        }
        if (p.p) {
          this.page = parseInt(p.p, 10);
        } else {
          this.page = 1;
        }
        if (p.d) {
          this.searchForm.get('distance')?.setValue(p.d);
        }
        if (p.t) {
          this.searchForm.get('tags')?.setValue((typeof p.t === 'string') ? [p.t] : p.t);
          Object.assign(filter, {tags: this.searchForm.get('tags')?.value});
        }
        if (p.bt) {
          this.searchForm.get('businessType')?.setValue(p.bt);
          Object.assign(filter, {businessType: this.searchForm.get('businessType')?.value});
        }
        this.changeDetectorRef.detectChanges();
        if (p.lt && p.ln) {
          this.searchCoordinates = new google.maps.LatLng(parseFloat(p.lt), parseFloat(p.ln));
          if (this.searchForm.get('address')?.value === '') {
            this.findByCoordinates((result: google.maps.GeocoderResult) => {
              if (p.a) {
                this.searchForm.get('address')?.setValue(p.a);
              } else {
                this.searchForm.get('address')?.setValue(result.formatted_address);
              }
              const address: AddressSearchModel = this.getAddressModel(result);
              this.getBusinessList(address, filter, {lat: p.lt, long: p.ln});
            });
          } else {
            const place: google.maps.places.PlaceResult = this.autoComplete.getPlace();
            if (place) {
              const address: AddressSearchModel = this.getAddressModel(place);
              this.getBusinessList(address, filter, {lat: p.lt, long: p.ln});
            } else {
              this.findByCoordinates((result: google.maps.GeocoderResult) => {
                const address: AddressSearchModel = this.getAddressModel(result);
                this.getBusinessList(address, filter, {lat: p.lt, long: p.ln});
              });
            }
          }
        }
      }
    );
  }

  findByCoordinates(callback: ((result: google.maps.GeocoderResult) => void)) {
    this.geocoder.geocode({location: this.searchCoordinates}, ((results, status) => {
      callback(results[0]);
    }));
  }

  private getBusinessList(address: AddressSearchModel, filter: SearchFilterModel, geolocation: GeocodingSearchModel) {
    const pageCount = this.searchForm.get('pageCount')?.value;
    this.searchService.findBusiness(address, filter, geolocation, this.page, parseInt(pageCount, 10)).pipe(tap(r => {
      this.results = '';
      if (r) {
        this.pageCount = pageCount;
        this.total = r.total;
        if (r.total === 1) {
          this.translate.get('search_results.found_one_result').subscribe(t => this.results = t);
        } else {
          this.translate.get('search_results.found_results', {results: r.total}).subscribe(t => this.results = t);
        }
      }
      this.changeDetectorRef.detectChanges();
    }), map((r: BusinessResponseModel | null) => {
      if (r !== null) {
        return r.docs;
      } else {
        return [];
      }
    })).subscribe((list: BusinessModel[]) => {
      this.resultList = list;
      this.changeDetectorRef.detectChanges();
    });
  }

  onSelectTagsAll() {
    const tagsList: string[] = this.tags.map(r => {
      return r._id;
    });
    this.searchForm.get('tags')?.setValue(tagsList);
  }

  onClearTagsAll() {
    this.searchForm.get('tags')?.setValue([]);
  }

  onClearDistance() {
    this.searchForm.get('distance')?.setValue(10);
  }

}
