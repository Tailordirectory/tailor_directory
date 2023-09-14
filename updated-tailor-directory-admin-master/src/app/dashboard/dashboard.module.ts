import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {NewBusinessStatistic} from "./components/new-business-statistic/new-business-statistic";
import {ShareModule} from "../share.module";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {ListModalComponent} from "./components/new-business-statistic/list-modal.component/list-modal";
import {SubscriptionStatisticComponent} from "./components/subscription-statistic/subscription-statistic.component";
import {StatisticListModalComponent} from "./components/subscription-statistic/statistic-list-modal/statistic-list-modal.component";


@NgModule({
  declarations: [
    DashboardComponent,
    NewBusinessStatistic,
    ListModalComponent,
    SubscriptionStatisticComponent,
    StatisticListModalComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    NgxChartsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {
}
