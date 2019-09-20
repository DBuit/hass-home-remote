import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindsTileComponent } from './blinds-tile.component';

describe('BlindsTileComponent', () => {
  let component: BlindsTileComponent;
  let fixture: ComponentFixture<BlindsTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlindsTileComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindsTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
