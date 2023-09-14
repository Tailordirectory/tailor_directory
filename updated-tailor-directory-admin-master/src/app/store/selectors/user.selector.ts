import {AppState} from "./index";
import {createSelector} from "@ngrx/store";

export const userStateFeature = (state: AppState) => state.user;

export const getUserStateSelector = createSelector(userStateFeature, (state) => state);
