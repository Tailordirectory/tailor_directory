import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnersComponent } from './owners.component';

const routes: Routes = [{ path: '', component: OwnersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnersRoutingModule { }
