import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApplicantService } from '../../services/applicant.service';
import { IApplicant } from '../../models/applicant';
import { FilterService } from '../../services/filter.service';
import { ApplicantDialogComponent } from '../applicant/applicant-dialog/applicant-dialog.component';
import { MatIcon } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-applicants',
    templateUrl: './applicants.component.html',
    styleUrls: ['./applicants.component.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        RouterModule,
        MatIcon,
    ],
})
export class ApplicantsComponent implements OnInit, OnDestroy {
    private filterSubscription: Subscription;
    applicants: IApplicant[] = [];
    totalApplicants: number = 0;
    pageSize = 10;
    pageIndex = 0;
    filteredApplicants: IApplicant[] = [];
    professionalAreaFilter = 'All';

    constructor(
        private applicantService: ApplicantService,
        private dialog: MatDialog,
        private router: Router,
        private filterService: FilterService,
    ) {
        this.filterSubscription =
            this.filterService.currentProfessionalArea.subscribe((area) => {
                this.professionalAreaFilter = area;
                this.applyFilter();
            });
    }

    ngOnInit(): void {
        this.getApplicants();
    }

    ngOnDestroy(): void {
        this.filterSubscription.unsubscribe();
    }

    getApplicants(): void {
        this.applicantService.getAll().subscribe((data: IApplicant[]) => {
            this.applicants = data;
            this.totalApplicants = data.length;
            this.applyFilter();
        });
    }

    applyFilter(): void {
        this.filteredApplicants = this.applicants.filter(
            (applicant) =>
                this.professionalAreaFilter === 'All' ||
                applicant.professionalArea === this.professionalAreaFilter,
        );
    }

    changePage(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(ApplicantDialogComponent, {
            width: '400px',
            data: { mode: 'create' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getApplicants();
            }
        });
    }

    openUpdateDialog(applicant: IApplicant): void {
        const dialogRef = this.dialog.open(ApplicantDialogComponent, {
            width: '400px',
            data: { mode: 'update', applicant },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getApplicants();
            }
        });
    }

    deleteApplicant(id: string): void {
        if (confirm('Are you sure you want to delete this applicant?')) {
            this.applicantService.delete(id).subscribe(() => {
                this.getApplicants();
            });
        }
    }
}
