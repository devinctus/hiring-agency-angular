import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    private professionalAreaSource = new BehaviorSubject<string>('All');
    currentProfessionalArea = this.professionalAreaSource.asObservable();

    changeProfessionalArea(area: string) {
        this.professionalAreaSource.next(area);
    }
}
