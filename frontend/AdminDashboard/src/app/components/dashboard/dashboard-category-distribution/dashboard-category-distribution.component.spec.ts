import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCategoryDistributionComponent } from './dashboard-category-distribution.component';

describe('DashboardCategoryDistributionComponent', () => {
  let component: DashboardCategoryDistributionComponent;
  let fixture: ComponentFixture<DashboardCategoryDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCategoryDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCategoryDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
