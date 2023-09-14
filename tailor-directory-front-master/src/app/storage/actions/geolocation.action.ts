import {createAction, props} from '@ngrx/store';

export const getGeolocation = createAction('[Geolocation] Get positions');
export const setGeolocation = createAction('[Geolocation] Set positions', props<{ position: Position | null, hasError: boolean }>());
