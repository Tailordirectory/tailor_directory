import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {StoreModule} from '@ngrx/store';
import {effects} from './storage/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {ShareModule} from './modules/share.module';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {EffectsModule} from '@ngrx/effects';
import {appReducers} from './storage/reducers';
import {BusinessTypesService} from './services/business-types.service';
import {TagsService} from './services/tags.service';
import {HttpClient} from '@angular/common/http';
import {ApiRouterService} from './services/api-router.service';
import {HttpMultiLoaderServiceService} from './services/http-multi-loader-service.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppAuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {SignInComponent} from './components/sign-in/sign-in.component';
import {SignUpModalComponent} from './components/sign-up-modal/sign-up-modal/sign-up-modal.component';
import {SignUpBusinessComponent} from './components/sign-up-modal/sing-up-business/sign-up-business.component';
import {SignUpUserComponent} from './components/sign-up-modal/sing-up-user/sign-up-user.component';
import {EditProfileComponent} from './components/edit-profile/index/edit-profile.component';
import {EditBusinessProfileComponent} from './components/edit-profile/edit-business-profile.component/edit-business-profile.component';
import {EditClientProfileComponent} from './components/edit-profile/edit-client-profile.component/edit-client-profile.component';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {AboutUsComponent} from './components/ablut-us/about-us.component';
import {ContactUsComponent} from './components/contact-us/contact-us.component';
import {NotificationService} from './services/notification.service';
import {GlobalErrorService} from './services/global-error.service';
import {ErrorService} from './services/error.service';
import {SnackbarModule, SnackbarService} from 'ngx-snackbar';
import {OwnerService} from './services/owner.service';
import {BusinessService} from './services/business.service';
import {GeocodingService} from './services/geocoding.service';
import {FocusDirective} from './directives/focus.directive';
import {AuthGuard} from './guards/auth.guard';
import {NgxMaskModule} from 'ngx-mask';
import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';
import {OneTimePassService} from './services/one-time-pass.service';
import {ClaimRequestService} from './services/claim-request.service';
import {BusinessProfileModalComponent} from './components/edit-profile/business-profile-modal.component/business-profile-modal.component';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import {ConfirmSuccessComponent} from './components/confirm/confirm-success.component/confirm-success.component';
import {ConfirmErrorComponent} from './components/confirm/confirm-error.component/confirm-error.component';
import {ResetPasswordModalComponent} from './components/reset-password-modal/reset-password-modal.component';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {DynamicComponentsService} from './services/dynamic-components.service';
import {GetDirectionAddressComponent} from './components/get-direction-address.component/get-direction-address.component';
import {EditSingleBusinessProfileComponent} from './components/edit-profile/single-business.component/single-business.component';
import {EditMultipleBusinessProfileComponent} from './components/edit-profile/multiple-business.component/multiple-business.component';
import {EditBusinessProfileFormComponent} from './components/edit-profile/edit-business-profile-form.component/edit-business-profile-form.component';
import {EditOwnerProfileFormComponent} from './components/edit-profile/edit-owner-profile-form.component/edit-owner-profile-form.component';
import {OffersModalComponent} from './components/offers/offers-modal.component/offers-modal.component';
import {OffersService} from './services/offers.service';
import {OffersPageComponent} from './components/offers/offers-page/offers-page.component';
import {ConfirmClosingModalComponent} from './components/edit-profile/edit-business-profile.component/confirm-closing-modal.component/confirm-closing-modal.component';
import {LeaveAReviewModalComponent} from './components/leave-a-review-modal/leave-a-review-modal.component';
import {ReviewService} from './services/review.service';
import {SignUpCloseConfirmationModalComponent} from './components/sign-up-modal/sign-up-close-confirmation-modal/sign-up-close-confirmation-modal';
import * as Sentry from '@sentry/browser';

export function createTranslateLoader(http: HttpClient, apiRoutesService: ApiRouterService) {
  return new HttpMultiLoaderServiceService(http, [
    {prefix: './assets/i18n', suffix: '.json'},
    {prefix: `${apiRoutesService.I18N}`},
  ]);
}

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('783060610997-jkqctk8071l19ebrptvr9phbj898ldbg.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('1217577778573857')
  }
]);

export function provideConfig() {
  return config;
}

registerLocaleData(localeDe, 'de-DE', localeDeExtra);


switch (true) {
  case environment.production: {
    Sentry.init({
      dsn: 'https://7cc1971f7bee461aa186214f56d31f82@sentry.alphax-ds.de/51',
      environment: 'Staging',
      ignoreErrors: ['Non-Error exception captured with keys']
    });
    break;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignInComponent,
    SignUpModalComponent,
    SignUpBusinessComponent,
    SignUpUserComponent,
    SignUpCloseConfirmationModalComponent,
    EditProfileComponent,
    EditBusinessProfileComponent,
    EditSingleBusinessProfileComponent,
    EditMultipleBusinessProfileComponent,
    EditBusinessProfileFormComponent,
    EditOwnerProfileFormComponent,
    EditClientProfileComponent,
    ConfirmClosingModalComponent,
    OffersModalComponent,
    OffersPageComponent,
    AboutUsComponent,
    ContactUsComponent,
    FocusDirective,
    VerifyEmailComponent,
    BusinessProfileModalComponent,
    ConfirmSuccessComponent,
    ConfirmErrorComponent,
    ResetPasswordModalComponent,
    GetDirectionAddressComponent,
    LeaveAReviewModalComponent
  ],
  imports: [
    ShareModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaskModule.forRoot(),
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 10, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient, ApiRouterService]
      }
    }),
    SnackbarModule.forRoot(),
    SocialLoginModule,
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    NgbDropdownModule
  ],
  providers: [
    BusinessTypesService,
    TagsService,
    AppAuthService,
    UserService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorService
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    ErrorService,
    NotificationService,
    SnackbarService,
    OwnerService,
    BusinessService,
    GeocodingService,
    AuthGuard,
    OneTimePassService,
    ClaimRequestService,
    DynamicComponentsService,
    OffersService,
    ReviewService
  ],
  entryComponents: [
    GetDirectionAddressComponent,
    OffersModalComponent,
    LeaveAReviewModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
