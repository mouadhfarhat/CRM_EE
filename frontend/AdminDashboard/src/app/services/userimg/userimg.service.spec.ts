import { TestBed } from '@angular/core/testing';

import { UserimgService } from './userimg.service';

describe('UserimgService', () => {
  let service: UserimgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserimgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
