import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployerService } from '../../services/employer.service';
import { VacancyService } from '../../services/vacancy.service';
import { AgreementService } from '../../services/agreement.service';
import { IEmployer } from '../../models/employer';
import { IVacancy } from '../../models/vacancy';
import { IAgreement } from '../../models/agreement';
import { EmployerDialogComponent } from './employer-dialog/employer-dialog.component';
import { VacancyDialogComponent } from '../vacancy/vacancy-dialog/vacancy-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    standalone: true,
    selector: 'app-employer',
    templateUrl: './employer.component.html',
    styleUrls: ['./employer.component.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatDialogModule,
        RouterModule,
    ],
})
export class EmployerComponent implements OnInit {
    employer!: IEmployer;
    openedVacancies: IVacancy[] = [];
    closedVacancies: IVacancy[] = [];
    agreements: IAgreement[] = [];

    constructor(
        private route: ActivatedRoute,
        private employerService: EmployerService,
        private vacancyService: VacancyService,
        private agreementService: AgreementService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            const employerId = params['id'];
            this.getEmployer(employerId);
            this.getVacancies(employerId);
            this.getAgreements(employerId);
        });
    }

    getEmployer(id: string): void {
        this.employerService.getById(id).subscribe({
            next: (employer) => (this.employer = employer),
            error: () =>
                this.handleErrorResponse('Error fetching employer details'),
            complete: () => console.log('Completed fetching employer'),
        });
    }

    getVacancies(employerId: string): void {
        this.vacancyService.getAll().subscribe({
            next: (vacancies) => {
                this.openedVacancies = vacancies.filter(
                    (v) => v.employer === employerId && v.isOpen,
                );
                this.closedVacancies = vacancies.filter(
                    (v) => v.employer === employerId && !v.isOpen,
                );
            },
            error: () => this.handleErrorResponse('Error fetching vacancies'),
        });
    }

    getAgreements(employerId: string): void {
        this.agreementService.getAll().subscribe({
            next: (agreements) => {
                this.agreements = agreements.filter(
                    (a) => a.employer._id === employerId,
                );
            },
            error: () => this.handleErrorResponse('Error fetching agreements'),
        });
    }

    openEditDialog(): void {
        const dialogRef = this.dialog.open(EmployerDialogComponent, {
            width: '400px',
            data: { mode: 'update', employer: this.employer },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getEmployer(this.employer._id);
            }
        });
    }

    openCreateVacancyDialog(): void {
        const dialogRef = this.dialog.open(VacancyDialogComponent, {
            width: '400px',
            data: {
                mode: 'create',
                vacancy: {
                    employer: this.employer,
                    professionalArea: this.employer.professionalArea,
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getVacancies(this.employer._id);
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
