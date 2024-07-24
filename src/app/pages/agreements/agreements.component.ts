import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Router } from '@angular/router';
import { AgreementService } from '../../services/agreement.service';
import { IAgreement } from '../../models/agreement';
import { FilterService } from '../../services/filter.service';
import { Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-agreements',
    templateUrl: './agreements.component.html',
    styleUrls: ['./agreements.component.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        MatFormFieldModule,
        RouterModule,
        MatIcon,
    ],
})
export class AgreementsComponent implements OnInit, OnDestroy {
    private filterSubscription: Subscription;
    agreements: IAgreement[] = [];
    totalAgreements: number = 0;
    totalEarnings: number = 0;
    pageSize = 10;
    pageIndex = 0;
    filteredAgreements: IAgreement[] = [];
    professionalAreaFilter = 'All';

    constructor(
        private agreementService: AgreementService,
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
        this.getAgreements();
    }

    ngOnDestroy(): void {
        this.filterSubscription.unsubscribe();
    }

    getAgreements(): void {
        this.agreementService.getAll().subscribe((data: IAgreement[]) => {
            this.agreements = data;
            this.totalAgreements = data.length;
            this.totalEarnings = data.reduce(
                (sum, agr) => sum + parseFloat(agr.fees || '0'),
                0,
            );
            this.applyFilter();
        });
    }

    applyFilter(): void {
        this.filteredAgreements = this.agreements.filter(
            (agreement) =>
                this.professionalAreaFilter === 'All' ||
                agreement.professionalArea === this.professionalAreaFilter,
        );
    }

    changePage(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
    }

    deleteAgreement(id: string): void {
        if (confirm('Are you sure you want to delete this agreement?')) {
            console.log(id);
            this.agreementService.delete(id).subscribe(() => {
                this.getAgreements();
            });
        }
    }
}
