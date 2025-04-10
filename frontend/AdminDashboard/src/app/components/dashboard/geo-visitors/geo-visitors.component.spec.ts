import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoVisitorsComponent } from './geo-visitors.component';

describe('GeoVisitorsComponent', () => {
  let component: GeoVisitorsComponent;
  let fixture: ComponentFixture<GeoVisitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoVisitorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeoVisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
