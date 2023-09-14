import {HttpClient} from '@angular/common/http';

import {TranslateLoader} from '@ngx-translate/core';

import {Observable, of, forkJoin, throwError} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

import * as lodash from 'lodash';

export interface I18nResource {
  prefix: string;
  suffix?: string;
  group?: string;
}

export class HttpMultiLoaderServiceService implements TranslateLoader {

  constructor(
    private http: HttpClient,
    private i18nResources: Array<I18nResource>
  ) {
  }

  public getTranslation(lang: string): Observable<object> {
    const requests = this.i18nResources.map(resource => {
      const suffix = resource.suffix ? resource.suffix : '';
      return this.http.get<object>(`${resource.prefix}/${lang}${suffix}`)
        .pipe(
          catchError(error => {
            return of({});
          }),
          map(content => {
            if (resource.group) {
              content = {[resource.group]: content};
            }
            return content;
          })
        );
    });
    return forkJoin(requests)
      .pipe(
        map(response => lodash.merge({}, ...response)),
        switchMap(translation => {
          if (0 === Object.keys(translation).length) {
            throwError('NO_TRANSLATIONS');
          }
          return of(translation);
        })
      );
  }
}
