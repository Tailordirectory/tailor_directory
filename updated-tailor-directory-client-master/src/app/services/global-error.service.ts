import {Injectable, ErrorHandler, Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {NotificationService} from './notification.service';
import {ErrorService} from './error.service';
import * as Sentry from '@sentry/browser';

@Injectable()
export class GlobalErrorService implements ErrorHandler {

  constructor(
    private injector: Injector,
  ) {
  }

  handleError(error: any) {
    const errorService = this.injector.get(ErrorService);
    const notificationService = this.injector.get(NotificationService);
    if (error instanceof HttpErrorResponse) {
      // Server Error
      notificationService.notify(errorService.getServerMessage(error));
      if (error.status === 413) {
        notificationService.notify('errors.errors_upload_limit');
      }
    } else {
      // Client Error
      // Show Error notification message.
      notificationService.notify(errorService.getClientMessage(error));
      // Managing logs for Sentry.
      this.logError(error);
    }
  }

  // Send logs.
  logError(error: any) {
    if (!environment.production) {
      console.log('[ ERROR ]', error);
    }

    // if (!environment.production) {
    //   console.log('[ ERROR ]', error);
    // } else {
    //   Sentry.addBreadcrumb({
    //     category: 'log',
    //     message: `Error Service logError()`,
    //     data: {error},
    //     level: Sentry.Severity.Error
    //   });
    //   if (error instanceof HttpErrorResponse) {
    //     Sentry.captureMessage(error.status + ' - ' + error.message, Sentry.Severity.Error);
    //   } else {
    //     Sentry.captureException(error);
    //   }
    // }
  }

}
