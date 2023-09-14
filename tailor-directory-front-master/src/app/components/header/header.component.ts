import {Component, OnDestroy, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageModel} from '../../models/language.model';
import {select, Store} from '@ngrx/store';
import {LanguageState} from '../../storage/reducers/language.reducer';
import * as fromLanguageSelectors from '../../storage/selectors/language.selector';
import * as fromLanguageActions from '../../storage/actions/language.actions';
import * as fromUserSelectors from '../../storage/selectors/user.selector';
import {AppState} from '../../storage/selectors';
import {AppUserModel} from '../../models/app-user.model';
import {AppAuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {

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
    this.appState.pipe(select(fromUserSelectors.getUserSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
    });
  }

  onChangeLanguage(lang: string) {
    const language = this.languageList.filter(l => l.lang === lang)[0];
    this.appState.dispatch(fromLanguageActions.setLanguage(language));
    this.showLanguages = false;
  }

  onSignIn() {
    this.authService.onShowSignIn();
  }

  onSignUp() {
    this.authService.onShowSignUp();
  }

  onSignOut() {
    this.authService.onSignOut();
  }


  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
