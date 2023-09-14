import {createAction, props} from '@ngrx/store';
import {BusinessTypesModel} from '../../models/business-types.model';

export const loadBusinessTypeAction = createAction('[Business-Type] Load Action');
export const getListBusinessTypeAction = createAction('[Business-Type] Get List Action');
export const loadedBusinessTypeAction = createAction('[Business-Type] Loaded Action', props<{ list: BusinessTypesModel[] }>());
