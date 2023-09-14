import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {OwnerModel} from '../../../models/owner.model';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {UpdateOwnerRequestModel} from '../../../models/update-owner-request.model';
import {AppUserModel} from '../../../models/app-user.model';
import * as fromUserActions from '../../../storage/actions/user.actions';
import {OwnerService} from '../../../services/owner.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../storage/selectors';
import {NotificationService} from '../../../services/notification.service';
import {AppAuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-edit-owner-profile-form',
  templateUrl: './edit-owner-profile-form.component.html',
  styleUrls: ['./edit-owner-profile-form.component.scss']
})
export class EditOwnerProfileFormComponent implements AfterViewInit {

  owner: OwnerModel;
  personalForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    companyName: new FormControl(''),
    groupName: new FormControl('')
  });
  changePasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  isShowChangePassword = false;
  isPasswordChanged = false;

  constructor(
    private ownerService: OwnerService,
    private appStore: Store<AppState>,
    private notificationService: NotificationService,
    private authService: AppAuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.changePasswordForm.get('confirmPassword')?.setValidators((control: AbstractControl) => {
      const password = this.changePasswordForm.get('newPassword')?.value;
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

  onSubmitOwner() {
    Object.keys(this.personalForm.controls).forEach(key => {
      this.personalForm.controls[key].markAsTouched();
    });
    this.saveOwnerProfile();
  }

  private saveOwnerProfile() {
    if (this.personalForm.invalid) {
      return;
    }
    const personal = this.personalForm.getRawValue();
    const owner: UpdateOwnerRequestModel = {
      firstName: personal.firstName,
      lastName: personal.lastName,
      groupName: personal.groupName,
      companyName: personal.companyName
    };
    this.ownerService.updateOwner(owner).subscribe(result => {
      let name = '';
      if (result.firstName || result.lastName) {
        name = owner.firstName + ' ' + owner.lastName;
      }
      if (result.groupName) {
        name = owner.groupName as string;
      }
      if (result.companyName) {
        name = owner.companyName as string;
      }
      const user: AppUserModel = {
        name,
        id: this.owner._id,
        type: 'business',
        profileType: this.owner.profileType
      };
      this.appStore.dispatch(fromUserActions.loadUserAction({user}));
      this.onGetOwner();
      this.notificationService.notify('edit_business_form.successfully_updated', 'success');
    });
  }

  onShowChangePasswordForm() {
    this.isShowChangePassword = true;
    this.isPasswordChanged = false;
    this.changeDetectorRef.detectChanges();
  }

  onChangePassword() {
    if (this.changePasswordForm.invalid) {
      return;
    }
    const oldPassword = this.changePasswordForm.get('oldPassword')?.value as string;
    const newPassword = this.changePasswordForm.get('newPassword')?.value as string;
    this.authService.onChangePassword(oldPassword, newPassword).subscribe(r => {
      this.isPasswordChanged = true;
      this.isShowChangePassword = false;
      this.changePasswordForm.reset();
    });
  }

  private onGetOwner() {
    this.ownerService.getOwner().subscribe(owner => {
      this.personalForm.get('firstName')?.setValue(owner.firstName);
      this.personalForm.get('lastName')?.setValue(owner.lastName);
      this.personalForm.get('companyName')?.setValue(owner.companyName);
      this.personalForm.get('groupName')?.setValue(owner.groupName);
      this.owner = owner;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.onGetOwner();
  }

}
