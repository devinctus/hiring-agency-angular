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
import { IEmployer } from '../../../models/employer';
import { EmployerService } from '../../../services/employer.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PROFESSIONAL_AREAS } from '../../../constants';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

interface EmployerDialogData {
    mode: 'create' | 'update';
    employer?: IEmployer;
}

interface IErrorMessage {
    companyName?: string;
    professionalArea?: string;
    address?: string;
    phone?: string;
}

const emptyEmployer: IEmployer = {
    _id: '',
    companyName: '',
    professionalArea: '',
    address: '',
    phone: '',
};

@Component({
    standalone: true,
    selector: 'app-employer-dialog',
    templateUrl: './employer-dialog.component.html',
    styleUrls: ['./employer-dialog.component.scss'],
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
export class EmployerDialogComponent implements OnInit {
    form!: FormGroup;
    mode: 'create' | 'update';
    employer: IEmployer;
    professionalAreas = Object.keys(PROFESSIONAL_AREAS);
    errorMessage: IErrorMessage = {
        companyName: '',
        professionalArea: '',
        address: '',
        phone: '',
    };

    constructor(
        private fb: FormBuilder,
        private employerService: EmployerService,
        public dialogRef: MatDialogRef<EmployerDialogComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: EmployerDialogData,
    ) {
        this.mode = data.mode;
        this.employer = data.employer || emptyEmployer;
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            companyName: [
                this.employer.companyName,
                [Validators.required, Validators.minLength(2)],
            ],
            professionalArea: [
                this.employer.professionalArea,
                Validators.required,
            ],
            address: [
                this.employer.address,
                [Validators.required, Validators.minLength(5)],
            ],
            phone: [
                this.employer.phone,
                [
                    Validators.required,
                    Validators.pattern(/^\(\d{3}\)\d{3}-\d{4}$/),
                ],
            ],
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

        const employerData: IEmployer = this.form.value;

        if (this.mode === 'create') {
            this.employerService.create(employerData).subscribe({
                next: () => {
                    this.dialogRef.close(true);
                },
                error: () => {
                    this.snackBar.open(
                        'Failed to create employer. Please try again.',
                        'Close',
                        {
                            duration: 3000,
                            verticalPosition: 'top',
                        },
                    );
                },
            });
        } else if (this.mode === 'update') {
            this.employerService
                .update(this.employer._id, employerData)
                .subscribe({
                    next: () => {
                        this.dialogRef.close(true);
                    },
                    error: () => {
                        this.snackBar.open(
                            'Failed to update employer. Please try again.',
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

        if (controls['companyName'].hasError('required')) {
            this.errorMessage.companyName = 'You must enter a value';
        } else if (controls['companyName'].hasError('minlength')) {
            this.errorMessage.companyName =
                'Company Name must be at least 2 symbols';
        } else {
            this.errorMessage.companyName = '';
        }

        if (controls['professionalArea'].hasError('required')) {
            this.errorMessage.professionalArea = 'You must select a value';
        } else {
            this.errorMessage.professionalArea = '';
        }

        if (controls['address'].hasError('required')) {
            this.errorMessage.address = 'You must enter a value';
        } else if (controls['address'].hasError('minlength')) {
            this.errorMessage.address = 'Address must be at least 5 symbols';
        } else {
            this.errorMessage.address = '';
        }

        if (controls['phone'].hasError('required')) {
            this.errorMessage.phone = 'You must enter a value';
        } else if (controls['phone'].hasError('pattern')) {
            this.errorMessage.phone =
                'Please fill a valid phone number mask (xxx)xxx-xxxx';
        } else {
            this.errorMessage.phone = '';
        }
    }
}
