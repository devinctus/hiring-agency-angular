import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVacancy, IServerVacancy } from '../models/vacancy';

@Injectable({
    providedIn: 'root',
})
export class VacancyService {
    private apiUrl = 'http://localhost:5000/api/vacancies'; // Replace with your backend URL

    constructor(private http: HttpClient) {}

    getAll(): Observable<IVacancy[]> {
        return this.http.get<IVacancy[]>(`${this.apiUrl}/all`);
    }

    getById(id: string): Observable<IVacancy> {
        return this.http.get<IVacancy>(`${this.apiUrl}/${id}`);
    }

    create(vacancy: IServerVacancy): Observable<IServerVacancy> {
        return this.http.post<IServerVacancy>(`${this.apiUrl}/create`, vacancy);
    }

    update(id: string, vacancy: IServerVacancy): Observable<IServerVacancy> {
        return this.http.put<IServerVacancy>(
            `${this.apiUrl}/update/${id}`,
            vacancy,
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }

    changeStatus(id: string, isOpen: boolean): Observable<IVacancy> {
        return this.http.put<IVacancy>(`${this.apiUrl}/change-status/${id}`, {
            isOpen,
        });
    }
}
