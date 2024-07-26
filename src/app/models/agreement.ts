import { IEmployer } from './employer';
import { IApplicant } from './applicant';

export interface IAgreement {
    _id: string;
    employer: IEmployer;
    applicant: IApplicant;
    jobPosition: string;
    professionalArea: string;
    fees: string;
}

export interface IServerAgreement {
    employerId: string;
    applicantId: string;
    jobPosition: string;
    professionalArea: string;
    fees: number;
}
