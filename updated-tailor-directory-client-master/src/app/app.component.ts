import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from './storage/selectors';
import * as fromBusinessTagsActions from './storage/actions/business-type.actions';
import {TranslateService} from '@ngx-translate/core';
import * as fromLanguageSelectors from './storage/selectors/language.selector';
import {LanguageState} from './storage/reducers/language.reducer';
import * as fromGeolocationActions from './storage/actions/geolocation.action';
import {AppAuthService} from './services/auth.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DynamicComponentsService} from './services/dynamic-components.service';
import {GetDirectionAddressComponent} from './components/get-direction-address.component/get-direction-address.component';
import * as fromOfferActions from './storage/actions/offers.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'BusinessDirectory';
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private appStore: Store<AppState>,
    private authService: AppAuthService,
    private translate: TranslateService,
    private viewContainerRef: ViewContainerRef,
    private dynamicComponentsService: DynamicComponentsService
  ) {
    this.dynamicComponentsService.setRootViewContainerRef(this.viewContainerRef);
    this.dynamicComponentsService.addDynamicComponent(GetDirectionAddressComponent);
    translate.setDefaultLang('de');
    this.appStore.dispatch(fromBusinessTagsActions.loadBusinessTypeAction());
    this.appStore.pipe(select(fromLanguageSelectors.getLanguageSelector)).pipe(takeUntil(this.unsubscribe)).subscribe((language: LanguageState) => {
      translate.use(language.current.lang);
    });
    navigator.geolocation.getCurrentPosition((position: Position) => {
      this.appStore.dispatch(fromGeolocationActions.setGeolocation({position, hasError: false}));
    }, (error) => {
      this.appStore.dispatch(fromGeolocationActions.setGeolocation({position: null, hasError: true}));
    });
    this.appStore.dispatch(fromOfferActions.loadOffers());
  }

  ngOnInit(): void {
    this.authService.checkRefreshToken();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
