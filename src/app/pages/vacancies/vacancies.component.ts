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
import { VacancyService } from '../../services/vacancy.service';
import { IVacancy } from '../../models/vacancy';
import { FilterService } from '../../services/filter.service';
import { VacancyDialogComponent } from '../vacancy/vacancy-dialog/vacancy-dialog.component';
import { MatIcon } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-vacancies',
    templateUrl: './vacancies.component.html',
    styleUrls: ['./vacancies.component.scss'],
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
export class VacanciesComponent implements OnInit, OnDestroy {
    private filterSubscription: Subscription;
    vacancies: IVacancy[] = [];
    totalVacancies: number = 0;
    pageSize = 10;
    pageIndex = 0;
    filteredVacancies: IVacancy[] = [];
    professionalAreaFilter = 'All';

    constructor(
        private vacancyService: VacancyService,
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
        this.getVacancies();
    }

    ngOnDestroy(): void {
        this.filterSubscription.unsubscribe();
    }

    getVacancies(): void {
        this.vacancyService.getAll().subscribe((data: IVacancy[]) => {
            this.vacancies = data;
            this.totalVacancies = data.length;
            this.applyFilter();
        });
    }

    applyFilter(): void {
        this.filteredVacancies = this.vacancies.filter(
            (vacancy) =>
                this.professionalAreaFilter === 'All' ||
                vacancy.professionalArea === this.professionalAreaFilter,
        );
    }

    changePage(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(VacancyDialogComponent, {
            width: '400px',
            data: { mode: 'create' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getVacancies();
            }
        });
    }

    openUpdateDialog(vacancy: IVacancy): void {
        const dialogRef = this.dialog.open(VacancyDialogComponent, {
            width: '400px',
            data: { mode: 'update', vacancy },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getVacancies();
            }
        });
    }

    deleteVacancy(id: string): void {
        if (confirm('Are you sure you want to delete this vacancy?')) {
            this.vacancyService.delete(id).subscribe(() => {
                this.getVacancies();
            });
        }
    }
}
