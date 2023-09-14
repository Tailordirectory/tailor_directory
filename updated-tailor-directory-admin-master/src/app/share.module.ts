import {ErrorHandler, NgModule} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {MainInterceptor} from "./interceptors/main-interceptor.interceptor";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {NotificationService} from "./services/notification.service";
import {SpinnerDirective} from "./directives/spinner.directive";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import {RatingComponent} from "./components/rating/rating.component";
import {ServiceSelectComponent} from "./components/service-select/service-select.component";
import {GlobalErrorService} from "./services/global-error.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxIntlTelInputModule,
    AutocompleteLibModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorService
    },
    NotificationService,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SpinnerDirective,
    NgxIntlTelInputModule,
    AutocompleteLibModule,
    RatingComponent,
    ServiceSelectComponent
  ],
  declarations: [
    SpinnerDirective,
    RatingComponent,
    ServiceSelectComponent
  ]
})
export class ShareModule {

}
