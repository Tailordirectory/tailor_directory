import {createAction, props} from '@ngrx/store';
import {BusinessModel} from '../../models/business.model';

export const showDirectionAddressAction = createAction('[Get Direction Address] - Show direction address', props<{ business: BusinessModel }>());
export const hideDirectionAddressAction = createAction('[Get Direction Address] - Hide direction address', props<{ dType: string, direction: google.maps.LatLng }>());
