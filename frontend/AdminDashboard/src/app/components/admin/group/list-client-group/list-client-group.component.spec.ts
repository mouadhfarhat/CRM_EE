import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientGroupComponent } from './list-client-group.component';

describe('ListClientGroupComponent', () => {
  let component: ListClientGroupComponent;
  let fixture: ComponentFixture<ListClientGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClientGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListClientGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
