import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountTypesRoutingModule} from './account-types-routing.module';
import {AccountTypesComponent} from './account-types.component';
import {AddEditBusinessTypeComponent} from "./component/add-edit-business-type/add-edit-business-type.component";
import {ShareModule} from "../share.module";
import {DeleteConfirmationModal} from "./component/delete-confirmation.modal/delete-confirmation.modal";


@NgModule({
  declarations: [AccountTypesComponent, AddEditBusinessTypeComponent, DeleteConfirmationModal],
  imports: [
    CommonModule,
    AccountTypesRoutingModule,
    ShareModule
  ]
})
export class AccountTypesModule {
}
