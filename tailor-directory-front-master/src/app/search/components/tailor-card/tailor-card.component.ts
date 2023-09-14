import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import {SearchState} from '../../storage/reducers/search.reducer';
import {google} from 'google-maps';
import {MapService} from '../../services/map.service';
import {Store} from '@ngrx/store';
import {SearchAppState} from '../../storage/selectors';
import * as fromBusinessProfileActions from '../../storage/actions/business-profile.actions';
import {PinCardComponent} from '../pin-card/pin-card.component';
import {Router} from '@angular/router';
import * as leftPanelAction from '../../storage/actions/left-panel.action';
import {BusinessModel} from '../../../models/business.model';

@Component({
  selector: 'app-tailor-card',
  templateUrl: './tailor-card.component.html',
  styleUrls: ['./tailor-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TailorCardComponent implements OnInit {
  marker: google.maps.Marker;
  isHover = false;

  @Input('tailor') tailor: BusinessModel;
  @Input('isClickable') isClickable = true;
  @Input('onHover') onHover = true;
  @Input('showPreview') showPreview = true;
  @Input('showDirection') showDirection = true;
  @Input('showMarker') showMarker = true;
  private address: SearchState;
  endCoordinates: google.maps.LatLng;
  private markerIcon: string;
  private markerId: number;

  @Input('address') set setAddress(address: SearchState) {
    this.address = address;
  }

  @ViewChild('pinCard') private pinCard: PinCardComponent;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private mapService: MapService,
    private searchStore: Store<SearchAppState>,
    private ngZone: NgZone,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.endCoordinates = new google.maps.LatLng(this.tailor.location.coordinates[1], this.tailor.location.coordinates[0]);
      this.changeDetectorRef.detectChanges();
      if (this.showMarker) {
        this.setMarker();
      }
    }, 100);
  }

  private setMarker() {
    this.marker = new google.maps.Marker({position: this.endCoordinates});
    this.marker.setIcon({
      url: this.tailor.businessTypeId.icon,
      scaledSize: new google.maps.Size(20, 25)
    });
    this.markerId = this.mapService.setMarker(this.marker);
    this.marker.addListener('mouseover', (m: google.maps.Marker, event: MouseEvent) => {
      if (this.isHover) {
        this.isHover = true;
      }
      if (this.showPreview) {
        this.mapService.showInfoWindow(this.marker, this.tailor);
      }
      this.changeDetectorRef.detectChanges();
    });
    this.marker.addListener('mouseout', (m: google.maps.Marker, event: MouseEvent) => {
      this.isHover = false;
      this.changeDetectorRef.detectChanges();
    });
    this.marker.addListener('click', (m: google.maps.Marker, event: MouseEvent) => {
      if (this.tailor.restrictions.full_profile_page) {
        this.onProfileNavigate();
      } else {
        this.searchStore.dispatch(leftPanelAction.showPanelAction());
        this.searchStore.dispatch(fromBusinessProfileActions.setUserProfileStateAction({profile: this.tailor, markerId: this.markerId}));
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  onMouseEnter() {
    if (this.showMarker) {
      this.marker.setIcon({
        url: this.markerIcon,
        scaledSize: new google.maps.Size(32, 40)
      });
    }
  }

  onMouseLeave() {
    if (this.showMarker) {
      this.marker.setIcon({
        url: this.markerIcon,
        scaledSize: new google.maps.Size(20, 25)
      });
    }
  }

  onTileClick($event: MouseEvent) {
    if (!this.isClickable) {
      return;
    }
    const element = $event.target as Element;
    if (!this.isClickPrevented(element)) {
      this.searchStore.dispatch(fromBusinessProfileActions.setUserProfileStateAction({profile: this.tailor, markerId: this.markerId}));
      this.changeDetectorRef.detectChanges();
    }
  }

  private isClickPrevented(element: Element): boolean {
    const className = element.className;
    if (className.includes('action')) {
      return true;
    }
    if (element.parentElement) {
      return this.isClickPrevented(element.parentElement);
    }
    return false;
  }

  onProfileNavigate() {
    this.ngZone.run(() => {
      this.router.navigate(['/profile/' + this.tailor._id]);
    });
  }
}
