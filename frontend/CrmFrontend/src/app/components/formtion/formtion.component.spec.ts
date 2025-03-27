import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormtionComponent } from './formtion.component';

describe('FormtionComponent', () => {
  let component: FormtionComponent;
  let fixture: ComponentFixture<FormtionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormtionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormtionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
