import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-add-owner-form',
  templateUrl: './add-owner-form.html',
  styleUrls: ['./add-owner-form.scss']
})
export class AddOwnerFormComponent implements OnInit, OnDestroy {

  @Input('submit') onSubmit: Subject<void>;
  @Output('onSubmit') submit: EventEmitter<{ firstName: string, lastName: string, email: string }> = new EventEmitter<{ firstName: string, lastName: string, email: string }>();

  ownerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  unsubscribe$: Subject<void> = new Subject();

  constructor() {
  }

  ngOnInit(): void {
    this.onSubmit.pipe(takeUntil(this.unsubscribe$)).subscribe((r: any) => {
      Object.keys(this.ownerForm.controls).forEach(key => {
        this.ownerForm.controls[key].markAsTouched();
      });
      if (this.ownerForm.valid) {
        const form = this.ownerForm.getRawValue();
        this.submit.next({firstName: form.firstName, lastName: form.lastName, email: form.email});
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
