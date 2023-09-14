import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppAuthService} from "./services/app-auth.service";
import {Subject} from "rxjs";
import {NavigationStart, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {AppState} from "./store/selectors";
import {select, Store} from "@ngrx/store";
import * as fromLanguageSelectors from './store/selectors/language.selector';
import {takeUntil} from "rxjs/operators";
import {LanguageState} from "./store/reducers/language.reducer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  unsubscribe: Subject<void> = new Subject<void>();
  isHidden: boolean;

  constructor(
    private authService: AppAuthService,
    private router: Router,
    private appStore: Store<AppState>,
    private translate: TranslateService,
  ) {
    translate.setDefaultLang('de');
    this.appStore.pipe(select(fromLanguageSelectors.getLanguageSelector)).pipe(takeUntil(this.unsubscribe)).subscribe((language: LanguageState) => {
      translate.use(language.current.lang);
    });
    this.router.events.forEach(event => {
      if (event instanceof NavigationStart) {
        this.isHidden = event.url.includes('/login');
      }
    })
  }

  ngOnInit(): void {
    this.authService.checkRefreshToken();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
