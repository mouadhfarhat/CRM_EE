import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMangComponent } from './client-mang.component';

describe('ClientMangComponent', () => {
  let component: ClientMangComponent;
  let fixture: ComponentFixture<ClientMangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientMangComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
