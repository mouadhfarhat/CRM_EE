import { TestBed } from '@angular/core/testing';

import { FoodCompanyService } from './food-company.service';

describe('FoodCompanyService', () => {
  let service: FoodCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
