import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaimRequestsComponent } from './claim-requests.component';

const routes: Routes = [{ path: '', component: ClaimRequestsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRequestsRoutingModule { }
