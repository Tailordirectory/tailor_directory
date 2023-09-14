import {Injectable} from '@angular/core';
import {google} from 'google-maps';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private geocoder: google.maps.Geocoder;

  constructor() {
    this.geocoder = new google.maps.Geocoder();
  }

  getGeocodeByAddress(address: string, result: (result: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => void) {
    const request: google.maps.GeocoderRequest = {
      address
    };
    this.geocoder.geocode(request, result);
  }
}
