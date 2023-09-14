import {Component, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {google} from 'google-maps';
import {Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../storage/selectors';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as fromSelectors from '../../storage/selectors/get-direction-address.selector';
import * as fromGeolocationSelectors from '../../storage/selectors/geolocation.selectors';
import * as fromActions from '../../storage/actions/direction-address.actions';
import {debounceTime, takeUntil, tap} from 'rxjs/operators';
import {BusinessModel} from '../../models/business.model';

@Component({
  selector: 'app-get-direction-address',
  templateUrl: './get-direction-address.component.html',
  styleUrls: ['./get-direction-address.component.scss']
})
export class GetDirectionAddressComponent implements OnDestroy {

  modal: NgbModalRef;
  addressList: string[] = [];
  autoComplete = new google.maps.places.AutocompleteService();
  geocoder: google.maps.Geocoder = new google.maps.Geocoder();
  direction: google.maps.LatLng | null;
  unsubscribe: Subject<void> = new Subject<void>();
  @ViewChild('content') content: Element;
  isAddressError: boolean;
  dType = 'driving';
  business: BusinessModel;
  addressForm: FormGroup = new FormGroup({
    autocomplete: new FormControl('', Validators.required),
  });

  constructor(
    private modalService: NgbModal,
    protected ngZone: NgZone,
    private appStore: Store<AppState>,
  ) {
    this.appStore.pipe(select(fromGeolocationSelectors.getGeolocationSelector), takeUntil(this.unsubscribe)).subscribe(geolocation => {
      if (geolocation.hasAccess) {
        const lat = geolocation.position?.coords.latitude as number;
        const lon = geolocation.position?.coords.longitude as number;
        this.direction = new google.maps.LatLng(lat, lon);
        const options = {
          location: this.direction,
        };
        this.geocoder.geocode(options, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === 'OK') {
            this.addressForm.get('autocomplete')?.setValue(results[0].formatted_address);
          }
        });
      }
    });
    this.appStore.pipe(select(fromSelectors.showDirectionAddressModalSelector), takeUntil(this.unsubscribe)).subscribe(s => {
      if (s.showModal) {
        this.ngZone.run(() => {
          this.business = s.business as BusinessModel;
          this.modal = this.modalService.open(this.content);
        });
      }
    });
    this.addressForm.get('autocomplete')?.valueChanges.pipe(
      debounceTime(200)).subscribe(r => {
      if (r === '') {
        this.direction = null;
        return;
      }
      this.geocoder.geocode({address: r}, results => {
        const place = results[0];
        this.direction = place.geometry.location;
      });
    });
  }

  onSelectAddressEvent($event: any) {
    if ($event === '') {
      this.addressList = [''];
      return;
    }
    const options = {
      input: $event
    };
    this.autoComplete.getPlacePredictions(options, (result: google.maps.places.AutocompletePrediction[], status: google.maps.places.PlacesServiceStatus) => {
      if (status === 'OK') {
        this.ngZone.run(() => {
          this.addressList = [];
          result.forEach((item) => {
            this.addressList.push(item.description);
          });
          if (this.addressList.length === 0) {
            this.addressList.push('');
          }
        });
      } else {
        this.addressList = [''];
      }
    });
  }

  onSetDType(type: string) {
    this.dType = type;
  }

  onSubmit() {
    this.addressForm.get('autocomplete')?.markAsTouched();
    if (this.addressForm.invalid || this.direction === null) {
      return;
    }
    this.appStore.dispatch(fromActions.hideDirectionAddressAction({dType: this.dType, direction: this.direction}));
    this.modal.close();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
