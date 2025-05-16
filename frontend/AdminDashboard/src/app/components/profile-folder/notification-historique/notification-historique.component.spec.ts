import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationHistoriqueComponent } from './notification-historique.component';

describe('NotificationHistoriqueComponent', () => {
  let component: NotificationHistoriqueComponent;
  let fixture: ComponentFixture<NotificationHistoriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationHistoriqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
