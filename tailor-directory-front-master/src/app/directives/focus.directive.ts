import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective {

  constructor(el: ElementRef) {
    setTimeout(() => {
      el.nativeElement.focus();
    }, 200);
  }

}
