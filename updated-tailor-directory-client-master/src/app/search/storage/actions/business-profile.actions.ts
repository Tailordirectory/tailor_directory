import {createAction, props} from '@ngrx/store';
import {BusinessModel} from '../../../models/business.model';

export const getUserProfileStateAction = createAction('[Business-Profile-Medium] - Get State');
export const setUserProfileStateAction = createAction('[Business-Profile-Medium] - Set State', props<{ profile: BusinessModel, markerId: number }>());
export const hideUserProfileStateAction = createAction('[Business-Profile-Medium] - Hide Profile');
