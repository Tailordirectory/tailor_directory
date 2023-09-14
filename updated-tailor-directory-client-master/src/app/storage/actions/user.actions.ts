import {createAction, props} from '@ngrx/store';
import {AppUserModel} from '../../models/app-user.model';

export const getUserAction = createAction('[User - Get Action]');
export const loadUserAction = createAction('[User - Loaded Action]', props<{ user: AppUserModel | null }>());

export const userActions = [getUserAction, loadUserAction];
