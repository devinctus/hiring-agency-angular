import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApplicant } from '../models/applicant';

@Injectable({
    providedIn: 'root',
})
export class ApplicantService {
    private apiUrl = 'http://localhost:5000/api/applicants'; // Replace with your backend URL

    constructor(private http: HttpClient) {}

    getAll(): Observable<IApplicant[]> {
        return this.http.get<IApplicant[]>(`${this.apiUrl}/all`);
    }

    getById(id: string): Observable<IApplicant> {
        return this.http.get<IApplicant>(`${this.apiUrl}/${id}`);
    }

    create(applicant: IApplicant): Observable<IApplicant> {
        return this.http.post<IApplicant>(`${this.apiUrl}/create`, applicant);
    }

    update(id: string, applicant: IApplicant): Observable<IApplicant> {
        return this.http.put<IApplicant>(
            `${this.apiUrl}/update/${id}`,
            applicant,
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }

    changeStatus(id: string, isHired: boolean): Observable<IApplicant> {
        return this.http.put<IApplicant>(`${this.apiUrl}/change-status/${id}`, {
            isHired,
        });
    }
}
