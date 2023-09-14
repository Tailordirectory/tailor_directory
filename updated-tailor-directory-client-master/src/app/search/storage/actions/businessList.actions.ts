import {createAction, props} from '@ngrx/store';
import {BusinessModel} from '../../../models/business.model';

export const getBusinessList = createAction('[Business - List] Get List');
export const loadingBusinessList = createAction('[Business - List] Loading List');
export const loadedBusinessList = createAction('[Business - List] Loaded List', props<{ list: BusinessModel[] }>());
