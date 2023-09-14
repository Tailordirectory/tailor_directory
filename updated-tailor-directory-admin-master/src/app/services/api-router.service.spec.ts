import { TestBed } from '@angular/core/testing';

import { ApiRouterService } from './api-router.service';

describe('ApiRouterService', () => {
  let service: ApiRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
