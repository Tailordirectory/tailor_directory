import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-confirm-success',
  templateUrl: './confirm-error.component.html',
  styleUrls: ['./confirm-error.component.scss']
})
export class ConfirmErrorComponent {

  message: string;

  constructor(
    protected route: ActivatedRoute
  ) {
    route.queryParams.subscribe(m => {
      this.message = m.message;
    });
  }

}
