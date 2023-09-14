import {UserState} from '../reducers/user.reducer';
import {LanguageState} from '../reducers/language.reducer';
import {BusinessTypeSate} from '../reducers/business-type.reducer';
import {GeolocationState} from '../reducers/geolocation.reducer';
import {GetDirectionAddressState} from '../reducers/get-direction-address.reducer';
import {OffersState} from '../reducers/offers.reducer';

export interface AppState {
  user: UserState;
  language: LanguageState;
  businessTypes: BusinessTypeSate;
  geolocation: GeolocationState;
  directionAddress: GetDirectionAddressState;
  offersModal: OffersState;
}
