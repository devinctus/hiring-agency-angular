import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyDialogComponent } from './vacancy-dialog.component';

describe('VacancyDialogComponent', () => {
  let component: VacancyDialogComponent;
  let fixture: ComponentFixture<VacancyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacancyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
