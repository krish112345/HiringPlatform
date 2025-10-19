import type { Candidate, Application, Job } from './definitions';

export const applicants: (Candidate & { application: Application })[] = [];
