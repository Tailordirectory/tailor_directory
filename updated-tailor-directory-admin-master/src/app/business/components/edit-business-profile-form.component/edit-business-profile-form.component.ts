import {google} from 'google-maps';
import {BusinessModel, PhoneModel} from '../../../models/business.model';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {TagsModel} from '../../../models/tags.model';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {CountryISO, SearchCountryField, TooltipLabel} from 'ngx-intl-tel-input';
import {BusinessService} from '../../../services/business.service';
import {GeocodingService} from '../../../services/geocoding.service';
import {NotificationService} from '../../../services/notification.service';
import {debounceTime, takeUntil, tap, map, catchError} from 'rxjs/operators';
import {AppAuthService} from "../../../services/app-auth.service";
import {UpdateBusinessRequestModel} from "../../../models/update-business-profile.model";
import {Router} from "@angular/router";
import {BusinessTypesService} from "../../../services/business-types.service";
import {TagsService} from "../../../services/tags.service";
import {BusinessTypesModel} from "../../../models/business-types.model";

@Component({
  selector: 'app-edit-business-form',
  templateUrl: './edit-business-profile-form.component.html',
  styleUrls: ['./edit-business-profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditBusinessProfileFormComponent implements AfterViewInit, OnDestroy {
  @Output('onSuccess') onSuccess: EventEmitter<void> = new EventEmitter();

  @Input('business') business: BusinessModel | null;

  @Input('ownerId') ownerId: string;

  @Input('onSubmit') submit: EventEmitter<boolean>;

  autoComplete = new google.maps.places.AutocompleteService();
  isAddressError = false;
  businessAddress: string;
  private logoFormData = new FormData();
  private galleryFormData = new FormData();
  isEdit: boolean;
  private redirectToPreview: boolean;
  businessForm: FormGroup = new FormGroup({
    groupName: new FormControl(''),
    businessName: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    country: new FormControl({value: '', disabled: true}, Validators.required),
    city: new FormControl({value: '', disabled: true}, Validators.required),
    address: new FormControl({value: '', disabled: true}, Validators.required),
    autocomplete: new FormControl('', [Validators.required]),
    zip: new FormControl(''),
    website: new FormControl(''),
    email: new FormControl('', Validators.email),
    phones: new FormArray([new FormGroup({phone: new FormControl('')})]),
    startTime: new FormControl(''),
    endTime: new FormControl('')
  });
  contactForm: FormGroup = new FormGroup({
    contactName: new FormControl(''),
    contactPhone: new FormControl(''),
  });
  serviceForm: FormGroup = new FormGroup({
    businessDescription: new FormControl(''),
    listOfServices: new FormControl(''),
    science: new FormControl(''),
    businessCount: new FormControl(''),
    speciality: new FormControl(''),
    typeOfProducts: new FormControl(''),
  });
  socialMediaForm: FormGroup = new FormGroup({
    facebook: new FormControl('', this.socialMediaValidators(new RegExp(/(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i))),
    instagram: new FormControl('', this.socialMediaValidators(new RegExp(/(https?)?:?(www)?instagram\.com\//ig))),
    linkedIn: new FormControl('', this.socialMediaValidators(new RegExp(/http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?/ig)))
  });
  $businessTypes: Observable<BusinessTypesModel[]>;
  signMapRef: HTMLElement;
  unsubscribe: Subject<void> = new Subject<void>();
  addressList: string[] = [];
  isAddressLoading = false;
  map: google.maps.Map;
  marker: google.maps.Marker = new google.maps.Marker();
  geocoder: google.maps.Geocoder = new google.maps.Geocoder();
  direction: { lat: number, long: number };
  TooltipLabel = TooltipLabel;
  SearchCountryField = SearchCountryField;
  preferredCountries: CountryISO[] = [CountryISO.Germany, CountryISO.Switzerland, CountryISO.Austria];
  countryShortName: string;

  constructor(
    private businessService: BusinessService,
    private businessTypesService: BusinessTypesService,
    private tagsService: TagsService,
    private geocodingService: GeocodingService,
    private notificationService: NotificationService,
    private authService: AppAuthService,
    private cdf: ChangeDetectorRef,
    private router: Router
  ) {
    this.$businessTypes = this.businessTypesService.getList();
    this.businessForm.get('autocomplete')?.valueChanges.pipe(
      tap(d => this.isAddressLoading = true),
      debounceTime(200)).subscribe(r => {
      if (r === '') {
        this.onSuccessSearch(null);
        this.isAddressLoading = false;
        this.cdf.detectChanges();
        return;
      }
      this.geocoder.geocode({address: r}, results => {
        const place = results[0];
        this.onSuccessSearch(place);
        this.isAddressLoading = false;
        this.cdf.detectChanges();
      });
    });
  }

  getBusiness() {
    if (this.business) {
      const business = this.business;
      this.businessAddress = business.address + ', ' + business.city + ', ' + business.country;
      this.businessForm.get('businessName')?.setValue(business.businessName);
      this.businessForm.get('groupName')?.setValue(business.groupName);
      this.businessForm.get('type')?.setValue(business.businessTypeId._id);
      this.businessForm.get('country')?.setValue(business.country);
      this.businessForm.get('city')?.setValue(business.city);
      this.businessForm.get('autocomplete')?.setValue(this.businessAddress);
      this.businessForm.get('address')?.setValue(business.address);
      this.businessForm.get('zip')?.setValue(business.zipCode);
      this.businessForm.get('website')?.setValue(business.website);
      this.businessForm.get('email')?.setValue(business.email);
      this.setPhones(business.phones);
      if (business.workTime) {
        if (business.workTime.start) {
          const startTime = new Date();
          startTime.setHours(business.workTime.start.h);
          startTime.setMinutes(business.workTime.start.m);
          this.businessForm.get('startTime')?.setValue(startTime);
        }
        if (business.workTime.end) {
          const endTime = new Date();
          endTime.setHours(business.workTime.end.h);
          endTime.setMinutes(business.workTime.end.m);
          this.businessForm.get('endTime')?.setValue(endTime);
        }
      }
      this.contactForm.get('contactName')?.setValue(business.contactName);
      if (business.contactPhone) {
        this.contactForm.get('contactPhone')?.setValue(business.contactPhone.phone);
      }
      this.serviceForm.get('businessDescription')?.setValue(business.description);
      this.serviceForm.get('listOfServices')?.setValue(this.onSetBusinessTags(business.tags));
      this.serviceForm.get('science')?.setValue(business.establishedSince);
      this.serviceForm.get('businessCount')?.setValue(business.numberOfBusiness);
      this.serviceForm.get('speciality')?.setValue(business.speciality);
      this.serviceForm.get('typeOfProducts')?.setValue(business.typeOfProducts);
      this.socialMediaForm.get('facebook')?.setValue(business.facebookProfile);
      this.socialMediaForm.get('instagram')?.setValue(business.instagramProfile);
      this.socialMediaForm.get('linkedIn')?.setValue(business.linkedInProfile);
    }
  }

  onAddPhone() {
    const control = this.businessForm.controls?.phones as FormArray;
    control.controls?.push(new FormGroup({phone: new FormControl('')}));
    this.cdf.detectChanges();
  }

  deletePhone(index: number) {
    const control = this.businessForm.controls?.phones as FormArray;
    if (control.length === 1) {
      return;
    }
    control.removeAt(index);
    this.cdf.detectChanges();
  }

  private setPhones(phones: PhoneModel[] | undefined) {
    const arr = this.businessForm.get('phones') as FormArray;
    while (arr.controls.length > 0) {
      arr.removeAt(0);
    }
    if (!phones || phones.length === 0) {
      arr.push(new FormGroup({phone: new FormControl(undefined)}));
    } else {
      phones?.forEach(p => {
        arr.push(new FormGroup({phone: new FormControl(p.phone)}));
      });
    }
  }

  onSubmit() {
    Object.keys(this.socialMediaForm.controls).forEach(key => {
      this.socialMediaForm.controls[key].markAsTouched();
    });
    Object.keys(this.businessForm.controls).forEach(key => {
      this.businessForm.controls[key].markAsTouched();
    });
    Object.keys(this.serviceForm.controls).forEach(key => {
      this.serviceForm.controls[key].markAsTouched();
    });
    this.saveProfile();
  }

  private saveProfile() {
    if (this.businessForm.invalid || this.serviceForm.invalid || this.socialMediaForm.invalid || this.isAddressError) {
      return;
    }
    const businessForm = this.businessForm.getRawValue();
    const contactForm = this.contactForm.getRawValue();
    const servicesForm = this.serviceForm.getRawValue();
    const socialMediaForm = this.socialMediaForm.getRawValue();
    const startTime = (businessForm.startTime && businessForm.startTime !== '') ? new Date(businessForm.startTime) : null;
    const endTime = (businessForm.endTime && businessForm.endTime !== '') ? new Date(businessForm.endTime) : null;
    const business: UpdateBusinessRequestModel = {
      businessName: businessForm.businessName,
      businessTypeId: businessForm.type,
      country: businessForm.country,
      city: businessForm.city,
      address: businessForm.address,
      facebookProfile: socialMediaForm.facebook,
      instagramProfile: socialMediaForm.instagram,
      linkedInProfile: socialMediaForm.linkedIn,
    };
    if (this.business?.restrictions?.multiple_stores) {
      Object.assign(business, {groupName: businessForm.groupName});
    }
    if (this.business?._id) {
      Object.assign(business, {id: this.business?._id});
    }
    if (this.business?.facebookProfile !== socialMediaForm.facebook) {
      Object.assign(business, {facebookProfile: socialMediaForm.facebook});
    }
    if (this.business?.instagramProfile !== socialMediaForm.instagram) {
      Object.assign(business, {instagramProfile: socialMediaForm.instagram});
    }
    if (this.business?.linkedInProfile !== socialMediaForm.linkedIn) {
      Object.assign(business, {linkedInProfile: socialMediaForm.linkedIn});
    }
    if (businessForm.zip) {
      Object.assign(business, {zipCode: businessForm.zip});
    }
    if (businessForm.website) {
      Object.assign(business, {website: businessForm.website});
    }
    if (businessForm.email) {
      Object.assign(business, {email: businessForm.email});
    }
    if (servicesForm.businessDescription) {
      Object.assign(business, {description: servicesForm.businessDescription});
    }
    if (servicesForm.listOfServices) {
      Object.assign(business, {tags: servicesForm.listOfServices});
    }
    if (servicesForm.science) {
      Object.assign(business, {establishedSince: servicesForm.science});
    }
    if (servicesForm.businessCount) {
      Object.assign(business, {numberOfBusiness: servicesForm.businessCount});
    }
    if (servicesForm.speciality) {
      Object.assign(business, {speciality: servicesForm.speciality});
    }
    if (servicesForm.typeOfProducts) {
      Object.assign(business, {typeOfProducts: servicesForm.typeOfProducts});
    }
    if (this.direction) {
      const location = {
        type: 'Point',
        coordinates: [this.direction.long, this.direction.lat]
      };
      Object.assign(business, {location});
    }
    if (contactForm.contactPhone) {
      const cPhone = {
        countryCode: contactForm.contactPhone.dialCode,
        countryIsoCode: contactForm.contactPhone.countryCode,
        phone: contactForm.contactPhone.number.replace(/ +?/g, '')
      };
      Object.assign(business, {contactPhone: cPhone});
    }
    if (contactForm.contactName) {
      Object.assign(business, {contactName: contactForm.contactName});
    }
    if (businessForm.phones) {
      const phonesArr: PhoneModel[] = [];
      const phones = this.businessForm.get('phones') as FormArray;
      phones.controls.forEach(phone => {
        if (phone.get('phone')?.value) {
          const p = phone.get('phone')?.value;
          phonesArr.push({
            countryCode: p.dialCode,
            countryIsoCode: p.countryCode,
            phone: p.number.replace(/ +?/g, '')
          });
        }
      });
      if (phonesArr.length > 0) {
        Object.assign(business, {phones: phonesArr});
      }
    }
    if (startTime || endTime) {
      const time = {
        start: (startTime) ? {h: startTime.getHours(), m: startTime.getMinutes()} : null,
        end: (endTime) ? {h: endTime.getHours(), m: endTime.getMinutes()} : null,
      };
      Object.assign(business, {workTime: time});
    }
    if (this.isEdit && this.business) {
      Object.assign(business, {_id: this.business._id});
      this.businessService.editBusiness(business).subscribe(result => {
        this.notificationService.notify('edit_business_form.successfully_updated', 'success');
        this.onSuccess.emit();
      });
    } else {
      Object.assign(business, {ownerId: this.ownerId});
      this.businessService.addNew(business).subscribe(r => {
        if (this.redirectToPreview) {
          this.router.navigate(['/business']);
          this.onSuccess.emit();
        } else {
          this.notificationService.notify('edit_business_form.successfully_added', 'success');
          this.onSuccess.emit();
        }
      });
    }
  }

  private onSuccessSearch(place: google.maps.GeocoderResult | null) {
    this.isAddressError = false;
    if (place && place.geometry && place.formatted_address) {
      this.direction = {lat: place.geometry.location.lat(), long: place.geometry.location.lng()};
      const address = this.getAddressModel(place);
      this.businessForm.get('country')?.setValue(address.country);
      this.businessForm.get('city')?.setValue(address.city);
      this.businessForm.get('address')?.setValue(address.address + ' ' + address.streetNumber);
      const zipControl = this.businessForm.get('zip');
      if (zipControl?.value == null || zipControl?.value === '') {
        zipControl?.setValue(address.zip);
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
      this.marker.setMap(null);
      this.map.setZoom(5);
    }
  }

  private onSetBusinessTags(tags: TagsModel[]): string[] {
    const tagsArr: string[] = [];
    tags.forEach(tag => {
      tagsArr.push(tag._id);
    });
    return tagsArr;
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

  ngAfterViewInit(): void {
    if (this.business) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
    this.signMapRef = this.getElementById('sing-map');
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
    this.map = new google.maps.Map(this.signMapRef, mapOptions);
    this.getBusiness();
    this.submit.pipe(takeUntil(this.unsubscribe)).subscribe((redirectToPreview) => {
      this.redirectToPreview = redirectToPreview;
      this.onSubmit();
    });
    this.cdf.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.businessForm.reset();
    this.serviceForm.reset();
    this.socialMediaForm.reset();
    this.galleryFormData = new FormData();
    this.logoFormData = new FormData();
    this.business = null;
    this.countryShortName = '';
    this.setPhones([]);
  }

  private socialMediaValidators(regExp: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control && control.value) {
        const val = control.value.replace(/\s/g, '');
        if (val === '') {
          return null;
        }
        return null;
      } else {
        return null;
      }
    };
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
        this.cdf.detectChanges();
      }
    });
  }

  private getElementById(className: string): HTMLElement {
    return document.getElementById(className) as HTMLElement;
  }

}
