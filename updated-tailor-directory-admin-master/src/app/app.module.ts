import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {StoreModule} from "@ngrx/store";
import {appReducers} from "./store/reducers";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {ApiRouterService} from "./services/api-router.service";
import {HttpMultiLoaderServiceService} from "./services/http-multi-loader-service.service";
import {LoginComponent} from './components/login/login.component';
import {ShareModule} from "./share.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SnackbarModule, SnackbarService} from "ngx-snackbar";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import * as Sentry from '@sentry/browser';
import {GlobalErrorService} from "./services/global-error.service";

export function createTranslateLoader(http: HttpClient, apiRoutesService: ApiRouterService) {
  return new HttpMultiLoaderServiceService(http, [
    {prefix: './assets/i18n', suffix: '.json'},
    {prefix: `${apiRoutesService.I18N}`},
  ]);
}

// switch (true) {
//   case environment.production: {
//     Sentry.init({
//       dsn: 'https://9471dedb6cb64fa5bb0d43f92a73a816@sentry.alphax-ds.de/50',
//       environment: 'Staging',
//       ignoreErrors: ['Non-Error exception captured with keys']
//     });
//     break;
//   }
// }

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    LoginComponent,
    NotFoundComponent
  ],
  imports: [
    ShareModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SnackbarModule.forRoot(),
    StoreModule.forRoot(appReducers),
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
  ],
  providers: [
    HttpMultiLoaderServiceService,
    SnackbarService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorService
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
