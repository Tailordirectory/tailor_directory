import {Component, OnInit, ViewChild} from "@angular/core";
import {StatisticService} from "../../../services/statistic.service";
import {StatisticListModalComponent} from "./statistic-list-modal/statistic-list-modal.component";
import {SubscriptionsStatisticModel} from "../../../models/statistic.model";

@Component({
  selector: 'app-subscriptions-statistic',
  templateUrl: './subscription-statistic.component.html',
  styleUrls: ['./subscription-statistic.component.scss']
})
export class SubscriptionStatisticComponent implements OnInit {

  @ViewChild('listModal') listModal: StatisticListModalComponent;
  isShowSpinner: boolean;
  statisticModel: SubscriptionsStatisticModel;
  data: { name: string; value: number }[] = [];
  total: number;

  constructor(
    private statisticService: StatisticService
  ) {
  }

  getData() {
    this.statisticService.getProfileTypes().subscribe(r => {
      this.statisticModel = r;
      this.data = [];
      this.total = 0;
      this.data.push({name: 'Basic', value: (r.basic) ? r.basic : 0});
      this.data.push({name: 'Premium', value: (r.premium) ? r.premium : 0});
      this.data.push({name: 'Premium Plus', value: (r.premium_plus) ? r.premium_plus : 0});
      this.data.push({name: 'Expired Premium', value: (r.premium_expired) ? r.premium_expired : 0});
      this.data.push({name: 'Expired Premium Plus', value: (r.premium_plus_expired) ? r.premium_plus_expired : 0});
      this.data.forEach(d => {
        this.total += d.value;
      })
    });
  }

  getSortedData(ownerType: 'basic' | 'premium' | 'premium_plus' | 'premium_expired' | 'premium_plus_expired') {
    if (!this.statisticModel[ownerType] || this.statisticModel[ownerType] === 0) {
      return;
    }
    this.listModal.onShowModal(ownerType, ownerType);
  }

  getFileLink() {
    this.statisticService.getProfileFile();
  }

  ngOnInit(): void {
    this.getData();
  }

}
