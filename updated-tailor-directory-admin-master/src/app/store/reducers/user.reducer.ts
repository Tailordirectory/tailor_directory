import {AppUserModel} from "../../models/user.model";
import {Action, createReducer, on} from "@ngrx/store";
import * as fromActions from '../actions/user.actions';

export interface UserState {
  user: AppUserModel | null,
  isLoaded: boolean
}

const userInitState: UserState = {
  user: null,
  isLoaded: false
}

const reducer = createReducer(userInitState,
  on(fromActions.getUserAction, state => state),
  on(fromActions.setUserAction, ((state, {user}) => ({...state, isLoaded: true, user}))),
);

export function userReducer(state: UserState | undefined, action: Action) {
  return reducer(state, action);
}
