import {MediaModel} from './business.model';

export interface UploadGalleryResponseModel {
  status: string;
  doc: MediaModel[];
}

export interface UploadLogoResponseModel {
  status: string;
  doc: string;
}
