import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BusinessComponent} from './business.component';
import {AddBusinessComponent} from "./components/add-business/add-business.component";

const routes: Routes = [
  {
    path: '',
    component: BusinessComponent
  },
  {
    path: 'add/:ownerId',
    component: AddBusinessComponent
  },
  {
    path: 'add',
    component: AddBusinessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule {
}
