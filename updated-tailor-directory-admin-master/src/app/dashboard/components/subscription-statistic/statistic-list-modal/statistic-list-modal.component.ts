import {Component, ViewChild} from "@angular/core";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {OwnerModel} from "../../../../models/owner.model";
import {OwnersService} from "../../../../services/owners.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

@Component({
  selector: 'app-statistic-list-modal',
  templateUrl: './statistic-list-modal.component.html',
  styleUrls: ['./statistic-list-modal.component.scss']
})
export class StatisticListModalComponent {
  @ViewChild('content') content: Element;
  modal: NgbModalRef;
  list: OwnerModel[];
  title: string;
  page: number;
  limit = 20;
  total: number;
  isShowSpinner: boolean
  ownerType: string;

  constructor(
    private modalService: NgbModal,
    private ownerService: OwnersService
  ) {
  }

  onShowModal(title: string, ownerType: string) {
    this.list = [];
    this.title = title.replace('_', ' ');
    this.ownerType = ownerType;
    this.modal = this.modalService.open(this.content, {size: 'xl'});
    this.getPagingData(1);
  }

  getPagingData(page: number) {
    this.page = page;
    this.isShowSpinner = true;
    this.ownerService.getList(this.page, this.limit, {profileType: this.ownerType}).pipe(catchError(e => {
      this.isShowSpinner = false;
      return throwError(e);
    })).subscribe(r => {
      this.list = r.docs;
      this.total = r.total;
      this.isShowSpinner = false;
    })
  }

  importToCSV() {

  }

}
