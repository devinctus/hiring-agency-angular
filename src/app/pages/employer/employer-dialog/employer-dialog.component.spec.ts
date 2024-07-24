import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerDialogComponent } from './employer-dialog.component';

describe('EmployerDialogComponent', () => {
  let component: EmployerDialogComponent;
  let fixture: ComponentFixture<EmployerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
