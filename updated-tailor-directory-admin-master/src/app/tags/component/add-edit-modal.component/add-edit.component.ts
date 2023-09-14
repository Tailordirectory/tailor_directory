import {Component, ElementRef, OnInit, Output, ViewChild} from "@angular/core";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Observable, Subject, throwError} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TagsModel} from "../../../models/tags.model";
import {TagsService} from "../../../services/tags.service";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-add-edit-service',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditServiceModal {

  @ViewChild('content') content: ElementRef;
  @Output('update') update: Subject<void> = new Subject<void>();
  modal: NgbModalRef;
  editForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  service: TagsModel;
  isEdit: boolean;
  isShowSpinner: boolean;

  constructor(
    private modalService: NgbModal,
    private tagsService: TagsService
  ) {
  }

  onShowModal(service?: TagsModel) {
    if (service) {
      this.isEdit = true;
      this.service = service;
      this.editForm.get('name')?.setValue(service.name);
    } else {
      this.isEdit = false;
      this.editForm.get('name')?.setValue('');
    }
    this.modal = this.modalService.open(this.content);
  }

  onSubmit() {
    this.editForm.get('name')?.markAsTouched();
    if (this.editForm.invalid) {
      return;
    }
    this.isShowSpinner = true;
    const name = this.editForm.get('name')?.value;
    let updateResult$: Observable<TagsModel>;
    if (this.isEdit) {
      updateResult$ = this.tagsService.updateTag(this.service._id, name)
    } else {
      updateResult$ = this.tagsService.addTag(name);
    }
    updateResult$.pipe(catchError(e => {
      this.isShowSpinner = false;
      return throwError(e);
    })).subscribe(r => {
      this.isShowSpinner = false;
      this.update.next();
      this.modal.close();
    });
  }
}
