import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAgreement, IServerAgreement } from '../models/agreement';

@Injectable({
    providedIn: 'root',
})
export class AgreementService {
    private apiUrl = 'http://localhost:5000/api/agreements';

    constructor(private http: HttpClient) {}

    getAll(): Observable<IAgreement[]> {
        return this.http.get<IAgreement[]>(`${this.apiUrl}/all`);
    }

    getById(id: string): Observable<IAgreement> {
        return this.http.get<IAgreement>(`${this.apiUrl}/${id}`);
    }

    create(agreement: IServerAgreement): Observable<IServerAgreement> {
        return this.http.post<IServerAgreement>(
            `${this.apiUrl}/create`,
            agreement,
        );
    }

    update(
        id: string,
        agreement: IServerAgreement,
    ): Observable<IServerAgreement> {
        return this.http.put<IServerAgreement>(
            `${this.apiUrl}/update/${id}`,
            agreement,
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }
}
