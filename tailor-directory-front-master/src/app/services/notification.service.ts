import {Injectable, NgZone} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {SnackbarService} from 'ngx-snackbar';


export interface CustomNotify {
  timeout?: number;
  action?: {
    text: string;
    onClick(): any;
  };
}

@Injectable()
export class NotificationService {

  constructor(
    private snakbar: SnackbarService,
    private translate: TranslateService,
    protected ngZone: NgZone
  ) {
  }

  private show = (mssg: string, type?: string, callback?: any, custom?: CustomNotify) => {
    this.snakbar.add({
      msg: `${mssg}`,
      customClass: type ? `snackbar-${type}` : 'snackbar-error',
      timeout: custom && custom.timeout ? custom.timeout : 5000,
      action: custom && custom.action ?
        custom.action : {
          text: 'X',
          onClick: () => {

          },
        },
      onAdd: callback ? callback : (snack: any) => snack
    });
  };

  notify(msgCode?: string, type?: string, custom?: CustomNotify, callback?: any, value?: object) {
    this.translate.get(msgCode ? msgCode : 'global.default_error_message', value ? value : undefined)
      .subscribe(
        (translation: string) => {
          this.ngZone.run(() => {
            this.show(translation, type, callback, custom);
          });
        },
        (err: Error) => {
          this.notify('Ooops! Something went wrong.');
        }
      );
  }

  removeById(id: string) {
    this.snakbar.remove(id);
  }
}
