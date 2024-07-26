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
import { EmployerService } from '../../services/employer.service';
import { IEmployer } from '../../models/employer';
import { FilterService } from '../../services/filter.service';
import { EmployerDialogComponent } from '../employer/employer-dialog/employer-dialog.component';
import { MatIcon } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-employers',
    templateUrl: './employers.component.html',
    styleUrls: ['./employers.component.scss'],
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
export class EmployersComponent implements OnInit, OnDestroy {
    private filterSubscription: Subscription;
    employers: IEmployer[] = [];
    totalEmployers: number = 0;
    pageSize = 10;
    pageIndex = 0;
    filteredEmployers: IEmployer[] = [];
    professionalAreaFilter = 'All';

    constructor(
        private employerService: EmployerService,
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
        this.getEmployers();
    }

    ngOnDestroy(): void {
        this.filterSubscription.unsubscribe();
    }

    getEmployers(): void {
        this.employerService.getAll().subscribe((data: IEmployer[]) => {
            this.employers = data;
            this.totalEmployers = data.length;
            this.applyFilter();
        });
    }

    applyFilter(): void {
        this.filteredEmployers = this.employers.filter(
            (employer) =>
                this.professionalAreaFilter === 'All' ||
                employer.professionalArea === this.professionalAreaFilter,
        );
    }

    changePage(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(EmployerDialogComponent, {
            width: '400px',
            data: { mode: 'create' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getEmployers();
            }
        });
    }

    openUpdateDialog(employer: IEmployer): void {
        const dialogRef = this.dialog.open(EmployerDialogComponent, {
            width: '400px',
            data: { mode: 'update', employer },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getEmployers();
            }
        });
    }

    deleteEmployer(id: string): void {
        if (confirm('Are you sure you want to delete this employer?')) {
            this.employerService.delete(id).subscribe(() => {
                this.getEmployers();
            });
        }
    }
}
