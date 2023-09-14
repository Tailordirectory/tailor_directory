import {createAction, props} from '@ngrx/store';
import {BusinessModel} from '../../../models/business.model';

export const getTailorsList = createAction('[Tailors - List] Get List');
export const loadingTailorsList = createAction('[Tailors - List] Loading List');
export const loadedTailorsList = createAction('[Tailors - List] Loaded List', props<{ list: BusinessModel[] }>());
