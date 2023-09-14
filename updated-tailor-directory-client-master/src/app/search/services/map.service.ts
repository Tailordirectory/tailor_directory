import {ElementRef, Injectable} from '@angular/core';
import {google} from 'google-maps';
import {Subject} from 'rxjs';
import {BusinessModel} from '../../models/business.model';

@Injectable()
export class MapService {

  private map: google.maps.Map;
  private directionService: google.maps.DirectionsService;
  private directionsRenderer: google.maps.DirectionsRenderer = new google.maps.DirectionsRenderer();
  private markers: google.maps.Marker[] = [];
  private infoWindow: google.maps.InfoWindow;
  private overlayView = new google.maps.OverlayView();
  private infoWindow$: Subject<{ map: google.maps.Map, overlayView: google.maps.OverlayView, marker: google.maps.Marker, business: BusinessModel } | null>;

  constructor() {
    this.infoWindow = new google.maps.InfoWindow();
    this.directionService = new google.maps.DirectionsService();
    this.infoWindow$ = new Subject<{ map: google.maps.Map, overlayView: google.maps.OverlayView, marker: google.maps.Marker, business: BusinessModel } | null>();
  }

  initMap(element: ElementRef, options: google.maps.MapOptions): google.maps.Map {
    this.map = new google.maps.Map(element.nativeElement, options);
    this.overlayView = new google.maps.OverlayView();
    this.overlayView.setMap(this.map);
    return this.map;
  }

  getMap(): google.maps.Map {
    return this.map;
  }

  setMarker(marker: google.maps.Marker): number {
    marker.setMap(this.map);
    this.markers.push(marker);
    return this.markers.length - 1;
  }

  clearMarkers() {
    if (this.markers.length > 0) {
      this.markers.forEach(m => {
        m.setMap(null);
      });
    }
    this.markers = [];
  }

  showInfoWindow(marker: google.maps.Marker, business: BusinessModel) {
    this.infoWindow$.next({marker, business, map: this.map, overlayView: this.overlayView});
  }

  setDirection(directions: google.maps.DirectionsResult) {
    this.directionsRenderer.setMap(this.map);
    this.directionsRenderer.setDirections(directions);
  }

  getDirection(from: google.maps.LatLng | undefined, to: google.maps.LatLng, type?: string) {
    const tm = (type && type === 'foot') ? google.maps.TravelMode.WALKING : google.maps.TravelMode.DRIVING;
    if (!from || from === undefined) {
      // If 'from' position is undefined (the search address does not has address) then trying to get user geolocation.
      navigator.geolocation.getCurrentPosition((position) => {
        const start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        const directionRequest: google.maps.DirectionsRequest = {
          destination: to,
          origin: start,
          travelMode: tm
        };
        this.onGetDirection(directionRequest);
      });
    } else {
      // Using address location.
      const directionRequest: google.maps.DirectionsRequest = {
        destination: to,
        origin: from,
        travelMode: tm
      };
      this.onGetDirection(directionRequest);
    }
  }

  private onGetDirection(directionRequest: google.maps.DirectionsRequest) {
    this.clearDirection();
    this.directionService.route(directionRequest, (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
      if (status === 'OK') {
        this.setDirection(result);
      }
    });
  }

  clearDirection() {
    this.directionsRenderer.setMap(null);
  }

  getOverlay() {
    return this.overlayView;
  }

  getInfoWindow() {
    return this.infoWindow$.asObservable();
  }

  getMarkerById(id: number): google.maps.Marker {
    return this.markers[id];
  }

}
