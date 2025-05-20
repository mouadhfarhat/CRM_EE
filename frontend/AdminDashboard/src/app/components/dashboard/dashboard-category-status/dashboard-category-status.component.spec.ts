import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCategoryStatusComponent } from './dashboard-category-status.component';

describe('DashboardCategoryStatusComponent', () => {
  let component: DashboardCategoryStatusComponent;
  let fixture: ComponentFixture<DashboardCategoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCategoryStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCategoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
