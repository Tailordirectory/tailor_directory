import {Component, ViewChild} from "@angular/core";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {BusinessCSVModel, BusinessModel} from "../../../../models/business.model";
import {ngxCsv} from "ngx-csv";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs";
import {BusinessService} from "../../../../services/business.service";
import {businessFilterModel} from "../../../../models/business-filter.model";

@Component({
  selector: 'app-list-modal',
  templateUrl: './list-modal.html',
  styleUrls: ['./list-modal.scss']
})
export class ListModalComponent {
  @ViewChild('content') content: Element;
  modal: NgbModalRef;
  list: BusinessModel[];
  title: string;
  CSV: BusinessCSVModel[];
  CSVHeaders: string[];
  filter: businessFilterModel;
  isShowSpinner: boolean;
  page: number;
  limit = 20;
  total: number;
  type: string;

  constructor(
    private modalService: NgbModal,
    private businessService: BusinessService,
  ) {
    this.CSVHeaders = ['ID', 'Name', 'Group', 'Type', 'County', 'City', 'Address', 'E-Mail', 'Owner', 'Created By', 'Created', 'Updated']
  }

  onShowModal(title: string, type: 'admin' | 'claim' | 'owner', filter: businessFilterModel) {
    this.filter = filter;
    Object.assign(this.filter, {createdBy: type});
    this.title = title;
    this.type = type;
    this.modal = this.modalService.open(this.content, {size: 'xl'});
    this.getData(1);
  }

  importToCSV() {
    new ngxCsv(this.CSV, this.title, {headers: this.CSVHeaders});
  }

  getData(page: number) {
    this.page = page;
    this.list = [];
    this.isShowSpinner = true;
    this.businessService.getList(this.page, this.limit, this.filter).pipe(catchError(e => {
        this.isShowSpinner = false;
        return throwError(e);
      }),
      tap(r => {
        this.CSV = [];
        r.docs.forEach(d => {
          this.CSV.push({
            _id: d._id,
            businessName: d.businessName,
            groupName: d.groupName,
            businessType: d.businessType,
            country: d.country,
            city: d.city,
            address: d.address,
            email: d.email,
            owner: d.ownerId?.firstName + ' ' + d.ownerId?.lastName,
            createdBy: d.createdBy,
            createdAt: d.createdAt as Date,
            updatedAt: d.updatedAt as Date
          });
        });
      })).subscribe(r => {
      this.list = r.docs;
      this.total = r.total;
      this.isShowSpinner = false;
    });
  }
}
