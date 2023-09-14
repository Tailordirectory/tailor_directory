import {RouterModule, Routes} from "@angular/router";
import {ManageComponent} from "./manage.component";
import {NgModule} from "@angular/core";

const routes: Routes = [{
  path: '',
  component: ManageComponent
}]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ManageRoutingModule {

}
