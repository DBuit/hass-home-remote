import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EntityTabPage } from './entityTab.page';

describe('EntityTabPage', () => {
  let component: EntityTabPage;
  let fixture: ComponentFixture<EntityTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntityTabPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EntityTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
