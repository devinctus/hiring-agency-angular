import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FilterService } from './services/filter.service';
import { filter } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        RouterModule,
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatButtonToggleModule,
    ],
})
export class AppComponent implements OnInit {
    showFilters: boolean = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private filterService: FilterService,
    ) {}

    ngOnInit() {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.checkRoute(this.router.url);
            });

        this.checkRoute(this.router.url);
    }

    private checkRoute(url: string) {
        const expectedRoutes = [
            '/applicants',
            '/employers',
            '/agreements',
            '/vacancies',
        ];

        if (!this.isLoggedIn() && url !== '/login' && url !== '/registration') {
            this.router.navigate(['/login']);
        } else {
            this.showFilters =
                expectedRoutes.some((route) => url.startsWith(route)) &&
                url.split('/').length < 3;
        }
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    onProfessionalAreaChange(area: string): void {
        this.filterService.changeProfessionalArea(area);
    }
}
