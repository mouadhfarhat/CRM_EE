import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationMangComponent } from './formation-mang.component';

describe('FormationMangComponent', () => {
  let component: FormationMangComponent;
  let fixture: ComponentFixture<FormationMangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationMangComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
