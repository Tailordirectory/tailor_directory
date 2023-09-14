import {userActions} from './user.actions';
import {languageActions} from './language.actions';

export const actions = [...userActions, ...languageActions];
