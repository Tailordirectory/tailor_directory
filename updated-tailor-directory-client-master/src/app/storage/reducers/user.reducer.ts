import {AppUserModel} from '../../models/app-user.model';
import {Action, createReducer, on} from '@ngrx/store';
import * as userActions from '../actions/user.actions';

export interface UserState {
  loaded: boolean;
  user: AppUserModel | null;
}

export const userInitialState: UserState = {
  loaded: false,
  user: null
};

const reducer = createReducer(userInitialState,
  on(userActions.loadUserAction, (state, {user}) => ({...state, loaded: true, user})),
  on(userActions.getUserAction, state => state),
);

export function userReducer(state: UserState | undefined, action: Action) {
  return reducer(state, action);
}
