import { IEmployer } from './employer';

export interface IVacancy {
    _id: string;
    employer: IEmployer;
    jobPosition: string;
    professionalArea: string;
    salary: string;
    isOpen: boolean;
}
