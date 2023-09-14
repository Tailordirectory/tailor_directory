import {userReducer} from './user.reducer';
import {languageReducer} from '../reducers/language.reducer';
import {businessTypesReducer} from '../reducers/business-type.reducer';
import {geolocationReducer} from './geolocation.reducer';
import {getDirectionAddressReducer} from './get-direction-address.reducer';
import {offersReducer} from './offers.reducer';

export const appReducers = {
  user: userReducer,
  language: languageReducer,
  businessTypes: businessTypesReducer,
  geolocation: geolocationReducer,
  directionAddress: getDirectionAddressReducer,
  offersModal: offersReducer
};
