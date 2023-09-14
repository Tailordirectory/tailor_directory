import {createAction, props} from '@ngrx/store';

export const setLanguage = createAction('[Language] - Set Language', props<{ name: string, lang: string }>());
export const getLanguage = createAction('[Language] - Get Language');
export const getLanguageList = createAction('[Language] - Get Language List');

export const languageActions = [setLanguage, getLanguage, getLanguageList];
