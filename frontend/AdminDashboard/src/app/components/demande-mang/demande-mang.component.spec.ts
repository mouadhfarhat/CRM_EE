import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeMangComponent } from './demande-mang.component';

describe('DemandeMangComponent', () => {
  let component: DemandeMangComponent;
  let fixture: ComponentFixture<DemandeMangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeMangComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
