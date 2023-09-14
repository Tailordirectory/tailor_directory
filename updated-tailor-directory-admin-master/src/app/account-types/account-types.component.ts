import {Component, OnInit, ViewChild} from '@angular/core';
import {BusinessTypesModel} from "../models/business-types.model";
import {BusinessTypesService} from "../services/business-types.service";
import {catchError, tap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {AddEditBusinessTypeComponent} from "./component/add-edit-business-type/add-edit-business-type.component";
import {DeleteConfirmationModal} from "./component/delete-confirmation.modal/delete-confirmation.modal";

@Component({
  selector: 'app-account-types',
  templateUrl: './account-types.component.html',
  styleUrls: ['./account-types.component.scss']
})
export class AccountTypesComponent implements OnInit {

  types$: Observable<BusinessTypesModel[]>;
  isLoading: boolean;
  @ViewChild('addEditModal') addEditModal: AddEditBusinessTypeComponent;
  @ViewChild('deleteModal') deleteModal: DeleteConfirmationModal;

  constructor(
    private businessTypesService: BusinessTypesService
  ) {
  }

  onGetTypes() {
    this.isLoading = true;
    this.types$ = this.businessTypesService.getList().pipe(
      catchError(e => {
        this.isLoading = false;
        return throwError(e);
      }),
      tap(r => {
        this.isLoading = false;
      }));
  }

  ngOnInit(): void {
    this.onGetTypes();
  }

  onEditType(type: BusinessTypesModel) {
    this.addEditModal.onShowModal(type);
  }

  onAddType() {
    this.addEditModal.onShowModal();
  }

  onDeleteType(type: BusinessTypesModel) {
    this.deleteModal.onShowModal(type);
  }
}
