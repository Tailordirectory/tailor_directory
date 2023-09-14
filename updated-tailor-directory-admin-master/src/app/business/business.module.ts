import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BusinessRoutingModule} from './business-routing.module';
import {BusinessComponent} from './business.component';
import {ShareModule} from "../share.module";
import {EditBusinessModalComponent} from "./components/edit-business.modal/edit-business.modal";
import {DeleteConfirmationModal} from "./components/delete-confirmation.modal/delete-confirmation.modal";
import {AddBusinessComponent} from "./components/add-business/add-business.component";
import {EditBusinessProfileFormComponent} from "./components/edit-business-profile-form.component/edit-business-profile-form.component";
import {ImportBusinessListErrorModal} from "./components/import-business-list-error.modal/import-business-list-error.modal";


@NgModule({
  declarations: [
    BusinessComponent,
    EditBusinessModalComponent,
    DeleteConfirmationModal,
    AddBusinessComponent,
    EditBusinessProfileFormComponent,
    ImportBusinessListErrorModal
  ],
  providers: [],
  exports: [
  ],
  imports: [
    CommonModule,
    ShareModule,
    BusinessRoutingModule
  ]
})
export class BusinessModule {
}
