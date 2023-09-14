import {Injectable, ErrorHandler, Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

import * as Sentry from '@sentry/browser';

import {environment} from '../../environments/environment';

import {ErrorService} from './error.service';
import {NotificationService} from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorService implements ErrorHandler {

  constructor(
    private injector: Injector,
  ) {
  }

  handleError(error: any) {
    // 'throwError' - variable to manage sending errors to log.
    let throwError = true;
    const errorService = this.injector.get(ErrorService);
    const notificationService = this.injector.get(NotificationService);
    if (error instanceof HttpErrorResponse) {
      // Handling 504 or 0 error for /api/generate request when request timeout error from nginx proxy.
      if (error.status === 504 || error.status === 0) {
        if (!error?.url?.includes('/api/generate')) {
          notificationService.notify('errors.errors_get_way_timeout');
        } else {
          // Do not send error in Sentry if api/generate (expected error);
          throwError = false;
        }
      }
      // Server Error
      if (error.error.hiddenNotification === false) {
        // Show Error notification message.
        notificationService.notify(errorService.getServerMessage(error));

      } else if (error.status === 413) {
        notificationService.notify('errors.errors_upload_limit');
      }
      // Managing logs for Sentry.
      if (throwError) {
        this.logError(error);
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
    } else {
      // Sentry.addBreadcrumb({
      //   category: 'log',
      //   message: `Error Service logError()`,
      //   data: {error},
      //   level: Sentry.Severity.Error
      // });
      // if (error instanceof HttpErrorResponse) {
      //   Sentry.captureMessage(error.status + ' - ' + error.message, Sentry.Severity.Error);
      // } else {
      //   Sentry.captureException(error);
      // }
    }
  }
}
