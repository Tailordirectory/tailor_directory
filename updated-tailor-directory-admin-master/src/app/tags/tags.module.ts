import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TagsRoutingModule} from './tags-routing.module';
import {TagsComponent} from './tags.component';
import {ShareModule} from "../share.module";
import {AddEditServiceModal} from "./component/add-edit-modal.component/add-edit.component";
import {ConfirmDeleteModal} from "./component/confirm-delete-modal/confirm-delete-modal";


@NgModule({
  declarations: [
    TagsComponent,
    AddEditServiceModal,
    ConfirmDeleteModal
  ],
  imports: [
    CommonModule,
    ShareModule,
    TagsRoutingModule
  ]
})
export class TagsModule {
}
