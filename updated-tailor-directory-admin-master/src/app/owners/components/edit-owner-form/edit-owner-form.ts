import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {OwnerModel} from "../../../models/owner.model";

@Component({
  selector: 'app-edit-owner-form',
  templateUrl: './edit-owner-form.html',
  styleUrls: ['./edit-owner-form.scss']
})
export class EditOwnerFormComponent implements OnInit, OnDestroy {

  owner: OwnerModel;
  ownerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
  });
  unsubscribe$: Subject<void> = new Subject();

  @Input('submit') onSubmit: EventEmitter<void>;
  @Output('onSubmit') submit: EventEmitter<{ firstName: string, lastName: string }> = new EventEmitter<{ firstName: string, lastName: string }>();

  @Input('owner') set setOwner(owner: OwnerModel) {
    this.owner = owner;
    this.ownerForm.get('firstName')?.setValue(owner.firstName);
    this.ownerForm.get('lastName')?.setValue(owner.lastName);
  }

  ngOnInit(): void {
    this.onSubmit.pipe(takeUntil(this.unsubscribe$)).subscribe((r: any) => {
      Object.keys(this.ownerForm.controls).forEach(key => {
        this.ownerForm.controls[key].markAsTouched();
      });
      if (this.ownerForm.valid) {
        const form = this.ownerForm.getRawValue();
        this.submit.next({firstName: form.firstName, lastName: form.lastName});
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
