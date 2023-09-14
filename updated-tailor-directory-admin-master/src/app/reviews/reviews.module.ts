import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReviewsRoutingModule} from './reviews-routing.module';
import {ReviewsComponent} from './reviews.component';
import {ShareModule} from "../share.module";
import {ShowCommentModal} from "./components/show-comment-modal/show-comment-modal";


@NgModule({
  declarations: [
    ReviewsComponent,
    ShowCommentModal
  ],
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    ShareModule
  ]
})
export class ReviewsModule {
}
