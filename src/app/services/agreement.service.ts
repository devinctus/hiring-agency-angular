import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAgreement } from '../models/agreement';

@Injectable({
    providedIn: 'root',
})
export class AgreementService {
    private apiUrl = 'http://localhost:5000/api/agreements'; // Replace with your backend URL

    constructor(private http: HttpClient) {}

    getAll(): Observable<IAgreement[]> {
        return this.http.get<IAgreement[]>(`${this.apiUrl}/all`);
    }

    getById(id: string): Observable<IAgreement> {
        return this.http.get<IAgreement>(`${this.apiUrl}/${id}`);
    }

    create(agreement: IAgreement): Observable<IAgreement> {
        return this.http.post<IAgreement>(`${this.apiUrl}/create`, agreement);
    }

    update(id: string, agreement: IAgreement): Observable<IAgreement> {
        return this.http.put<IAgreement>(
            `${this.apiUrl}/update/${id}`,
            agreement,
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }
}
