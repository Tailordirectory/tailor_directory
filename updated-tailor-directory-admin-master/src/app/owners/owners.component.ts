import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {DeleteConfirmationModal} from "./components/delete-confirmation.modal/delete-confirmation.modal";
import {NotificationService} from "../services/notification.service";
import {OwnerModel} from "../models/owner.model";
import {OwnersService} from "../services/owners.service";
import {OwnersFilterModel} from "../models/owners-response.model";
import {AddEditOwnerModalComponent} from "./components/add-edit-owner-modal/add-edit-owner.modal";
import {ProfileTypesService} from "../services/profile-types.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss']
})
export class OwnersComponent implements OnInit {

  ownersList: OwnerModel[];
  profileTypes: string[];
  page = 1;
  limitList = [20, 40, 60];
  sortBy = '';
  asc: boolean = true;
  total: number;
  limit: number;

  filterForm: FormGroup = new FormGroup({
    fName: new FormControl(''),
    lName: new FormControl(''),
    email: new FormControl(''),
    subscription: new FormControl(null),
    createdDate: new FormControl(''),
    limit: new FormControl(this.limitList[0])
  });

  @ViewChild('deleteModal') deleteModal: DeleteConfirmationModal;
  @ViewChild('addEditModal') addEditModal: AddEditOwnerModalComponent;
  isShowSpinner: boolean;

  constructor(
    private ownersService: OwnersService,
    private profileTypesService: ProfileTypesService,
    private notificationService: NotificationService
  ) {
    this.onGetOwners(this.page);
  }

  onGetOwners(page: number, sortBy?: string, asc?: boolean) {
    if (sortBy == undefined) {
      this.sortBy = '';
      this.asc = true;
    }
    const filter: OwnersFilterModel = {};
    const form = this.filterForm.getRawValue();
    if (form.fName && form.fName !== '') {
      Object.assign(filter, {firstName: form.fName});
    }
    if (form.lName && form.lName !== '') {
      Object.assign(filter, {lastName: form.lName});
    }
    if (form.email && form.email !== '') {
      Object.assign(filter, {email: form.email});
    }
    if (form.subscription && form.subscription !== '') {
      Object.assign(filter, {profileType: form.subscription});
    }
    if (form.createdDate !== '' && form.createdDate[0] !== null) {
      form.createdDate[0].setHours(0);
      form.createdDate[0].setMinutes(0);
      form.createdDate[1].setHours(23);
      form.createdDate[1].setMinutes(59);
      const date = {
        createdFrom: form.createdDate[0].toString(),
        createdTo: form.createdDate[1].toString(),
      }
      Object.assign(filter, {date: date});
    }
    if (this.limit != form.limit) {
      this.page = 1;
    }
    this.limit = form.limit;
    this.isShowSpinner = true;
    this.ownersService.getList(page, this.limit, filter, sortBy, asc).pipe(catchError(e => {
      this.isShowSpinner = false;
      return throwError(e);
    })).subscribe(r => {
      this.isShowSpinner = false;
      this.ownersList = r.docs;
      this.total = r.total;
    });
  }

  onChangeSorting(sortBy: string) {
    if (sortBy === this.sortBy) {
      this.asc = !this.asc;
    }
    this.sortBy = sortBy;
    this.page = 1;
    this.onGetOwners(this.page, this.sortBy, this.asc);
  }

  onDeleteOwner(owner: OwnerModel) {
    this.deleteModal.onShowModal(owner);
  }

  onConfirmDelete(owner: OwnerModel) {
    if (owner) {
      this.ownersService.onDelete(owner._id).subscribe(r => {
        this.onGetOwners(this.page, this.sortBy, this.asc);
        this.notificationService.notify(owner.firstName + ' ' + owner.lastName + ' has been successfully removed.')
      });
    }
  }

  ngOnInit(): void {
    this.profileTypesService.getList().subscribe(r => {
      this.profileTypes = Object.keys(r);
    })
  }

  onEditOwner(owner: OwnerModel) {
    this.addEditModal.onShowModal(owner);
  }

  onAddNewOwner() {
    this.addEditModal.onShowModal(null);
  }

  onClear() {
    this.filterForm.get('fName')?.setValue('');
    this.filterForm.get('lName')?.setValue('');
    this.filterForm.get('email')?.setValue('');
    this.filterForm.get('subscription')?.setValue(null);
    this.filterForm.get('createdDate')?.setValue('');
    this.sortBy = '';
    this.onGetOwners(1);
  }
}
