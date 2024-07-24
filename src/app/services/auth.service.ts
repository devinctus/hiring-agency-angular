import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/user'; // Update the import for your User interface

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/users'; // Replace with your backend URL

    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
            email,
            password,
        });
    }

    register(name: string, email: string, password: string): Observable<IUser> {
        return this.http.post<IUser>(`${this.apiUrl}/register`, {
            name,
            email,
            password,
        });
    }
}
