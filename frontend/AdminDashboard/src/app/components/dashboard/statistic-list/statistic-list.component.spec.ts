import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticListComponent } from './statistic-list.component';

describe('StatisticListComponent', () => {
  let component: StatisticListComponent;
  let fixture: ComponentFixture<StatisticListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
