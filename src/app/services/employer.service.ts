import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEmployer } from '../models/employer';

@Injectable({
    providedIn: 'root',
})
export class EmployerService {
    private apiUrl = 'http://localhost:5000/api/employers'; // Replace with your backend URL

    constructor(private http: HttpClient) {}

    getAll(): Observable<IEmployer[]> {
        return this.http.get<IEmployer[]>(`${this.apiUrl}/all`);
    }

    getById(id: string): Observable<IEmployer> {
        return this.http.get<IEmployer>(`${this.apiUrl}/${id}`);
    }

    create(employer: IEmployer): Observable<IEmployer> {
        return this.http.post<IEmployer>(`${this.apiUrl}/create`, employer);
    }

    update(id: string, employer: IEmployer): Observable<IEmployer> {
        return this.http.put<IEmployer>(
            `${this.apiUrl}/update/${id}`,
            employer,
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }
}
