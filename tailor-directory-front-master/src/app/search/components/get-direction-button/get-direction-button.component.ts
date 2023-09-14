import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy} from '@angular/core';
import {google} from 'google-maps';
import {SearchState} from '../../storage/reducers/search.reducer';
import {MapService} from '../../services/map.service';
import {select, Store} from '@ngrx/store';
import * as fromSearchSelectors from '../../storage/selectors/search.selectors';
import {takeUntil} from 'rxjs/operators';
import {SearchAppState} from '../../storage/selectors';
import {Subject} from 'rxjs';
import {AppState} from '../../../storage/selectors';
import * as fromDirectionAddressSelector from '../../../storage/selectors/get-direction-address.selector';
import * as fromDirectionAddressActions from '../../../storage/actions/direction-address.actions';
import {BusinessModel} from '../../../models/business.model';

@Component({
  selector: 'app-get-direction-button',
  templateUrl: './get-direction-button.component.html',
  styleUrls: ['./get-direction-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetDirectionButtonComponent implements OnDestroy {

  @Input('showIcon') showIcon: boolean;
  @Input('showTitle') showTitle: boolean;
  @Input('isButton') isButton: boolean;
  id = Math.random();
  callback: ((event?: MouseEvent) => void);
  showDistance = false;
  private address: SearchState;
  private unsubscribe: Subject<void> = new Subject<void>();
  endPoint: google.maps.LatLng;
  startCoordinates: google.maps.LatLng;
  isShowButtons: boolean;
  business: BusinessModel;

  @Input('endPoint') set setEndPoint(endPoint: google.maps.LatLng) {
    this.endPoint = endPoint;
  }

  @Input('business') set setBusiness(business: BusinessModel) {
    this.business = business;
  }

  @Input('callback') set setButtonsList(callback: ((event?: MouseEvent) => void)) {
    this.callback = callback;
  }

  @HostListener('body:click', ['$event']) bodyClick($event: MouseEvent) {
    if (!this.isShowButtons) {
      return;
    }
    const element = $event.target as Element;
    if (!this.isClickPrevented(element)) {
      this.isShowButtons = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  constructor(
    private mapService: MapService,
    private searchStore: Store<SearchAppState>,
    private changeDetectorRef: ChangeDetectorRef,
    private appStore: Store<AppState>,
    private nativeElement: ElementRef
  ) {
    this.searchStore.pipe(select(fromSearchSelectors.getSearchSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      this.address = d;
      this.showDistance = (!!this.address && this.address.address.replace(/ +?/g, '').length > 0);
    });
    this.appStore.pipe(select(fromDirectionAddressSelector.showDirectionAddressModalSelector), takeUntil(this.unsubscribe)).subscribe(d => {
      if (!d.showModal && d.direction) {
        this.mapService.getDirection(d.direction, this.endPoint, d.dType);
        if (this.callback) {
          this.callback();
        }
      }
    });
  }

  onGetDirection(type: string, event?: MouseEvent) {
    this.isShowButtons = false;
    if (this.showDistance) {
      this.startCoordinates = new google.maps.LatLng(this.address.lat, this.address.long);
    }
    this.changeDetectorRef.detectChanges();
    this.mapService.getDirection(this.startCoordinates, this.endPoint, type);
    if (this.callback) {
      if (event) {
        this.callback(event);
      } else {
        this.callback();
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onClick() {
    this.isShowButtons = !this.isShowButtons;
    this.changeDetectorRef.detectChanges();
  }

  private isClickPrevented(element: Element): boolean {
    return this.nativeElement.nativeElement.contains(element);
  }

  setAddress() {
    this.appStore.dispatch(fromDirectionAddressActions.showDirectionAddressAction({business: this.business}));
  }
}
