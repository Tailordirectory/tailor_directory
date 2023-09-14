import {ErrorHandler, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {ApiRouterService} from '../services/api-router.service';
import {RatingComponent} from '../components/rating/rating.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxBootstrapSliderModule} from 'ngx-bootstrap-slider';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AuthInterceptor} from '../interceptors/auth.interceptor';
import {PhoneFormatPipe} from '../directives/phone-format.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {ClaimRequestComponent} from '../components/claim-request/claim-request.component';
import {ServiceSelectComponent} from '../components/service-select/service-select.component';

@NgModule({
  declarations: [
    RatingComponent,
    PhoneFormatPipe,
    ClaimRequestComponent,
    ServiceSelectComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    NgSelectModule,
    NgxBootstrapSliderModule,
    NgbModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    RatingComponent,
    NgSelectModule,
    NgxBootstrapSliderModule,
    NgbModule,
    PhoneFormatPipe,
    TranslateModule,
    ClaimRequestComponent,
    ServiceSelectComponent
  ],
  providers: [
    ApiRouterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    RatingComponent,
    ClaimRequestComponent,
    ServiceSelectComponent
  ]
})
export class ShareModule {
}
