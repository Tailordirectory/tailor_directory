import {NgModule} from '@angular/core';
import {BusinessSearchComponent} from './components/bisiness-search/business-search.component';
import {RouterModule} from '@angular/router';
import {routes} from './navigation';
import {SearchService} from './services/search.service';
import {StoreModule} from '@ngrx/store';
import {searchReducers} from './storage/reducers';
import {CommonModule} from '@angular/common';
import {ShareModule} from '../modules/share.module';
import {TailorCardComponent} from './components/tailor-card/tailor-card.component';
import {LeftBarComponent} from './components/left-bar/left-bar.component';
import {MapService} from './services/map.service';
import {TagsService} from '../services/tags.service';
import {EffectsModule} from '@ngrx/effects';
import {effects} from './storage/effects';
import {PinCardComponent} from './components/pin-card/pin-card.component';
import {BusinessResultComponent} from './components/business-result/business-result.component';
import {BusinessSmallProfileComponent} from './components/business-small-profile/business-small-profile.component';
import {BusinessService} from './services/business.service';
import {BusinessProfileComponent} from './components/business-profile/business-profile.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {ReviewCardComponent} from './components/review-card/review-card.component';
import {GetDirectionButtonComponent} from './components/get-direction-button/get-direction-button.component';
import {PhoneComponent} from './components/phone.component/phone.component';
import {ListPageComponent} from './components/list-page/list-page.component';


@NgModule({
  declarations: [
    BusinessSearchComponent,
    TailorCardComponent,
    BusinessResultComponent,
    PinCardComponent,
    LeftBarComponent,
    BusinessSmallProfileComponent,
    BusinessProfileComponent,
    ReviewCardComponent,
    GetDirectionButtonComponent,
    PhoneComponent,
    ListPageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature('searchState', searchReducers),
    EffectsModule.forFeature(effects),
    CommonModule,
    ShareModule,
    CarouselModule
  ],
  exports: [
  ],
  providers: [
    SearchService,
    MapService,
    TagsService,
    BusinessService
  ]
})
export class HomeModule {

}
