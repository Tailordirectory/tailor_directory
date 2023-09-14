import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {SearchAppState} from '../../storage/selectors';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {MapService} from '../../services/map.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BusinessService} from '../../services/business.service';
import {map, takeUntil} from 'rxjs/operators';
import {SearchState} from '../../storage/reducers/search.reducer';
import * as fromSearchSelects from '../../storage/selectors/search.selectors';
import {google} from 'google-maps';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {AppState} from '../../../storage/selectors';
import * as fromGeolocationSelectors from '../../../storage/selectors/geolocation.selectors';
import {GeolocationState} from '../../../storage/reducers/geolocation.reducer';
import {ReviewService} from '../../../services/review.service';
import * as fromUserSelectors from '../../../storage/selectors/user.selector';
import {AppUserModel} from '../../../models/app-user.model';
import {AppAuthService} from '../../../services/auth.service';
import {ReviewResponseModel} from '../../models/review-response.model';
import {BusinessModel} from '../../../models/business.model';

@Component({
  selector: 'app-business-profile-2',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss']
})
export class BusinessProfileComponent implements OnDestroy {

  $profile: Observable<BusinessModel | null>;
  $otherList: Observable<BusinessModel[]>;
  profileId: string;
  private selectedProfile: BusinessModel;
  private address: SearchState;
  isShowLeaveComment = false;
  loading = false;
  carousel: string[];
  getCurrentPosition$: Observable<GeolocationState>;
  userState: AppUserModel;
  private marker: google.maps.Marker;
  private markerIcon = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg width="20" height="25" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '<path d="M4.68629 4.82658C-1.5621 11.262 -1.5621 21.6959 4.68629 28.1314L16 40L27.3137 28.1314C33.5621 21.6959 33.5621 11.262 27.3137 4.82658C21.0653 -1.60886 10.9347 -1.60886 4.68629 4.82658Z" fill="#0585F5"/>\n' +
    '<ellipse cx="16" cy="16.0001" rx="6.4" ry="6.4" fill="#93CCFF"/>\n' +
    '</svg>');
  private mapOptions: google.maps.MapOptions = {
    zoom: 17,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    gestureHandling: 'cooperative'
  };

  sliderOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoplaySpeed: 3000,
    navText: ['Prev', 'Next'],
    nav: true
  };
  endPoint: google.maps.LatLng;

  $reviews: Observable<ReviewResponseModel>;
  unsubscribe: Subject<void> = new Subject<void>();

  @ViewChild('mapRef') mapRef: ElementRef;

  constructor(
    private searchStore: Store<SearchAppState>,
    private mapService: MapService,
    private route: ActivatedRoute,
    private router: Router,
    private appStore: Store<AppState>,
    private businessService: BusinessService,
    protected reviewService: ReviewService,
    protected authService: AppAuthService
  ) {
    this.getCurrentPosition$ = this.appStore.pipe(select(fromGeolocationSelectors.getGeolocationSelector)).pipe(takeUntil(this.unsubscribe));
    this.route.params.pipe(map(m => m.id)).subscribe(id => {
      this.loading = true;
      this.appStore.pipe(select(fromUserSelectors.getUserSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(user => {
        this.isShowLeaveComment = false;
        if (user) {
          this.userState = user;
          if (user.type === 'user') {
            this.reviewService.canSendReview(id).subscribe(res => {
              if (!res.exists) {
                this.isShowLeaveComment = true;
              }
            });
          }
        } else {
          this.isShowLeaveComment = true;
        }
      });
      this.$otherList = this.businessService.getOtherOwnerBusinessList(id);
      this.$reviews = this.reviewService.getReviewListById(id);
      this.$profile = this.businessService.getBusinessById(id).pipe(
        map(profile => {
          this.loading = false;
          this.profileId = profile?._id as string;
          if (profile && profile?.restrictions?.full_profile_page) {
            this.selectedProfile = profile as BusinessModel;
            this.endPoint = new google.maps.LatLng(profile.location.coordinates[1], profile.location.coordinates[0]);
            this.marker = this.marker = new google.maps.Marker({position: this.endPoint});
            this.marker.setIcon({
              url: this.markerIcon,
              scaledSize: new google.maps.Size(32, 40)
            });
            this.initMap(this.selectedProfile.location.coordinates[1], this.selectedProfile.location.coordinates[0]);
            return profile;
          } else {
            this.router.navigate(['/']);
            this.initMap(null, null);
            return null;
          }
        }));
    });
    this.searchStore.pipe(select(fromSearchSelects.getSearchSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      this.address = d;
    });
  }

  initMap(lat: number | null, long: number | null) {
    if (lat && long) {
      const coordinates = new google.maps.LatLng(lat, long);
      this.mapOptions = Object.assign(this.mapOptions, {center: coordinates});
      this.mapService.initMap(this.mapRef, this.mapOptions);
      this.mapService.setMarker(this.marker);
    } else {
      const coordinates = new google.maps.LatLng(52.52000659999999, 13.404954);
      this.mapOptions = Object.assign(this.mapOptions, {center: coordinates, zoom: 5});
      this.mapService.initMap(this.mapRef, this.mapOptions);
    }

  }

  onShowLeaveComment() {
    if (!this.userState) {
      this.authService.onShowSignIn(() => {
        this.reviewService.canSendReview(this.profileId).subscribe(r => {
          if (!r.exists) {
            this.reviewService.onShowModal(this.profileId, () => {
              this.isShowLeaveComment = false;
            });
          }
        });
      });
    } else {
      this.reviewService.onShowModal(this.profileId, () => {
        this.isShowLeaveComment = false;
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
