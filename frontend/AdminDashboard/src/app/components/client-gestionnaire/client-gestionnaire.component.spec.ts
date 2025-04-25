import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientGestionnaireComponent } from './client-gestionnaire.component';

describe('ClientGestionnaireComponent', () => {
  let component: ClientGestionnaireComponent;
  let fixture: ComponentFixture<ClientGestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientGestionnaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientGestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
