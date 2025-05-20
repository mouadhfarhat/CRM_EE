import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGestionnaireCountComponent } from './dashboard-gestionnaire-count.component';

describe('DashboardGestionnaireCountComponent', () => {
  let component: DashboardGestionnaireCountComponent;
  let fixture: ComponentFixture<DashboardGestionnaireCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGestionnaireCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardGestionnaireCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
