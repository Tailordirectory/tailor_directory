import {UserState} from "../reducers/user.reducer";
import {LanguageState} from "../reducers/language.reducer";

export interface AppState {
  user: UserState;
  language: LanguageState;
}
