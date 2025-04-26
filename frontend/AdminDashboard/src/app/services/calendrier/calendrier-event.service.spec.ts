import { TestBed } from '@angular/core/testing';

import { CalendrierEventService } from './calendrier-event.service';

describe('CalendrierEventService', () => {
  let service: CalendrierEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendrierEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
