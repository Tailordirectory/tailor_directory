import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, MinLengthValidator, Validators} from '@angular/forms';
import {AppAuthService} from '../../../services/auth.service';
import {Observable, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../storage/selectors';
import * as languageSelectors from '../../../storage/selectors/language.selector';
import * as businessTypesSelector from '../../../storage/selectors/business-type.selector';
import {LanguageModel} from '../../../models/language.model';
import {google} from 'google-maps';
import {SignUpBusinessRequestModel} from '../../../models/sign-up-request.model';
import {debounceTime, takeUntil, tap} from 'rxjs/operators';
import {CountryISO, SearchCountryField, TooltipLabel} from 'ngx-intl-tel-input';
import {BusinessTypesModel} from '../../../models/business-types.model';

@Component({
  selector: 'app-sign-up-business',
  templateUrl: './sign-up-business.component.html',
  styleUrls: ['./sign-up-business.component.scss'],
})
export class SignUpBusinessComponent implements AfterViewInit, OnDestroy {

  showOwnerForm = true;
  $businessTypes: Observable<BusinessTypesModel[]>;
  language: LanguageModel;
  map: google.maps.Map;
  marker: google.maps.Marker = new google.maps.Marker();
  geocoder: google.maps.Geocoder = new google.maps.Geocoder();
  autoComplete = new google.maps.places.AutocompleteService();
  addressList: string[] = [];
  isAddressLoading = false;
  direction: { lat: number, long: number };
  @ViewChild('signMapRef') signMapRef: ElementRef;
  isAddressError = false;
  @Output('onClose') onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('callback') callback: (() => void) | null;
  unsubscribe: Subject<void> = new Subject<void>();
  SearchCountryField = SearchCountryField;
  preferredCountries: CountryISO[] = [CountryISO.Germany, CountryISO.Swaziland, CountryISO.Austria];
  countryShortName: string;
  TooltipLabel = TooltipLabel;

  ownerForm: FormGroup = new FormGroup({
    companyName: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(''),
  });
  businessForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl(null, Validators.required),
    autocomplete: new FormControl('', Validators.required),
    country: new FormControl({value: '', disabled: true}),
    city: new FormControl({value: '', disabled: true}),
    address: new FormControl({value: '', disabled: true}),
    building: new FormControl({value: '', disabled: true}),
    zip: new FormControl('', Validators.required),
  });

  constructor(
    private authService: AppAuthService,
    private dc: ChangeDetectorRef,
    private appStore: Store<AppState>) {
    this.$businessTypes = this.appStore.pipe(select(businessTypesSelector.getListSelector)).pipe(takeUntil(this.unsubscribe));
    this.ownerForm.get('confirmPassword')?.setValidators((control: AbstractControl) => {
      const password = this.ownerForm.get('password')?.value;
      const confirm = control.value;
      if (confirm === '') {
        return {required: true};
      }
      if (password !== confirm) {
        return {confirm: true};
      }
      return null;
    });
    this.businessForm.get('autocomplete')?.valueChanges.pipe(
      tap(d => this.isAddressLoading = true),
      debounceTime(200)).subscribe(r => {
      if (r === '') {
        this.onSuccessSearch(null);
        this.isAddressLoading = false;
        this.dc.detectChanges();
        return;
      }
      this.geocoder.geocode({address: r}, results => {
        const place = results[0];
        this.onSuccessSearch(place);
        this.isAddressLoading = false;
        this.dc.detectChanges();
      });
    });
  }

  onSubmit() {
    Object.keys(this.ownerForm.controls).forEach(key => {
      this.ownerForm.controls[key].markAsTouched();
    });
    Object.keys(this.businessForm.controls).forEach(key => {
      this.businessForm.controls[key].markAsTouched();
    });
    if (this.ownerForm.invalid || this.businessForm.invalid || this.isAddressLoading) {
      return;
    }
    this.onSendData();
  }

  private onSuccessSearch(place: google.maps.GeocoderResult | null) {
    this.isAddressError = false;
    if (place && place.geometry && place.formatted_address) {
      this.direction = {lat: place.geometry.location.lat(), long: place.geometry.location.lng()};
      const address = this.getAddressModel(place);
      this.businessForm.get('country')?.setValue(address.country);
      this.businessForm.get('city')?.setValue(address.city);
      this.businessForm.get('address')?.setValue(address.address);
      this.businessForm.get('building')?.setValue(address.streetNumber);
      const zipControl = this.businessForm.get('zip');
      if (zipControl?.value === '') {
        zipControl.setValue(address.zip);
      }
      if (!address.streetNumber || address.streetNumber.replace(/ +?/g, '').length === 0) {
        this.isAddressError = true;
        return;
      }
      this.marker.setPosition(place.geometry.location);
      this.marker.setMap(this.map);
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(17);
    } else {
      this.businessForm.get('country')?.setValue('');
      this.businessForm.get('city')?.setValue('');
      this.businessForm.get('address')?.setValue('');
      this.businessForm.get('building')?.setValue('');
      this.marker.setMap(null);
      this.map.setZoom(5);
    }
  }

  private onSendData() {
    if (this.isAddressError) {
      return;
    }
    const owner = this.ownerForm.getRawValue();
    const business = this.businessForm.getRawValue();
    const requestData: SignUpBusinessRequestModel = {
      phone: {
        countryCode: owner.phone.dialCode,
        countryIsoCode: owner.phone.countryCode,
        phone: owner.phone.number.replace(/ +?/g, '')
      },
      companyName: owner?.companyName,
      firstName: owner?.firstName,
      lastName: owner?.lastName,
      email: owner?.email,
      password: owner?.password,
      businessName: business.name,
      businessTypeId: business.type,
      country: business.country,
      city: business.city,
      address: business.address + ', ' + business.building,
      zipCode: business.zip,
      location: {
        type: 'Point',
        coordinates: [this.direction.long, this.direction.lat]
      }
    };
    this.authService.signUpBusiness(requestData).subscribe((result: boolean) => {
      if (result) {
        this.businessForm.reset();
        this.ownerForm.reset();
        if (this.callback) {
          this.callback();
        }
        this.onClose.emit(true);
      }
    });
  }

  // Getting country, city, street and number from search form.
  private getAddressModel(result: google.maps.GeocoderResult): { streetNumber: string, address: string, city: string, country: string, zip: string } {
    let streetNumber = '';
    let address = '';
    let city = '';
    let country = '';
    let zip = '';
    this.countryShortName = '';
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
        this.countryShortName = item.short_name;
      }
      if (item.types.includes('postal_code')) {
        zip = item.long_name;
      }
    });
    return {
      streetNumber,
      address,
      city,
      country,
      zip
    };
  }

  onShowBusinessForm() {
    this.showOwnerForm = false;
  }

  onShowOwnerForm() {
    this.showOwnerForm = true;
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
        this.addressList = [];
        result.forEach((item) => {
          this.addressList.push(item.description);
        });
        if (this.addressList.length === 0) {
          this.addressList.push('');
        }
        this.dc.detectChanges();
      } else {
        this.addressList = [''];
      }
    });
  }

  ngAfterViewInit(): void {
    this.onShowOwnerForm();
    this.appStore.pipe(select(languageSelectors.getLanguageSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(language => {
      this.language = language.current;
    });
    const coordinates = new google.maps.LatLng(52.52000659999999, 13.404954);
    const mapOptions: google.maps.MapOptions = {
      center: coordinates,
      zoom: 5,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      gestureHandling: 'cooperative'
    };
    this.map = new google.maps.Map(this.signMapRef.nativeElement, mapOptions);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
