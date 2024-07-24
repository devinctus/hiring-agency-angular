import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantDialogComponent } from './applicant-dialog.component';

describe('ApplicantDialogComponent', () => {
  let component: ApplicantDialogComponent;
  let fixture: ComponentFixture<ApplicantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
