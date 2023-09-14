import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppAuthService} from "../../services/app-auth.service";
import {LanguageModel} from "../../models/language.model";
import {AppUserModel} from "../../models/user.model";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {AppState} from "../../store/selectors";
import {select, Store} from "@ngrx/store";
import * as fromLanguageSelectors from '../../store/selectors/language.selector'
import * as fromLanguageActions from '../../store/actions/language.actions'
import * as fromUserSelectors from '../../store/selectors/user.selector'
import {takeUntil} from "rxjs/operators";
import {LanguageState} from "../../store/reducers/language.reducer";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  languageList: LanguageModel[];
  selectedLanguage: LanguageModel;
  user: AppUserModel | null;
  unsubscribe: Subject<void> = new Subject<void>();
  showLanguages: boolean;

  constructor(
    private translateService: TranslateService,
    private appState: Store<AppState>,
    private authService: AppAuthService
  ) {

    this.appState.pipe(select(fromLanguageSelectors.getLanguageSelector)).pipe(takeUntil(this.unsubscribe)).subscribe((language: LanguageState) => {
      this.selectedLanguage = language.current;
      this.languageList = language.list;
    });
    this.appState.pipe(select(fromUserSelectors.getUserStateSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user.user;
    });
  }

  ngOnInit(): void {
  }

  onChangeLanguage(lang: string) {
    const language = this.languageList.filter(l => l.lang === lang)[0];
    this.appState.dispatch(fromLanguageActions.setLanguage(language));
    this.showLanguages = false;
  }

  onLogOut() {
    this.authService.onSignOut();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
