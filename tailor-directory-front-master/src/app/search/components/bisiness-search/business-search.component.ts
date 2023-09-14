import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SearchService} from '../../services/search.service';
import {select, Store} from '@ngrx/store';
import * as searchTailorListSelectors from '../../storage/selectors/tailor-list.selector';
import * as searchSelectors from '../../storage/selectors/search.selectors';
import * as fromTailorSearchActions from '../../storage/actions/search.actions';
import * as fromGeolocationSelectors from '../../../storage/selectors/geolocation.selectors';
import {AddressSearchModel, GeocodingSearchModel, SearchFilterModel} from '../../models/search.model';
import {google} from 'google-maps';
import {LanguageModel} from '../../../models/language.model';
import {SearchAppState} from '../../storage/selectors';
import {AppState} from '../../../storage/selectors';
import {SearchState} from '../../storage/reducers/search.reducer';
import {MapService} from '../../services/map.service';
import {combineLatest, Observable, Subject} from 'rxjs';
import {GeolocationState} from '../../../storage/reducers/geolocation.reducer';
import {takeUntil} from 'rxjs/operators';
import * as leftPanelSelectors from '../../storage/selectors/left-panel.selector';

@Component({
  selector: 'app-business-search',
  templateUrl: './business-search.component.html',
  styleUrls: ['./business-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessSearchComponent implements AfterViewInit, OnDestroy {

  @ViewChild('address') addressRef: ElementRef;
  @ViewChild('mapRef') gmap: ElementRef;
  isShowResult: boolean;
  zoom = 11;

  searchForm: FormGroup;
  language: LanguageModel;
  distanceList = [1, 2, 5, 10, 30];
  autoComplete: google.maps.places.Autocomplete;
  map: google.maps.Map;
  searchCoordinates: google.maps.LatLng;
  marker: google.maps.Marker;
  filter: SearchFilterModel;
  address$: Observable<SearchState>;
  getCurrentPosition$: Observable<GeolocationState>;
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private appStore: Store<AppState>,
    private searchStore: Store<SearchAppState>,
    private changeDetectorRef: ChangeDetectorRef,
    private mapService: MapService
  ) {
    this.searchForm = new FormGroup({
      distance: new FormControl(null, Validators.required),
      tags: new FormControl(null),
      address: new FormControl('', Validators.required),
    });
  }

  onClearDistance() {
    this.searchForm.get('distance')?.setValue(10);
  }

  onAddressPress() {
    setTimeout(() => {
      this.findTailors();
    }, 100);
  }

  findTailors() {
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
      const distance = this.searchForm.get('distance')?.value;
      const tags = this.searchForm.get('tags')?.value;
      const direction = {lat: place.geometry.location.lat(), long: place.geometry.location.lng()};
      const address: AddressSearchModel = this.getAddressModel(place);
      this.searchStore.dispatch(fromTailorSearchActions.setSearchDataAction({
        search: {
          country: address.country,
          city: address.city,
          address: address.address,
          tags,
          formattedAddress: place.formatted_address,
          distance
        }, direction
      }));
      this.getSearchData(direction);
    }
  }

  private getSearchData(direction: GeocodingSearchModel) {
    this.searchCoordinates = new google.maps.LatLng(direction.lat, direction.long);
    this.searchStore.dispatch(fromTailorSearchActions.loadResultsActions());
  }

  // Getting country, city, street and number from search form.
  private getAddressModel(result: google.maps.places.PlaceResult | google.maps.GeocoderResult): AddressSearchModel {
    let stretNumber = '';
    let address = '';
    let city = '';
    let country = '';
    result.address_components?.forEach(item => {
      if (item.types.includes('street_number')) {
        stretNumber = item.long_name;
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
      address: `${address} ${stretNumber}`,
      city,
      country,
    };
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.autoComplete = new google.maps.places.Autocomplete(this.addressRef.nativeElement);
    combineLatest(this.address$, this.getCurrentPosition$).subscribe(result => {
      const address: SearchState = result[0];
      const geolocation: GeolocationState = result[1];
      if (address) {
        this.filter = {businessType: address.businessType, tags: address.tags};
        this.searchForm.get('address')?.setValue(address.formattedAddress);
        this.searchForm.get('distance')?.setValue(address.distance);
        this.searchForm.get('tags')?.setValue(address.tags);
        if (address.lat && address.long) {
          this.searchForm.get('address')?.setValue(address.formattedAddress);
          const markerPosition = new google.maps.LatLng(address.lat, address.long);
          this.mapService.clearMarkers();
          this.mapService.clearDirection();
          if (address.address.replace(/ +?/g, '').length > 0) {
            if (!this.marker) {
              this.marker = new google.maps.Marker({map: this.map, position: markerPosition});
            } else {
              this.marker.setPosition(markerPosition);
              this.marker.setMap(this.map);
            }
          } else {
            if (!!this.marker) {
              this.marker.setMap(null);
            }
          }
          this.map.setCenter(markerPosition);
        } else {
          if (geolocation.hasAccess && geolocation.position) {
            const position = geolocation.position;
            const cords = position.coords;
            const g = new google.maps.Geocoder();
            const request: google.maps.GeocoderRequest = {
              location: new google.maps.LatLng(cords.latitude, cords.longitude)
            };
            g.geocode(request, (res) => {
              this.onSuccessSearch(res[0]);
            });
          }
        }
      }
    });
    this.searchStore.pipe(select(searchTailorListSelectors.tailorsListSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(listState => {
      if (listState.isLoaded) {
        this.map.setZoom(this.zoom);
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  private initMap() {
    this.searchStore.pipe(select(leftPanelSelectors.getPanelSelector), takeUntil(this.unsubscribe)).subscribe(r => {
      this.isShowResult = r;
      this.changeDetectorRef.detectChanges();
    });
    this.address$ = this.searchStore.pipe(select(searchSelectors.getSearchSelector)).pipe(takeUntil(this.unsubscribe));
    this.getCurrentPosition$ = this.appStore.pipe(select(fromGeolocationSelectors.getGeolocationSelector)).pipe(takeUntil(this.unsubscribe));
    const coordinates = new google.maps.LatLng(52.52000659999999, 13.404954);
    const mapOptions: google.maps.MapOptions = {
      center: coordinates,
      zoom: 5,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      gestureHandling: 'cooperative'
    };
    this.map = this.mapService.initMap(this.gmap, mapOptions);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
