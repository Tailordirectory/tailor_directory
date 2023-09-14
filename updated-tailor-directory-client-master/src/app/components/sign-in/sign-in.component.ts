import {Component, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppAuthService} from '../../services/auth.service';
import {Subject, throwError} from 'rxjs';
import {catchError, takeUntil} from 'rxjs/operators';
import {AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser} from 'angularx-social-login';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnDestroy {

  @ViewChild('content') content: Element;
  modal: NgbModalRef;
  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  callback: (() => void) | null;
  unsubscribe: Subject<void> = new Subject<void>();
  isLoaded = false;

  constructor(
    private modalService: NgbModal,
    private authService: AppAuthService) {

    this.unsubscribe = new Subject<void>();

    this.authService.$showSignInModal.asObservable().subscribe(callback => {
      this.onShowModal();
      if (callback) {
        this.callback = callback;
      } else {
        this.callback = null;
      }
    });

  }

  private onShowModal() {
    this.modal = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'sign-in-modal auth-modal',
      backdrop: 'static',
      keyboard: false
    });
    this.modal.result.finally(() => {
      this.unsubscribe.next();
      this.unsubscribe.complete();
    });
  }

  signUpEmmit() {
    this.signInForm.reset();
    this.modal.close();
    if (this.callback) {
      this.authService.onShowSignUp(this.callback);
    } else {
      this.authService.onShowSignUp();
    }

  }

  onSignIn() {
    Object.keys(this.signInForm.controls).forEach(key => {
      this.signInForm.controls[key].markAsTouched();
    });
    if (this.signInForm.invalid) {
      return;
    }
    this.isLoaded = true;
    const email = this.signInForm.get('email')?.value as string;
    const password = this.signInForm.get('password')?.value as string;
    this.authService.onLogIn(email, password).pipe(
      takeUntil(this.unsubscribe),
      catchError(err => {
        this.isLoaded = false;
        return throwError(err);
      })).subscribe(isLoggedIn => {
      this.isLoaded = false;
      this.onSuccessSignUp(isLoggedIn);
    });
  }

  onResetPassword() {
    this.modal.close();
    this.authService.onShowResetPassword();
  }

  // onSingInGoogle() {
  //   this.authSocialService.signIn(GoogleLoginProvider.PROVIDER_ID).then((response: SocialUser) => {
  //     this.authService.onSignUpGoogle(response.idToken).subscribe(result => {
  //       this.onSuccessSignUp(result);
  //     });
  //   }).catch(e => {
  //   });
  // }

  // onSingInFacebook() {
  //   this.authSocialService.signIn(FacebookLoginProvider.PROVIDER_ID).then((response: SocialUser) => {
  //     this.authService.onSignUpFacebook(response.authToken).subscribe(result => {
  //       this.onSuccessSignUp(result);
  //     });
  //   }).catch(e => {
  //   });
  // }

  private onSuccessSignUp(result: boolean) {
    if (result) {
      this.signInForm.reset();
      this.modal.close();
      if (this.callback) {
        this.callback();
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
