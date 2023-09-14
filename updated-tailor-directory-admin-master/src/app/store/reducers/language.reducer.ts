import {LanguageModel} from '../../models/language.model';
import * as fromActions from '../actions/language.actions';
import {Action, createReducer, on} from '@ngrx/store';


export interface LanguageState {
  current: LanguageModel;
  list: LanguageModel[];
}

const domain = window.location.origin;
const location = (domain.includes('.com') || domain.includes('localhost')) ? 'en' : 'de';
const defaultLanguage = (location === 'en') ? {name: 'Eng', lang: location} : {name: 'De', lang: location};

export const languageInitState: LanguageState = {
  current: defaultLanguage,
  list: [{lang: 'de', name: 'De'}, {lang: 'en', name: 'Eng'}]
};

const reducer = createReducer(languageInitState,
  on(fromActions.getLanguage, state => state),
  on(fromActions.getLanguageList, state => state),
  on(fromActions.setLanguage, ((state, action) => ({
    ...state,
    current: {
      name: action.name,
      lang: action.lang,
    },
    list: state.list
  }))));

export function languageReducer(state: LanguageState | undefined, action: Action) {
  return reducer(state, action);
}
