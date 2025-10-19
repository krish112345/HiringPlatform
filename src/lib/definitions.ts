export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  applicationIds?: string[];
};

export type Application = {
  id: string;
  candidateId: string;
  jobId: string;
  submissionDate: string;
  status: 'Applied' | 'Interviewing' | 'Offered' | 'Rejected';
  answers: string; // JSON string
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
  };
  jobRole: string;
  offerLetterUrl?: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  postedDate: string;
  closingDate: string;
};
