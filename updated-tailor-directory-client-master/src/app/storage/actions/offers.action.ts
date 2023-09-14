import {createAction, props} from '@ngrx/store';
import {AccountRestrictions} from '../../models/business.model';

export const showOffersModal = createAction('[Offers] - Show modal');
export const hideOffersModal = createAction('[Offers] - Hide modal');
export const loadedOffers = createAction('[Offers] - Set Offers', props<{ accounts: { [key: string]: AccountRestrictions } }>());
export const getOffers = createAction('[Offers] - Get Offers');
export const loadOffers = createAction('[Offers] - Load Offers');
export const loadingOffers = createAction('[Offers] - Loading Offers');
