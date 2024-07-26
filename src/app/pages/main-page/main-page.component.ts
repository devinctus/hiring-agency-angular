import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { ApplicantService } from '../../services/applicant.service';
import { EmployerService } from '../../services/employer.service';
import { VacancyService } from '../../services/vacancy.service';
import { AgreementService } from '../../services/agreement.service';

import { IApplicant } from '../../models/applicant';
import { IEmployer } from '../../models/employer';
import { IVacancy } from '../../models/vacancy';
import { IAgreement } from '../../models/agreement';

@Component({
    standalone: true,
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
    ],
})
export class MainPageComponent implements OnInit {
    recentApplicants: IApplicant[] = [];
    recentEmployers: IEmployer[] = [];
    recentVacancies: IVacancy[] = [];
    recentAgreements: IAgreement[] = [];

    constructor(
        private applicantService: ApplicantService,
        private employerService: EmployerService,
        private vacancyService: VacancyService,
        private agreementService: AgreementService,
    ) {}

    ngOnInit(): void {
        this.loadRecentData();
    }

    loadRecentData(): void {
        this.applicantService.getAll().subscribe((data: IApplicant[]) => {
            this.recentApplicants = data.slice(-5).reverse();
        });

        this.employerService.getAll().subscribe((data: IEmployer[]) => {
            this.recentEmployers = data.slice(-5).reverse();
        });

        this.vacancyService.getAll().subscribe((data: IVacancy[]) => {
            this.recentVacancies = data.slice(-5).reverse();
        });

        this.agreementService.getAll().subscribe((data: IAgreement[]) => {
            this.recentAgreements = data.slice(-5).reverse();
        });
    }
}
