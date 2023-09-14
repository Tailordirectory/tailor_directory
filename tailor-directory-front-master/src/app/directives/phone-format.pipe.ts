import {Pipe, PipeTransform} from '@angular/core';
import {parsePhoneNumberFromString} from 'libphonenumber-js/min';

@Pipe({
  name: 'phone'
})
export class PhoneFormatPipe implements PipeTransform {
  transform(phoneValue: string, country: string, isLink?: boolean): any {
    try {
      const phoneNumber = parsePhoneNumberFromString(phoneValue);
      if (isLink) {
        return phoneNumber?.number;
      }
      return phoneNumber?.formatInternational();
    } catch (error) {
      return phoneValue;
    }
  }

}
