import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountTypesComponent } from './account-types.component';

const routes: Routes = [{ path: '', component: AccountTypesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountTypesRoutingModule { }
