export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  job: string;
  status: string;
  appliedDate: string;
  experience: string;
  resume: string;
  score: number;
}

export const DUMMY_APPLICANTS: Applicant[] = [
  {
    id: 'APP-001',
    name: 'Khalid Rahman',
    email: 'khalid.r@email.com',
    phone: '+971501112233',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    job: 'Senior Sales Agent',
    status: 'interviewed',
    appliedDate: '2024-01-08',
    experience: '6 years',
    resume: 'resume_khalid.pdf',
    score: 85
  },
  {
    id: 'APP-002',
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    phone: '+971504445566',
    avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
    job: 'Digital Marketing Manager',
    status: 'shortlisted',
    appliedDate: '2024-01-12',
    experience: '4 years',
    resume: 'resume_priya.pdf',
    score: 78
  },
  {
    id: 'APP-003',
    name: 'David Chen',
    email: 'david.c@email.com',
    phone: '+971507778899',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    job: 'Senior Sales Agent',
    status: 'new',
    appliedDate: '2024-01-15',
    experience: '8 years',
    resume: 'resume_david.pdf',
    score: 92
  }
];
