import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  HostListener, OnDestroy, ViewChild,
} from '@angular/core';
import {google} from 'google-maps';
import {MapService} from '../../services/map.service';
import {SearchState} from '../../storage/reducers/search.reducer';
import {Subject} from 'rxjs';
import {BusinessModel} from '../../../models/business.model';

@Component({
  selector: 'app-pin-card',
  templateUrl: './pin-card.component.html',
  styleUrls: ['./pin-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinCardComponent implements OnDestroy {

  business: BusinessModel;
  marker: google.maps.Marker;
  isVisible: boolean;
  top = 0;
  left = 0;
  private map: google.maps.Map;
  private projection: google.maps.MapCanvasProjection;
  private parentBlock: HTMLElement;
  private unsubscribe: Subject<void> = new Subject<void>();
  endCoordinates: google.maps.LatLng;

  @ViewChild('pinCard') pinCard: ElementRef;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isVisible = true;
    this.onCalculatePosition();
    this.changeDetectorRef.detectChanges();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isVisible = false;
  }


  constructor(
    protected mapService: MapService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    this.mapService.getInfoWindow().subscribe(r => {
      if (r && !this.isVisible) {
        this.marker = r.marker;
        this.map = r.map;
        this.projection = r.overlayView.getProjection();
        this.business = r.business;
        this.isVisible = true;
        this.endCoordinates = new google.maps.LatLng(this.business.location.coordinates[1], this.business.location.coordinates[0]);
        this.changeDetectorRef.detectChanges();
        this.onCalculatePosition();
        this.onShowCard();
      }
    });
  }

  private onCalculatePosition() {
    this.parentBlock = this.getElementById('pin-card');
    setTimeout(() => {
      if (!this.parentBlock) {
        return;
      }
      this.isVisible = false;
      const height = this.parentBlock.offsetHeight;
      const latLng: google.maps.LatLng = new google.maps.LatLng(this.business.location.coordinates[1], this.business.location.coordinates[0]);
      const position = this.projection.fromLatLngToContainerPixel(latLng);
      this.left = position.x - 177;
      this.top = position.y - height - 40;
      this.isVisible = true;
      this.changeDetectorRef.detectChanges();
    }, 10);
  }

  private onShowCard() {
    this.map.addListener('bounds_changed', () => {
      this.projection = this.mapService.getOverlay().getProjection();
      this.isVisible = false;
      this.changeDetectorRef.detectChanges();
    });
    this.marker.addListener('mouseover', (m: google.maps.Marker, event: MouseEvent) => {
      this.isVisible = true;
      this.onCalculatePosition();
      this.changeDetectorRef.detectChanges();
    });
    this.marker.addListener('mouseout', (m: google.maps.Marker, event: MouseEvent) => {
      this.isVisible = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  private getElementById(className: string): HTMLElement {
    return document.getElementById(className) as HTMLElement;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
