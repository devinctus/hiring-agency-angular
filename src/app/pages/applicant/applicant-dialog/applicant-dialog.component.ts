import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { IApplicant } from '../../../models/applicant';
import { ApplicantService } from '../../../services/applicant.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PROFESSIONAL_AREAS } from '../../../constants';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

interface ApplicantDialogData {
    mode: 'create' | 'update';
    applicant?: IApplicant;
}

interface IErrorMessage {
    name?: string;
    surname?: string;
    patronymic?: string;
    professionalArea?: string;
    qualification?: string;
    salary?: string;
}

const emptyApplicant: IApplicant = {
    _id: '',
    name: '',
    surname: '',
    patronymic: '',
    professionalArea: '',
    qualification: '',
    salary: '',
    isHired: false,
};

@Component({
    standalone: true,
    selector: 'app-applicant-dialog',
    templateUrl: './applicant-dialog.component.html',
    styleUrls: ['./applicant-dialog.component.scss'],
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
export class ApplicantDialogComponent implements OnInit {
    form!: FormGroup;
    mode: 'create' | 'update';
    applicant: IApplicant;
    professionalAreas = Object.keys(PROFESSIONAL_AREAS);
    qualifications: string[] = [];
    errorMessage: IErrorMessage = {
        name: '',
        surname: '',
        patronymic: '',
        professionalArea: '',
        qualification: '',
        salary: '',
    };

    constructor(
        private fb: FormBuilder,
        private applicantService: ApplicantService,
        public dialogRef: MatDialogRef<ApplicantDialogComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: ApplicantDialogData,
    ) {
        this.mode = data.mode;
        this.applicant = data.applicant || emptyApplicant;
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [
                this.applicant.name,
                [Validators.required, Validators.minLength(2)],
            ],
            surname: [
                this.applicant.surname,
                [Validators.required, Validators.minLength(2)],
            ],
            patronymic: [
                this.applicant.patronymic,
                [Validators.required, Validators.minLength(2)],
            ],
            professionalArea: [
                this.applicant.professionalArea,
                Validators.required,
            ],
            qualification: [
                {
                    value: this.applicant.qualification,
                    disabled: !this.applicant.professionalArea,
                },
                Validators.required,
            ],
            salary: [
                this.applicant.salary,
                [Validators.required, Validators.minLength(2)],
            ],
        });

        this.form.get('professionalArea')?.valueChanges.subscribe((value) => {
            if (value) {
                this.qualifications = PROFESSIONAL_AREAS[value] || [];
                this.form.get('qualification')?.enable();
            } else {
                this.qualifications = [];
                this.form.get('qualification')?.disable();
            }
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

        const applicantData: IApplicant = this.form.value;

        //     if (this.mode === 'create') {
        //         this.applicantService.create(applicantData).subscribe(() => {
        //             this.dialogRef.close(true);
        //         });
        //     } else if (this.mode === 'update') {
        //         this.applicantService
        //             .update(this.applicant._id, applicantData)
        //             .subscribe(() => {
        //                 this.dialogRef.close(true);
        //             });
        //     }
        if (this.mode === 'create') {
            this.applicantService.create(applicantData).subscribe({
                next: () => {
                    this.dialogRef.close(true);
                },
                error: () => {
                    this.snackBar.open(
                        'Failed to create applicant. Please try again.',
                        'Close',
                        {
                            duration: 3000,
                            verticalPosition: 'top',
                        },
                    );
                },
            });
        } else if (this.mode === 'update') {
            this.applicantService
                .update(this.applicant._id, applicantData)
                .subscribe({
                    next: () => {
                        this.dialogRef.close(true);
                    },
                    error: () => {
                        this.snackBar.open(
                            'Failed to update applicant. Please try again.',
                            'Close',
                            {
                                duration: 3000,
                                verticalPosition: 'top',
                            },
                        );
                    },
                });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    updateErrorMessage() {
        const controls = this.form.controls;

        if (controls['name'].hasError('required')) {
            this.errorMessage.name = 'You must enter a value';
        } else if (controls['name'].hasError('minlength')) {
            this.errorMessage.name = 'Name must be at least 2 symbols';
        } else {
            this.errorMessage.name = '';
        }

        if (controls['surname'].hasError('required')) {
            this.errorMessage.surname = 'You must enter a value';
        } else if (controls['surname'].hasError('minlength')) {
            this.errorMessage.surname = 'Surname must be at least 2 symbols';
        } else {
            this.errorMessage.surname = '';
        }

        if (controls['patronymic'].hasError('required')) {
            this.errorMessage.patronymic = 'You must enter a value';
        } else if (controls['patronymic'].hasError('minlength')) {
            this.errorMessage.patronymic =
                'Patronymic must be at least 2 symbols';
        } else {
            this.errorMessage.patronymic = '';
        }

        if (controls['professionalArea'].hasError('required')) {
            this.errorMessage.professionalArea = 'You must select a value';
        } else {
            this.errorMessage.professionalArea = '';
        }

        if (controls['qualification'].hasError('required')) {
            this.errorMessage.qualification = 'You must select a value';
        } else {
            this.errorMessage.qualification = '';
        }

        if (controls['salary'].hasError('required')) {
            this.errorMessage.salary = 'You must enter a value';
        } else if (controls['salary'].hasError('minlength')) {
            this.errorMessage.salary = 'Salary must be greater than 0';
        } else {
            this.errorMessage.salary = '';
        }
    }
}
