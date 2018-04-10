import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggerComponent } from './dragger.component';

describe('DraggerComponent', () => {
  let component: DraggerComponent;
  let fixture: ComponentFixture<DraggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
