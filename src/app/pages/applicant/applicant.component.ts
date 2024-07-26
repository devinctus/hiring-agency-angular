import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApplicantService } from '../../services/applicant.service';
import { VacancyService } from '../../services/vacancy.service';
import { AgreementService } from '../../services/agreement.service';
import { IApplicant } from '../../models/applicant';
import { IVacancy } from '../../models/vacancy';
import { IServerAgreement } from '../../models/agreement';
import { ApplicantDialogComponent } from '../applicant/applicant-dialog/applicant-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
    standalone: true,
    selector: 'app-applicant',
    templateUrl: './applicant.component.html',
    styleUrls: ['./applicant.component.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatDialogModule,
        RouterModule,
        MatGridListModule,
    ],
})
export class ApplicantComponent implements OnInit, OnDestroy {
    applicant!: IApplicant;
    appropriateVacancies: IVacancy[] = [];
    subscriptions: Subscription = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private applicantService: ApplicantService,
        private vacancyService: VacancyService,
        private agreementService: AgreementService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            const applicantId = params['id'];
            this.getApplicant(applicantId);
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getApplicant(id: string): void {
        this.subscriptions.add(
            this.applicantService.getById(id).subscribe({
                next: (applicant) => (this.applicant = applicant),
                error: () =>
                    this.handleErrorResponse(
                        'Error fetching applicant details',
                    ),
            }),
        );
    }

    findVacancies(): void {
        if (!this.applicant.isHired) {
            this.subscriptions.add(
                this.vacancyService.getAll().subscribe({
                    next: (vacancies) => {
                        this.appropriateVacancies = vacancies.filter(
                            (v) =>
                                v.jobPosition ===
                                    this.applicant.qualification &&
                                v.salary > this.applicant.salary &&
                                v.isOpen,
                        );
                        if (this.appropriateVacancies.length === 0) {
                            this.snackBar.open(
                                'No available vacancies for this applicant',
                                'Close',
                                {
                                    duration: 3000,
                                    verticalPosition: 'top',
                                },
                            );
                        }
                    },
                    error: () =>
                        this.handleErrorResponse('Error fetching vacancies'),
                }),
            );
        }
    }

    changeStatus(): void {
        this.applicantService
            .changeStatus(this.applicant._id, !this.applicant.isHired)
            .subscribe({
                next: () => {
                    this.getApplicant(this.applicant._id);
                    console.log('Applicant hired successfully');
                },
                error: () => console.log('Applicant hiring failed'),
            });
    }

    createAgreement(vacancy: IVacancy): void {
        const fees = Math.round(vacancy.salary * 0.1);
        const agreement: IServerAgreement = {
            employerId: vacancy.employer._id,
            applicantId: this.applicant._id,
            jobPosition: vacancy.jobPosition,
            professionalArea: vacancy.professionalArea,
            fees: fees,
        };

        this.subscriptions.add(
            this.agreementService.create(agreement).subscribe({
                next: () => {
                    this.applicantService
                        .changeStatus(this.applicant._id, true)
                        .subscribe({
                            next: () => {
                                console.log('Applicant hired successfully');
                            },
                            error: () => console.log('Applicant hiring failed'),
                        });
                    this.vacancyService
                        .changeStatus(vacancy._id, false)
                        .subscribe({
                            next: () => {
                                console.log('Vacancy closed successfully');
                            },
                            error: () => console.log('Vacancy closing failed'),
                        });
                    this.snackBar.open(
                        'Agreement created successfully',
                        'Close',
                        {
                            duration: 3000,
                            verticalPosition: 'top',
                        },
                    );
                    this.getApplicant(this.applicant._id);
                    this.findVacancies();
                },
                error: () =>
                    this.handleErrorResponse('Error creating agreement'),
            }),
        );
    }

    openEditDialog(): void {
        const dialogRef = this.dialog.open(ApplicantDialogComponent, {
            width: '400px',
            data: { mode: 'update', applicant: this.applicant },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getApplicant(this.applicant._id);
            }
        });
    }

    handleErrorResponse(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
        });
    }
}
