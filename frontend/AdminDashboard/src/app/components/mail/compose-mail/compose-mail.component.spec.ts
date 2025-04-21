import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeMailComponent } from './compose-mail.component';

describe('ComposeMailComponent', () => {
  let component: ComposeMailComponent;
  let fixture: ComponentFixture<ComposeMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComposeMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposeMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
