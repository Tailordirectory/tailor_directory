import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AppAuthService} from "../../services/app-auth.service";
import {Router} from "@angular/router";
import {select, Store} from "@ngrx/store";
import {AppState} from "../../store/selectors";
import * as fromUserSelectors from "../../store/selectors/user.selector";
import {catchError, takeUntil} from "rxjs/operators";
import {Subject, throwError} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', this.isRobotValidator()),
  });
  unsubscribe: Subject<void> = new Subject<void>();
  hasError: boolean;
  errorMessage: string;

  constructor(
    private authService: AppAuthService,
    private router: Router,
    private appState: Store<AppState>,
  ) {
    this.appState.pipe(select(fromUserSelectors.getUserStateSelector)).pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      if (user.user) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit(): void {
  }

  onLogin() {

    if (this.loginForm.invalid) {
      return;
    }
    const form = this.loginForm.getRawValue();
    this.hasError = false;
    this.authService.onLogIn(form.email, form.password).pipe(catchError(e => {
      if (e.status === 404 || e.status === 401) {
        this.hasError = true;
      }
      return throwError(e);
    })).subscribe(result => {
      this.router.navigate(['/']);
    })
  }

  isRobotValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isRobot = control.value.length > 0;
      return isRobot ? {'isRobot': true} : null;
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
