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
import { VacancyDialogComponent } from '../vacancy/vacancy-dialog/vacancy-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
    standalone: true,
    selector: 'app-vacancy',
    templateUrl: './vacancy.component.html',
    styleUrls: ['./vacancy.component.scss'],
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
export class VacancyComponent implements OnInit, OnDestroy {
    vacancy!: IVacancy;
    appropriateApplicants: IApplicant[] = [];
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
            const vacancytId = params['id'];
            this.getVacancy(vacancytId);
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getVacancy(id: string): void {
        this.subscriptions.add(
            this.vacancyService.getById(id).subscribe({
                next: (vacancy) => (this.vacancy = vacancy),
                error: () =>
                    this.handleErrorResponse('Error fetching vacancy details'),
            }),
        );
    }

    findApplicants(): void {
        if (this.vacancy.isOpen) {
            this.subscriptions.add(
                this.applicantService.getAll().subscribe({
                    next: (applicants) => {
                        this.appropriateApplicants = applicants.filter(
                            (a) =>
                                a.qualification === this.vacancy.jobPosition &&
                                a.salary < this.vacancy.salary &&
                                !a.isHired,
                        );
                    },
                    error: () =>
                        this.handleErrorResponse('Error fetching applicants'),
                }),
            );
        }
    }

    changeStatus(): void {
        this.vacancyService
            .changeStatus(this.vacancy._id, !this.vacancy.isOpen)
            .subscribe({
                next: () => {
                    this.getVacancy(this.vacancy._id);
                    console.log('Vacancy status changed successfully');
                },
                error: () => console.log('Vacancy status changing failed'),
            });
    }

    createAgreement(applicant: IApplicant): void {
        const fees = Math.round(this.vacancy.salary * 0.1);
        console.log(this.vacancy, applicant._id);
        const agreement: IServerAgreement = {
            employerId: this.vacancy.employer.toString(),
            applicantId: applicant._id,
            jobPosition: this.vacancy.jobPosition,
            professionalArea: this.vacancy.professionalArea,
            fees: fees,
        };

        this.subscriptions.add(
            this.agreementService.create(agreement).subscribe({
                next: () => {
                    this.applicantService
                        .changeStatus(applicant._id, true)
                        .subscribe({
                            next: () => {
                                console.log('Applicant hired successfully');
                            },
                            error: () => console.log('Applicant hiring failed'),
                        });
                    this.vacancyService
                        .changeStatus(this.vacancy._id, false)
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
                    this.getVacancy(this.vacancy._id);
                    this.findApplicants();
                },
                error: () =>
                    this.handleErrorResponse('Error creating agreement'),
            }),
        );
    }

    openEditDialog(): void {
        const dialogRef = this.dialog.open(VacancyDialogComponent, {
            width: '400px',
            data: { mode: 'update', vacancy: this.vacancy },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getVacancy(this.vacancy._id);
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
