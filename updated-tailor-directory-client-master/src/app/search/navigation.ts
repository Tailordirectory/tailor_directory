import {Routes} from '@angular/router';
import {BusinessSearchComponent} from './components/bisiness-search/business-search.component';
import {BusinessProfileComponent} from './components/business-profile/business-profile.component';
import {ListPageComponent} from './components/list-page/list-page.component';

export const routes: Routes = [
  {
    path: '',
    component: BusinessSearchComponent,
  },
  {
    path: 'list',
    component: ListPageComponent
  },
  {
    path: 'profile/:id',
    component: BusinessProfileComponent
  }
];
