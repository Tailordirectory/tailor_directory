import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-confirm-success',
  templateUrl: './confirm-success.component.html',
  styleUrls: ['./confirm-success.component.scss']
})
export class ConfirmSuccessComponent {

  message: string;

  constructor(
    protected route: ActivatedRoute
  ) {
    route.queryParams.subscribe(m => {
      this.message = m.message;
    });
  }

}
