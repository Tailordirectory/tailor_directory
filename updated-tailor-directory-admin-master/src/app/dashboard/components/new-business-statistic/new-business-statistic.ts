import {Component, OnInit, ViewChild} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {businessFilterModel} from "../../../models/business-filter.model";
import {ListModalComponent} from "./list-modal.component/list-modal";
import {DatePipe} from "@angular/common";
import {StatisticService} from "../../../services/statistic.service";
import {BusinessStatisticModel} from "../../../models/statistic.model";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {ApiRouterService} from "../../../services/api-router.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-business-statistic',
  templateUrl: './new-business-statistic.html',
  styleUrls: ['./new-business-statistic.scss']
})
export class NewBusinessStatistic implements OnInit {
  isShowSpinner: boolean;
  data: { name: string; value: number }[];
  datePipe: DatePipe = new DatePipe('en-US');
  businessStatistic: BusinessStatisticModel;
  filter: businessFilterModel;
  total: number;


  @ViewChild('listModal') listModal: ListModalComponent;

  constructor(
    private statisticService: StatisticService
  ) {
  }

  showByAdmins() {
    const form = this.filterForm.getRawValue();
    const date = this.datePipe.transform(form.filterDate[0], 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(form.filterDate[1], 'dd/MM/yyyy');
    this.listModal.onShowModal('Created by Admin for ' + date, 'admin', this.filter);
  }

  showByOwners() {
    const form = this.filterForm.getRawValue();
    const date = this.datePipe.transform(form.filterDate[0], 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(form.filterDate[1], 'dd/MM/yyyy');
    this.listModal.onShowModal('Created by Owners for ' + date, 'owner', this.filter);
  }

  showByClaims() {
    const form = this.filterForm.getRawValue();
    const date = this.datePipe.transform(form.filterDate[0], 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(form.filterDate[1], 'dd/MM/yyyy');
    this.listModal.onShowModal('Created by Claim requests for ' + date, 'claim', this.filter);
  }

  filterForm: FormGroup = new FormGroup({
    filterDate: new FormControl([new Date(new Date().setDate(1)), new Date()])
  });

  ngOnInit(): void {
    this.getByBusiness();
  }

  getByBusiness() {
    const form = this.filterForm.getRawValue();
    form.filterDate[0].setHours(0);
    form.filterDate[0].setMinutes(0);
    form.filterDate[1].setHours(23);
    form.filterDate[1].setMinutes(59);
    this.filter = {
      date: {
        createdFrom: form.filterDate[0].toString(),
        createdTo: form.filterDate[1].toString(),
      }
    }
    this.isShowSpinner = true;
    this.statisticService.getRegisteredBusiness(form.filterDate[0], form.filterDate[1]).pipe(catchError(e => {
      this.isShowSpinner = false;
      return throwError(e);
    })).subscribe(r => {
      this.businessStatistic = r;
      this.isShowSpinner = false;
      this.updateChart();
    });
  }

  updateChart() {
    this.data = [];
    this.total = 0;
    this.data.push({name: "Admin", value: this.businessStatistic.admin});
    this.data.push({name: "Claim", value: this.businessStatistic.claim});
    this.data.push({name: "Owner", value: this.businessStatistic.owner});
    this.data.forEach(d => {
      this.total += d.value;
    })
  }

  getFileLink() {
    const form = this.filterForm.getRawValue();
    this.statisticService.getBusinessFile(form.filterDate[0], form.filterDate[1]);
  }

  onClear() {
    this.filterForm.get('filterDate')?.setValue([new Date(new Date().setDate(1)), new Date()]);
    this.getByBusiness();
  }
}
