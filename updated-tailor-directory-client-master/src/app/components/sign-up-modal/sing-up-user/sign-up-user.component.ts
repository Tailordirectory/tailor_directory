import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppAuthService} from '../../../services/auth.service';
import {SignUpClientRequestModel} from '../../../models/sign-up-request.model';
import {AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser} from 'angularx-social-login';

@Component({
  selector: 'app-sign-up-user',
  templateUrl: './sign-up-user.component.html',
  styleUrls: ['./sign-up-user.component.scss']
})
export class SignUpUserComponent {

  @Output('onClose') onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('callback') callback: (() => void) | null;

  userForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private authService: AppAuthService,
  ) {
    this.userForm.get('confirmPassword')?.setValidators((control: AbstractControl) => {
      const password = this.userForm.get('password')?.value;
      const confirm = control.value;
      if (confirm === '') {
        return {required: true};
      }
      if (password !== confirm) {
        return {confirm: true};
      }
      return null;
    });
  }

  submit() {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.controls[key].markAsTouched();
    });
    if (this.userForm.invalid) {
      return;
    }
    const clientForm = this.userForm.getRawValue();
    const clientRequest: SignUpClientRequestModel = {
      email: clientForm?.email,
      firstName: clientForm?.firstName,
      lastName: clientForm?.lastName,
      password: clientForm?.password,
      userName: clientForm?.name
    };
    this.authService.signUpClient(clientRequest).subscribe(result => {
      this.onSuccessSignUp(result);
    });
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
      this.userForm.reset();
      if (this.callback) {
        this.callback();
      }
      this.onClose.emit(true);
    }
  }

}
