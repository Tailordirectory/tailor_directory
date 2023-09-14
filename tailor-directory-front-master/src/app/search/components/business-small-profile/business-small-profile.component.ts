import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {SearchAppState} from '../../storage/selectors';
import * as fromSelectors from '../../storage/selectors/bisiness-profile.selectors';
import * as fromActions from '../../storage/actions/business-profile.actions';
import {MapService} from '../../services/map.service';
import {SearchState} from '../../storage/reducers/search.reducer';
import {google} from 'google-maps';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import * as searchSelectors from '../../storage/selectors/search.selectors';
import {BusinessModel} from '../../../models/business.model';

@Component({
  selector: 'app-business-small-profile',
  templateUrl: './business-small-profile.component.html',
  styleUrls: ['./business-small-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessSmallProfileComponent implements AfterViewInit, OnDestroy {

  profile: BusinessModel;
  unsubscribe: Subject<void> = new Subject<void>();
  endCoordinates: google.maps.LatLng;
  address: SearchState;
  marker: google.maps.Marker;

  constructor(
    private searchStore: Store<SearchAppState>,
    private mapService: MapService,
    private ngZone: NgZone,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  onBackClicked() {
    this.searchStore.dispatch(fromActions.hideUserProfileStateAction());
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.searchStore.pipe(select(searchSelectors.getSearchSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(address => {
      this.address = address;
    });
    this.searchStore.pipe(select(fromSelectors.getBusinessProfileSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      const map: google.maps.Map = this.mapService.getMap();
      if (d.profile && d.markerId !== null) {
        this.profile = d.profile;
        this.marker = this.mapService.getMarkerById(d.markerId);
        this.endCoordinates = new google.maps.LatLng(this.profile.location.coordinates[1], this.profile.location.coordinates[0]);
        this.mapService.getMap().setZoom(17);
        this.mapService.getMap().setCenter(this.endCoordinates);
        setTimeout(() => {
          this.marker.setIcon({
            url: this.profile.businessTypeId.icon,
            scaledSize: new google.maps.Size(32, 40)
          });
        }, 1000);
      } else {
        if (map && this.marker) {
          this.mapService.getMap().setZoom(11);
          const addressCoordinates = new google.maps.LatLng(this.address.lat, this.address.long);
          this.mapService.getMap().setCenter(addressCoordinates);
        }
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  onProfileNavigate() {
    this.ngZone.run(() => {
      this.router.navigate(['/profile/' + this.profile._id]);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
