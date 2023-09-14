import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EditProfileComponent} from './components/edit-profile/index/edit-profile.component';
import {AboutUsComponent} from './components/ablut-us/about-us.component';
import {ContactUsComponent} from './components/contact-us/contact-us.component';
import {AuthGuard} from './guards/auth.guard';
import {ConfirmSuccessComponent} from './components/confirm/confirm-success.component/confirm-success.component';
import {ConfirmErrorComponent} from './components/confirm/confirm-error.component/confirm-error.component';
import {OffersPageComponent} from './components/offers/offers-page/offers-page.component';


const routes: Routes = [{
  path: '',
  loadChildren: () => import('./search/search.module').then(m => m.HomeModule)
},
  {
    path: 'edit',
    component: EditProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: AboutUsComponent
  },
  {
    path: 'contact',
    component: ContactUsComponent
  },
  {
    path: 'success',
    component: ConfirmSuccessComponent
  },
  {
    path: 'error',
    component: ConfirmErrorComponent
  },
  {
    path: 'offers',
    component: OffersPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
