import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {LoginGuard} from "./guards/login.guard";
import {NotFoundComponent} from "./components/not-found/not-found.component";


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'owners',
    loadChildren: () => import('./owners/owners.module').then(m => m.OwnersModule),
    canActivate: [LoginGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'business',
    loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'claims',
    loadChildren: () => import('./claim-requests/claim-requests.module').then(m => m.ClaimRequestsModule),
    canActivate: [LoginGuard]
  },
  {
    path:
      'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'account-types',
    loadChildren: () => import('./account-types/account-types.module').then(m => m.AccountTypesModule)
  },
  {
    path:
      'tags',
    loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule)
  },
  {
    path: 'manage',
    loadChildren: () => import('./manage/mange.module').then(m => m.MangeModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
