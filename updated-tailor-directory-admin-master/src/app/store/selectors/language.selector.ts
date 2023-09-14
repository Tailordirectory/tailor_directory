import {AppState} from './index';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {LanguageState} from '../reducers/language.reducer';

const languageStateFeature = createFeatureSelector<AppState, LanguageState>('language');

export const getLanguageSelector = createSelector(languageStateFeature, (state) => {
  return state;
});
export const getCurrentLanguageSelector = createSelector(languageStateFeature, (state) => {
  return state.current;
});
export const getLanguageListSelector = createSelector(languageStateFeature, (state) => {
  return state.list;
});
