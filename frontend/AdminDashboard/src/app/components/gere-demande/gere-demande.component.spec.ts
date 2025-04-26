import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GereDemandeComponent } from './gere-demande.component';

describe('GereDemandeComponent', () => {
  let component: GereDemandeComponent;
  let fixture: ComponentFixture<GereDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GereDemandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GereDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
