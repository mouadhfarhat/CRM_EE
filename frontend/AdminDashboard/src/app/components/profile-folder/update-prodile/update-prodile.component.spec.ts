import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProdileComponent } from './update-prodile.component';

describe('UpdateProdileComponent', () => {
  let component: UpdateProdileComponent;
  let fixture: ComponentFixture<UpdateProdileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProdileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProdileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
