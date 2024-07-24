import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { EmployersComponent } from './pages/employers/employers.component';
import { EmployerComponent } from './pages/employer/employer.component';
import { ApplicantsComponent } from './pages/applicants/applicants.component';
import { ApplicantComponent } from './pages/applicant/applicant.component';
import { VacanciesComponent } from './pages/vacancies/vacancies.component';
import { VacancyComponent } from './pages/vacancy/vacancy.component';
import { AgreementsComponent } from './pages/agreements/agreements.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: '', component: MainPageComponent },
    { path: 'employers', component: EmployersComponent },
    { path: 'employers/:id', component: EmployerComponent },
    { path: 'applicants', component: ApplicantsComponent },
    { path: 'applicants/:id', component: ApplicantComponent },
    { path: 'vacancies', component: VacanciesComponent },
    { path: 'vacancies/:id', component: VacancyComponent },
    { path: 'agreements', component: AgreementsComponent },
];
