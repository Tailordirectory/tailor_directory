import {Component, Input} from '@angular/core';
import {BusinessModel} from '../../../models/business.model';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent {

  @Input('business') business: BusinessModel;
  @Input('isList') isList: boolean;
  @Input('isButton') isButton: boolean;
  @Input('showTitle') showTitle: boolean;

  constructor() {
  }

}
