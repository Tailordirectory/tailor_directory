import {NgModule} from '@angular/core';

import {OwnersRoutingModule} from './owners-routing.module';
import {OwnersComponent} from './owners.component';
import {ShareModule} from "../share.module";
import {DeleteConfirmationModal} from "./components/delete-confirmation.modal/delete-confirmation.modal";
import {AddOwnerFormComponent} from "./components/add-owner-form/add-owner-form";
import {EditOwnerFormComponent} from "./components/edit-owner-form/edit-owner-form";
import {AddEditOwnerModalComponent} from "./components/add-edit-owner-modal/add-edit-owner.modal";


@NgModule({
  declarations: [
    OwnersComponent,
    DeleteConfirmationModal,
    AddEditOwnerModalComponent,
    AddOwnerFormComponent,
    EditOwnerFormComponent
  ],
  imports: [
    OwnersRoutingModule,
    ShareModule
  ],
})
export class OwnersModule {
}
