import {Action, createReducer, on} from '@ngrx/store';
import * as fromActions from '../actions/business-profile.actions';
import {BusinessModel} from '../../../models/business.model';

export interface BusinessProfileState {
  profile: BusinessModel | null;
  markerId: number | null;
  isVisible: boolean;
}

export const initBusinessProfileState: BusinessProfileState = {
  profile: null,
  markerId: null,
  isVisible: false
};

const reducer = createReducer(initBusinessProfileState,
  on(fromActions.getUserProfileStateAction, state => state),
  on(fromActions.setUserProfileStateAction, (state, {profile, markerId}) => ({...state, profile, markerId, isVisible: true})),
  on(fromActions.hideUserProfileStateAction, state => ({...state, isVisible: false, marker: null, profile: null})),
);

export function businessProfileReducer(state: BusinessProfileState | undefined, action: Action) {
  return reducer(state, action);
}
