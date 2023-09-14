import {Directive, ElementRef, Input, Renderer2} from "@angular/core";

@Directive({
  selector: '[showSpinner]'
})
export class SpinnerDirective {

  @Input('showSpinner') set onSetSpinner(showSpinner: boolean) {
    this.onShowSpinner(showSpinner);
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2) {
  }

  onShowSpinner(showSpinner: boolean) {
    if (showSpinner) {
      this.renderer.addClass(this.el.nativeElement, 'spinner');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'spinner');
    }
  }

}
