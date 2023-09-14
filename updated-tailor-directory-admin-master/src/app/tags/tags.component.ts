import {Component, OnInit, ViewChild} from '@angular/core';
import {NotificationService} from "../services/notification.service";
import {TagsService} from "../services/tags.service";
import {TagsFilterModel, TagsModel} from "../models/tags.model";
import {FormControl, FormGroup} from "@angular/forms";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {AddEditServiceModal} from "./component/add-edit-modal.component/add-edit.component";
import {ConfirmDeleteModal} from "./component/confirm-delete-modal/confirm-delete-modal";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  pageList = [20, 40, 60, 100];
  pageLimit: number;
  currentPageLimit: number;
  page: number;
  total: number;
  sortBy: string;
  asc: boolean;
  tagsList: TagsModel[];
  isShowSpinner: boolean;
  filterForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    createdDate: new FormControl('')
  });
  @ViewChild('addEditModal') addEditModal: AddEditServiceModal;
  @ViewChild('confirmDeleteModal') confirmDeleteModal: ConfirmDeleteModal;

  constructor(
    private notificationService: NotificationService,
    private tagsService: TagsService
  ) {
    this.pageLimit = this.currentPageLimit = this.pageList[0];
  }

  ngOnInit(): void {
    this.getList(1);
  }

  clearFilter() {
    this.filterForm.get('name')?.setValue('');
    this.filterForm.get('createdDate')?.setValue('');
    this.sortBy = '';
    this.getList(1);
  }

  find() {
    this.getList(1)
  }

  getList(page?: number, sortBy?: string) {
    if (page != undefined) {
      this.page = page;
    }
    const form = this.filterForm.getRawValue();
    const filter: TagsFilterModel = {};
    if (form.name && form.name !== '') {
      Object.assign(filter, {name: form.name});
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
    if (this.currentPageLimit !== this.pageLimit) {
      this.page = 1;
    }
    this.currentPageLimit = this.pageLimit;
    this.isShowSpinner = true;
    this.tagsService.loadTagsList(filter, this.page, this.currentPageLimit, this.sortBy, this.asc).pipe(catchError(e => {
      this.isShowSpinner = false;
      return throwError(e);
    })).subscribe(r => {
      this.tagsList = r.docs;
      this.total = r.total;
      this.isShowSpinner = false;
    });
  }

  onChangeSorting(sortBy: string) {
    if (sortBy === this.sortBy) {
      this.asc = !this.asc;
    }
    this.sortBy = sortBy;
    this.page = 1;
    this.getList(this.page, this.sortBy);
  }

  onAdd() {
    this.addEditModal.onShowModal();
  }

  onEditTag(tag: TagsModel) {
    this.addEditModal.onShowModal(tag);
  }

  onDeleteTag(tag: TagsModel) {
    this.confirmDeleteModal.onShowModal(tag);
  }
}
