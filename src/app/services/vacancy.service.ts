import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVacancy } from '../models/vacancy';

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

    create(vacancy: IVacancy): Observable<IVacancy> {
        return this.http.post<IVacancy>(`${this.apiUrl}/create`, vacancy);
    }

    update(id: string, vacancy: IVacancy): Observable<IVacancy> {
        return this.http.put<IVacancy>(`${this.apiUrl}/update/${id}`, vacancy);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }

    close(id: string): Observable<IVacancy> {
        return this.http.put<IVacancy>(`${this.apiUrl}/close/${id}`, {});
    }
}
