import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ClaimRequestsRoutingModule} from './claim-requests-routing.module';
import {ClaimRequestsComponent} from './claim-requests.component';
import {SetNoticeComponent} from "./components/set-notice/set-notice.component";
import {ShareModule} from "../share.module";
import {DeleteConfirmationModal} from "./components/delete-confirmation.modal/delete-confirmation.modal";


@NgModule({
  declarations: [
    ClaimRequestsComponent,
    SetNoticeComponent,
    DeleteConfirmationModal
  ],
  imports: [
    ShareModule,
    CommonModule,
    ClaimRequestsRoutingModule
  ]
})
export class ClaimRequestsModule {
}
