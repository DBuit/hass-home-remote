import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingsTabPage } from './settingsTab.page';

describe('SettingsTabPage', () => {
  let component: SettingsTabPage;
  let fixture: ComponentFixture<SettingsTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsTabPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
