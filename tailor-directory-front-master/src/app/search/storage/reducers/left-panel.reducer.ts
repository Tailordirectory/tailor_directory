import {Action, createReducer, on} from '@ngrx/store';
import * as fromActions from '../actions/left-panel.action';

export interface LeftPanelState {
  showPanel: boolean;
}

export const panelState: LeftPanelState = {
  showPanel: false
};

const reducer = createReducer(panelState,
  on(fromActions.getPanelAction, state => state),
  on(fromActions.hidePanelAction, state => ({...state, showPanel: false})),
  on(fromActions.showPanelAction, state => ({...state, showPanel: true}))
);

export function panelReducer(state: LeftPanelState | undefined, action: Action) {
  return reducer(state, action);
}
