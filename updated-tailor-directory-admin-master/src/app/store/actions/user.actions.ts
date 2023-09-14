import {createAction, props} from "@ngrx/store";
import {AppUserModel} from "../../models/user.model";

export const getUserAction = createAction('[User] - Get Current User');
export const setUserAction = createAction('[User] - Set Current User', props<{ user: AppUserModel | null }>());
