import { IEmployer } from './employer';

export interface IVacancy {
    _id: string;
    employer: IEmployer;
    jobPosition: string;
    professionalArea: string;
    salary: number;
    isOpen: boolean;
}

export interface IServerVacancy {
    employerId: string;
    jobPosition: string;
    professionalArea: string;
    salary: number;
}
