import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnaireMangComponent } from './gestionnaire-mang.component';

describe('GestionnaireMangComponent', () => {
  let component: GestionnaireMangComponent;
  let fixture: ComponentFixture<GestionnaireMangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionnaireMangComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionnaireMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
