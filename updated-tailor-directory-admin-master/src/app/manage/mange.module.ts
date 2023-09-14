import {NgModule} from "@angular/core";
import {ManageComponent} from "./manage.component";
import {ManageRoutingModule} from "./manage-routing.module";
import {CommonModule} from "@angular/common";
import {ShareModule} from "../share.module";

@NgModule({
  declarations: [
    ManageComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    ManageRoutingModule
  ]
})
export class MangeModule{}
