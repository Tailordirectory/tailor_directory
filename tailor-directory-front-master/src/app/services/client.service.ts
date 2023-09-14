import {Injectable} from '@angular/core';
import {ApiRouterService} from './api-router.service';

@Injectable()
export class ClientService {

  constructor(
    private apiService: ApiRouterService
  ) {
  }

  getClientById(id: string) {

  }

  updateClient(id: string) {

  }

}
