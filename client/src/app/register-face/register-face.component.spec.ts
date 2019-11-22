import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFaceComponent } from './register-face.component';

describe('RegisterFaceComponent', () => {
  let component: RegisterFaceComponent;
  let fixture: ComponentFixture<RegisterFaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterFaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
