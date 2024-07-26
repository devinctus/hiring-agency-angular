import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogModule,
} from '@angular/material/dialog';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { VacancyService } from '../../../services/vacancy.service';
import { EmployerService } from '../../../services/employer.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { PROFESSIONAL_AREAS, emptyVacancy } from '../../../constants';
import { IVacancy, IServerVacancy } from '../../../models/vacancy';

interface VacancyDialogData {
    mode: 'create' | 'update';
    vacancy?: IVacancy;
    isEmployerPage?: boolean;
}

interface IErrorMessage {
    employer?: string;
    jobPosition?: string;
    salary?: string;
    professionalArea?: string;
}

@Component({
    standalone: true,
    selector: 'app-vacancy-dialog',
    templateUrl: './vacancy-dialog.component.html',
    styleUrls: ['./vacancy-dialog.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatIcon,
        MatSelectModule,
        MatOptionModule,
    ],
})
export class VacancyDialogComponent implements OnInit {
    form!: FormGroup;
    mode: 'create' | 'update';
    vacancy: IVacancy;
    isEmployerPage?: boolean;
    jobPositions: string[] = [];
    errorMessage: IErrorMessage = {
        employer: '',
        jobPosition: '',
        salary: '',
        professionalArea: '',
    };

    constructor(
        private fb: FormBuilder,
        private vacancyService: VacancyService,
        private employerService: EmployerService,
        public dialogRef: MatDialogRef<VacancyDialogComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: VacancyDialogData,
    ) {
        this.mode = data.mode;
        this.vacancy = data.vacancy || emptyVacancy;
        this.isEmployerPage = data.isEmployerPage;
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            employer: [
                {
                    value:
                        this.mode === 'create'
                            ? this.isEmployerPage
                                ? this.vacancy.employer.companyName
                                : ''
                            : this.vacancy.employer.companyName,
                    disabled: this.mode !== 'create',
                },
                [Validators.required, Validators.minLength(2)],
            ],
            jobPosition: [this.vacancy.jobPosition, [Validators.required]],
            professionalArea: [
                { value: this.vacancy.professionalArea, disabled: true },
                Validators.required,
            ],
            salary: [this.vacancy.salary, [Validators.required]],
        });

        if (this.mode === 'update') {
            this.jobPositions =
                PROFESSIONAL_AREAS[this.vacancy.professionalArea] || [];
        }

        this.form.get('employer')?.valueChanges.subscribe((value) => {
            if (value && this.mode === 'create') {
                this.checkEmployerAndSetProfessionalArea(value);
            }
        });

        this.form.get('professionalArea')?.valueChanges.subscribe((value) => {
            this.jobPositions = PROFESSIONAL_AREAS[value] || [];
            this.form.get('jobPosition')?.setValue('');
        });

        this.form.valueChanges.subscribe(() => this.updateErrorMessage());
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.snackBar.open('Please fill out the form correctly.', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
            });
            return;
        }

        const formData = this.form.getRawValue();

        this.employerService.getAll().subscribe({
            next: (employers) => {
                const employer = employers.find(
                    (emp) => emp.companyName === formData.employer,
                );
                if (employer) {
                    const vacancyData = {
                        employerId: employer._id,
                        jobPosition: formData.jobPosition as string,
                        professionalArea: formData.professionalArea as string,
                        salary: formData.salary as number,
                    };

                    if (this.mode === 'create' || this.isEmployerPage) {
                        this.createVacancy(vacancyData);
                    } else if (this.mode === 'update') {
                        this.updateVacancy(this.vacancy._id, vacancyData);
                    }
                } else {
                    this.snackBar.open(
                        'Employer not found. Please enter a valid company name.',
                        'Close',
                        {
                            duration: 3000,
                            verticalPosition: 'top',
                        },
                    );
                }
            },
            error: () => {
                this.snackBar.open(
                    'Failed to fetch employers. Please try again.',
                    'Close',
                    {
                        duration: 3000,
                        verticalPosition: 'top',
                    },
                );
            },
        });
    }

    createVacancy(vacancyData: IServerVacancy): void {
        this.vacancyService.create(vacancyData).subscribe({
            next: () => {
                this.dialogRef.close(true);
            },
            error: () => {
                this.snackBar.open(
                    'Failed to create vacancy. Please try again.',
                    'Close',
                    {
                        duration: 3000,
                        verticalPosition: 'top',
                    },
                );
            },
        });
    }

    updateVacancy(vacancyId: string, vacancyData: IServerVacancy): void {
        this.vacancyService.update(vacancyId, vacancyData).subscribe({
            next: () => {
                this.dialogRef.close(true);
            },
            error: () => {
                this.snackBar.open(
                    'Failed to update vacancy. Please try again.',
                    'Close',
                    {
                        duration: 3000,
                        verticalPosition: 'top',
                    },
                );
            },
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    checkEmployerAndSetProfessionalArea(employerName: string): void {
        this.employerService.getAll().subscribe((employers) => {
            const employer = employers.find(
                (emp) => emp.companyName === employerName,
            );
            if (employer) {
                this.vacancy.professionalArea = employer.professionalArea;
                this.form
                    .get('professionalArea')
                    ?.setValue(employer.professionalArea);
                this.jobPositions =
                    PROFESSIONAL_AREAS[employer.professionalArea] || [];
            } else {
                this.snackBar.open(
                    'Employer not found. Please enter a valid company name.',
                    'Close',
                    {
                        duration: 3000,
                        verticalPosition: 'top',
                    },
                );
                this.vacancy.professionalArea = '';
                this.jobPositions = [];
                this.form.get('professionalArea')?.reset();
                this.form.get('jobPosition')?.setValue('');
            }
        });
    }

    updateErrorMessage() {
        const controls = this.form.controls;

        if (controls['employer'].hasError('required')) {
            this.errorMessage.employer = 'You must enter a value';
        } else if (controls['employer'].hasError('minlength')) {
            this.errorMessage.employer = 'Employer must be at least 2 symbols';
        } else {
            this.errorMessage.employer = '';
        }

        if (controls['jobPosition'].hasError('required')) {
            this.errorMessage.jobPosition = 'You must select a job position';
        } else {
            this.errorMessage.jobPosition = '';
        }

        if (controls['salary'].hasError('required')) {
            this.errorMessage.salary = 'You must enter a value';
        } else {
            this.errorMessage.salary = '';
        }

        if (controls['professionalArea'].hasError('required')) {
            this.errorMessage.professionalArea =
                'Professional area is required, ensure a valid employer is selected';
        } else {
            this.errorMessage.professionalArea = '';
        }
    }
}
