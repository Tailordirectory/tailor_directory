import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { BusinessModel } from '../models/business.model';
import { BusinessService } from '../services/business.service';
import { businessFilterModel } from '../models/business-filter.model';
import { DeleteConfirmationModal } from './components/delete-confirmation.modal/delete-confirmation.modal';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EditBusinessModalComponent } from './components/edit-business.modal/edit-business.modal';
import { ImportBusinessListErrorModal } from './components/import-business-list-error.modal/import-business-list-error.modal';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent {

  businessList: BusinessModel[];
  businessDuplicatesList: BusinessModel[];
  page = 1;
  duplicatesPage = 1;
  limitList = [20, 40, 60, 100];
  sortBy = '';
  asc = true;
  total: number;
  totalDuplicates: number;
  limit: number;
  isLoading: boolean;
  showDuplicates: boolean

  filterForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    country: new FormControl(''),
    ownerFName: new FormControl(''),
    ownerLName: new FormControl(''),
    zip: new FormControl(''),
    businessType: new FormControl(''),
    createdDate: new FormControl(''),
    limit: new FormControl(this.limitList[0])
  });

  @ViewChild('deleteModal') deleteModal: DeleteConfirmationModal;

  @ViewChild('editModal') editModal: EditBusinessModalComponent;

  @ViewChild('importBusinessListErrorModal') importBusinessListErrorModal: ImportBusinessListErrorModal;

  constructor(
    private businessService: BusinessService,
    private notificationService: NotificationService
  ) {
    this.onGetBusiness(this.page);
  }

  onChangeTabs(showDuplicates: boolean) {
    this.showDuplicates = showDuplicates;
    if (!this.businessDuplicatesList && showDuplicates) {
      this.getDuplicates()
    }
  }

  getDuplicates(page?: number) {
    if (page) {
      this.duplicatesPage = page;
    }
    this.isLoading = true;
    this.businessService.getDuplicates().pipe(catchError(e => {
      this.isLoading = false;
      return throwError(e);
    })).subscribe(r => {
      this.businessDuplicatesList = r.docs;
      this.totalDuplicates = r.total;
      this.isLoading = false;
    })
  }

  onGetBusiness(page?: number, sortBy?: string, asc?: boolean) {
    if (sortBy === undefined) {
      this.sortBy = '';
      this.asc = true;
    }
    if (page) {
      this.page = page;
    }
    const filter: businessFilterModel = {};
    const form = this.filterForm.getRawValue();
    if (form.name && form.name !== '') {
      Object.assign(filter, {businessName: form.name});
    }
    if (form.country && form.country !== '') {
      Object.assign(filter, {country: form.country});
    }
    if (form.ownerFName && form.ownerFName !== '') {
      Object.assign(filter, {ownerFName: form.ownerFName});
    }
    if (form.ownerLName && form.ownerLName !== '') {
      Object.assign(filter, {ownerLName: form.ownerLName});
    }
    if (form.businessType && form.businessType !== '') {
      Object.assign(filter, {'businessTypeId.name': form.businessType});
    }
    if (form.zip && form.zip !== '') {
      Object.assign(filter, {zip: form.zip});
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
      Object.assign(filter, {date});
    }
    if (this.limit !== form.limit) {
      this.page = 1;
    }
    this.limit = form.limit;
    this.isLoading = true;
    this.businessService.getList(this.page, this.limit, filter, sortBy, asc).pipe(catchError(e => {
      this.isLoading = false;
      return throwError(e);
    })).subscribe(r => {
      this.businessList = r.docs;
      this.total = r.total;
      this.isLoading = false;
    });
  }

  onChangeSorting(sortBy: string) {
    if (sortBy === this.sortBy) {
      this.asc = !this.asc;
    }
    this.sortBy = sortBy;
    this.page = 1;
    this.onGetBusiness(this.page, this.sortBy, this.asc);
  }

  onDeleteBusiness(business: BusinessModel) {
    this.deleteModal.onShowModal(business);
  }

  onSkipFilter() {
    this.filterForm.get('name')?.setValue('');
    this.filterForm.get('country')?.setValue('');
    this.filterForm.get('ownerFName')?.setValue('');
    this.filterForm.get('ownerLName')?.setValue('');
    this.filterForm.get('zip')?.setValue('');
    this.filterForm.get('businessType')?.setValue('');
    this.filterForm.get('createdDate')?.setValue('');
    this.onGetBusiness(1);
  }

  onConfirmDelete(business: BusinessModel) {
    if (business) {
      this.businessService.deleteBusiness(business._id).subscribe(r => {
        this.onGetBusiness(this.page, this.sortBy, this.asc);
        this.notificationService.notify(business.businessName + ' has been successfully removed.')
      });
    }
  }

  onEditBusiness(business: BusinessModel) {
    this.editModal.onShowModal(business);
  }

  onListUpload(event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement || event.srcElement as HTMLInputElement;
    const logoFormData = new FormData();
    if (!target.files || target.files.length === 0) {
      return;
    }
    const logoFile: File = target.files.item(0) as File;
    logoFormData.append('file', logoFile);
    this.isLoading = true;
  }
}
