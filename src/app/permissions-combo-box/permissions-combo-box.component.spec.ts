import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsComboBoxComponent } from './permissions-combo-box.component';

describe('PermissionsComboBoxComponent', () => {
  let component: PermissionsComboBoxComponent;
  let fixture: ComponentFixture<PermissionsComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionsComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
