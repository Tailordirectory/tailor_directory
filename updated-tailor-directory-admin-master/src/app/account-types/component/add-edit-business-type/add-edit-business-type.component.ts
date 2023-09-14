import {AfterViewInit, Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {NotificationService} from "../../../services/notification.service";
import {BusinessTypesService} from "../../../services/business-types.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {BusinessTypesModel} from "../../../models/business-types.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'add-edit-business-type',
  templateUrl: './add-edit-business-type.component.html',
  styleUrls: ['./add-edit-business-type.component.scss']
})
export class AddEditBusinessTypeComponent {

  isEdit: boolean;
  modal: NgbModalRef;
  type: BusinessTypesModel;
  isLoading: boolean;
  request$: Observable<BusinessTypesModel>;
  logoRef: HTMLElement;
  private logoFormData = new FormData();

  @ViewChild('content') content: Element;
  @Output('onClose') onClose: EventEmitter<void> = new EventEmitter<void>();

  addEditForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  })

  constructor(
    private businessTypesService: BusinessTypesService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
  ) {
  }

  onShowModal(type?: BusinessTypesModel) {
    if (type) {
      this.isEdit = true;
      this.type = type;
      this.addEditForm.get('name')?.setValue(type.name);
    } else {
      this.isEdit = false;
    }
    this.modal = this.modalService.open(this.content);
    this.modal.result.finally(() => {
      this.addEditForm.reset();
    });
    setTimeout(() => {
      this.logoRef = this.getElementById('upload-logo-input');
    },);
  }

  onSave() {
    if (this.addEditForm.invalid) {
      return;
    }
    this.isLoading = true;
    const name = this.addEditForm.getRawValue().name;
    if (this.isEdit) {
      this.request$ = this.businessTypesService.editTag(this.type._id, name);
    } else {
      this.request$ = this.businessTypesService.addTag(name);
    }
    this.request$.pipe(
      catchError(e => {
        this.isLoading = false;
        return throwError(e);
      })).subscribe(r => {
      if (this.isEdit) {
        this.notificationService.notify('Business type has been successfully updated.', 'success');
      } else {
        this.notificationService.notify('Business type has been successfully added.', 'success');
      }
      this.isLoading = false;
      this.onClose.emit();
      this.modal.close();
    });
  }

  onUpdateLogo() {
    this.logoRef.click();
  }

  onLogoUpload(event: any) {
    if (!this.isEdit) {
      return;
    }
    const target = event.target || event.srcElement;
    this.logoFormData = new FormData();
    if (!target.files || target.files.length === 0) {
      return;
    }
    const logoFile: File = target.files.item(0);
    this.logoFormData.append('file', logoFile);
    this.isLoading = true;
    this.businessTypesService.updateIcon(this.type._id, this.logoFormData).pipe(catchError(e => {
      this.isLoading = false;
      return throwError(e);
    })).subscribe(r => {
      this.isLoading = false;
      this.type.icon = r.doc;
      this.notificationService.notify('Icon has been successfully uploaded.', 'success');
    });
  }

  private getElementById(id: string): HTMLElement {
    return document.getElementById(id) as HTMLElement;
  }

}
