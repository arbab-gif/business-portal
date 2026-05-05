// Mock data for the admin portal

export type BusinessStatus = 'active' | 'suspended' | 'pending' | 'rejected';
export type StudentStatus = 'active' | 'suspended';

export interface Business {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactName: string;
  logoUrl?: string;
  brandColor?: string;
  hasPaymentMethod?: boolean;
  status: BusinessStatus;
  studentCount: number;
  createdAt: string;
  appliedAt: string;
  suspendedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  notes?: string;
  package: string;
  balance: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  businessId: string;
  businessName: string;
  status: StudentStatus;
  vehicleType: string;
  createdAt: string;
  lastActive?: string;
  mockTestAvg?: number;
  hazardScore?: number;
}

export const BUSINESSES: Business[] = [
  {
    id: 'biz-001',
    name: 'DriveRight Academy',
    email: 'admin@driveright.co.uk',
    phone: '+44 20 7123 4567',
    address: '12 Kensington High St, London W8 4PT',
    contactName: 'Sarah Mitchell',
    brandColor: '#6C3BAA',
    hasPaymentMethod: false,
    notes: 'Fleet of 12 vehicles. Preferred contact via email.',
    status: 'active',
    studentCount: 48,
    createdAt: '2024-01-15',
    appliedAt: '2024-01-10',
    package: 'Business Pro',
    balance: 240.00,
  },
  {
    id: 'biz-002',
    name: 'PassFirst Driving School',
    email: 'info@passfirst.co.uk',
    phone: '+44 121 456 7890',
    address: '89 Broad Street, Birmingham B1 2HF',
    contactName: 'James Thornton',
    status: 'active',
    studentCount: 32,
    createdAt: '2024-02-03',
    appliedAt: '2024-01-28',
    package: 'Business Standard',
    balance: 160.00,
  },
  {
    id: 'biz-003',
    name: 'QuickPass Training Ltd',
    email: 'hello@quickpass.co.uk',
    phone: '+44 161 789 0123',
    address: '34 Deansgate, Manchester M3 4LY',
    contactName: 'Emma Clarke',
    status: 'suspended',
    studentCount: 15,
    createdAt: '2024-01-20',
    appliedAt: '2024-01-18',
    suspendedAt: '2024-03-10',
    package: 'Business Standard',
    balance: 75.00,
    notes: 'Suspended due to failed payment on 2024-03-10. Card declined.',
  },
  {
    id: 'biz-004',
    name: 'RoadReady Institute',
    email: 'contact@roadready.co.uk',
    phone: '+44 113 234 5678',
    address: '21 Park Row, Leeds LS1 5JF',
    contactName: 'David Okafor',
    status: 'pending',
    studentCount: 0,
    createdAt: '',
    appliedAt: '2024-04-20',
    package: 'Business Pro',
    balance: 0,
  },
  {
    id: 'biz-005',
    name: 'TheoryMasters UK',
    email: 'apply@theorymasters.co.uk',
    phone: '+44 131 567 8901',
    address: '5 Princes Street, Edinburgh EH2 2QP',
    contactName: 'Fiona Henderson',
    status: 'pending',
    studentCount: 0,
    createdAt: '',
    appliedAt: '2024-04-22',
    package: 'Business Standard',
    balance: 0,
  },
  {
    id: 'biz-006',
    name: 'HighwayCode Pros',
    email: 'info@highwaycodepros.co.uk',
    phone: '+44 29 2034 5678',
    address: '10 Queen Street, Cardiff CF10 2BU',
    contactName: 'Rhys Parry',
    status: 'rejected',
    studentCount: 0,
    createdAt: '',
    appliedAt: '2024-03-05',
    rejectedAt: '2024-03-07',
    rejectionReason: 'Could not verify business registration number.',
    package: 'Business Standard',
    balance: 0,
  },
  {
    id: 'biz-007',
    name: 'Elite Driving Academy',
    email: 'admin@elitedrive.co.uk',
    phone: '+44 23 8060 1234',
    address: '77 Above Bar Street, Southampton SO14 7FH',
    contactName: 'Michael Foster',
    status: 'active',
    studentCount: 61,
    createdAt: '2023-11-05',
    appliedAt: '2023-10-30',
    package: 'Business Enterprise',
    balance: 610.00,
  },
];

export const STUDENTS: Student[] = [
  // ── DriveRight Academy (biz-001) ─────────────────────────────────────────
  { id: 'stu-001', name: 'Alex Johnson',     email: 'alex.j@email.com',      businessId: 'biz-001', businessName: 'DriveRight Academy',       status: 'active',    vehicleType: 'Car',              createdAt: '2024-02-01', lastActive: '2024-04-25', mockTestAvg: 82, hazardScore: 71 },
  { id: 'stu-002', name: 'Sophie Williams',  email: 'sophie.w@email.com',    businessId: 'biz-001', businessName: 'DriveRight Academy',       status: 'active',    vehicleType: 'Car',              createdAt: '2024-02-10', lastActive: '2024-04-24', mockTestAvg: 91, hazardScore: 88 },
  { id: 'stu-008', name: 'Amelia Thomas',    email: 'amelia.t@email.com',    businessId: 'biz-001', businessName: 'DriveRight Academy',       status: 'suspended', vehicleType: 'Motorbike',        createdAt: '2024-02-20', lastActive: '2024-04-01', mockTestAvg: 55, hazardScore: 50 },
  { id: 'stu-011', name: 'James Carter',     email: 'james.c@email.com',     businessId: 'biz-001', businessName: 'DriveRight Academy',       status: 'active',    vehicleType: 'Car',              createdAt: '2024-03-01', lastActive: '2024-04-26', mockTestAvg: 74, hazardScore: 68 },
  { id: 'stu-012', name: 'Emma Wright',      email: 'emma.w@email.com',      businessId: 'biz-001', businessName: 'DriveRight Academy',       status: 'active',    vehicleType: 'Car',              createdAt: '2024-03-10', lastActive: '2024-04-25', mockTestAvg: 86, hazardScore: 80 },
  { id: 'stu-013', name: 'Oliver Brown',     email: 'oliver.b@email.com',    businessId: 'biz-001', businessName: 'DriveRight Academy',       status: 'active',    vehicleType: 'Van',              createdAt: '2024-03-18', lastActive: '2024-04-22', mockTestAvg: 68, hazardScore: 63 },

  // ── PassFirst Driving School (biz-002) ───────────────────────────────────
  { id: 'stu-003', name: 'Liam Brown',       email: 'liam.b@email.com',      businessId: 'biz-002', businessName: 'PassFirst Driving School', status: 'active',    vehicleType: 'Motorbike',        createdAt: '2024-03-05', lastActive: '2024-04-23', mockTestAvg: 65, hazardScore: 58 },
  { id: 'stu-004', name: 'Olivia Davis',     email: 'olivia.d@email.com',    businessId: 'biz-002', businessName: 'PassFirst Driving School', status: 'suspended', vehicleType: 'Car',              createdAt: '2024-01-20', lastActive: '2024-03-15', mockTestAvg: 78, hazardScore: 74 },
  { id: 'stu-009', name: 'Harry Jackson',    email: 'harry.j@email.com',     businessId: 'biz-002', businessName: 'PassFirst Driving School', status: 'active',    vehicleType: 'CPC Certification',createdAt: '2024-03-15', lastActive: '2024-04-26', mockTestAvg: 88, hazardScore: 79 },
  { id: 'stu-014', name: 'Charlotte Evans',  email: 'charlotte.e@email.com', businessId: 'biz-002', businessName: 'PassFirst Driving School', status: 'active',    vehicleType: 'Car',              createdAt: '2024-03-22', lastActive: '2024-04-24', mockTestAvg: 79, hazardScore: 73 },
  { id: 'stu-015', name: 'Mason Turner',     email: 'mason.t@email.com',     businessId: 'biz-002', businessName: 'PassFirst Driving School', status: 'active',    vehicleType: 'Car',              createdAt: '2024-04-02', lastActive: '2024-04-25', mockTestAvg: 61, hazardScore: 55 },

  // ── QuickPass Training Ltd (biz-003) ─────────────────────────────────────
  { id: 'stu-005', name: 'Noah Wilson',      email: 'noah.w@email.com',      businessId: 'biz-003', businessName: 'QuickPass Training Ltd',   status: 'active',    vehicleType: 'HGV',              createdAt: '2024-01-25', lastActive: '2024-04-10', mockTestAvg: 72, hazardScore: 66 },
  { id: 'stu-016', name: 'Isabella Moore',   email: 'isabella.m@email.com',  businessId: 'biz-003', businessName: 'QuickPass Training Ltd',   status: 'active',    vehicleType: 'Car',              createdAt: '2024-02-12', lastActive: '2024-04-08', mockTestAvg: 84, hazardScore: 77 },
  { id: 'stu-017', name: 'Ethan Scott',      email: 'ethan.s@email.com',     businessId: 'biz-003', businessName: 'QuickPass Training Ltd',   status: 'active',    vehicleType: 'Van',              createdAt: '2024-02-28', lastActive: '2024-04-05', mockTestAvg: 70, hazardScore: 62 },
  { id: 'stu-018', name: 'Poppy Harris',     email: 'poppy.h@email.com',     businessId: 'biz-003', businessName: 'QuickPass Training Ltd',   status: 'suspended', vehicleType: 'Car',              createdAt: '2024-03-08', lastActive: '2024-03-20', mockTestAvg: 52, hazardScore: 48 },

  // ── Elite Driving Academy (biz-007) ──────────────────────────────────────
  { id: 'stu-006', name: 'Isla Taylor',      email: 'isla.t@email.com',      businessId: 'biz-007', businessName: 'Elite Driving Academy',    status: 'active',    vehicleType: 'Car',              createdAt: '2023-11-15', lastActive: '2024-04-26', mockTestAvg: 95, hazardScore: 92 },
  { id: 'stu-007', name: 'Jack Anderson',    email: 'jack.a@email.com',      businessId: 'biz-007', businessName: 'Elite Driving Academy',    status: 'active',    vehicleType: 'HGV + CPC',        createdAt: '2024-01-08', lastActive: '2024-04-25', mockTestAvg: 87, hazardScore: 83 },
  { id: 'stu-010', name: 'Grace White',      email: 'grace.w@email.com',     businessId: 'biz-007', businessName: 'Elite Driving Academy',    status: 'active',    vehicleType: 'Car',              createdAt: '2023-12-01', lastActive: '2024-04-24', mockTestAvg: 90, hazardScore: 85 },
  { id: 'stu-019', name: 'William Lewis',    email: 'william.l@email.com',   businessId: 'biz-007', businessName: 'Elite Driving Academy',    status: 'active',    vehicleType: 'Car',              createdAt: '2024-01-20', lastActive: '2024-04-23', mockTestAvg: 76, hazardScore: 70 },
  { id: 'stu-020', name: 'Chloe Martin',     email: 'chloe.m@email.com',     businessId: 'biz-007', businessName: 'Elite Driving Academy',    status: 'suspended', vehicleType: 'Motorbike',        createdAt: '2024-02-05', lastActive: '2024-03-28', mockTestAvg: 59, hazardScore: 53 },
];

// ── Progress Tracking ────────────────────────────────────────────────────────

export interface MockTestResult {
  date: string;
  score: number;   // out of 50  (pass ≥ 43)
  passed: boolean;
}

export interface HazardResult {
  date: string;
  score: number;   // out of 75  (pass ≥ 44)
  passed: boolean;
}

export interface CategoryResult {
  category: string;
  correct: number;
  total: number;
}

export interface StudentProgress {
  studentId: string;
  mockTests: MockTestResult[];
  hazardTests: HazardResult[];
  categories: CategoryResult[];
}

export const STUDENT_PROGRESS: StudentProgress[] = [
  // ── stu-001 Alex Johnson (82% mock, 71% hazard) ──────────────────────────
  {
    studentId: 'stu-001',
    mockTests: [
      { date: '2024-04-25', score: 44, passed: true  },
      { date: '2024-04-18', score: 42, passed: false },
      { date: '2024-04-10', score: 43, passed: true  },
      { date: '2024-04-03', score: 40, passed: false },
      { date: '2024-03-27', score: 45, passed: true  },
    ],
    hazardTests: [
      { date: '2024-04-24', score: 55, passed: true  },
      { date: '2024-04-05', score: 48, passed: true  },
      { date: '2024-03-15', score: 40, passed: false },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 18, total: 20 },
      { category: 'Rules of the Road',     correct: 15, total: 20 },
      { category: 'Vehicle Safety',        correct: 12, total: 15 },
      { category: 'Hazard Awareness',      correct: 10, total: 15 },
      { category: 'Motorway Driving',      correct:  8, total: 10 },
      { category: 'Vulnerable Road Users', correct:  9, total: 12 },
      { category: 'Environmental Issues',  correct:  6, total:  8 },
    ],
  },
  // ── stu-002 Sophie Williams (91% mock, 88% hazard) ───────────────────────
  {
    studentId: 'stu-002',
    mockTests: [
      { date: '2024-04-24', score: 49, passed: true },
      { date: '2024-04-17', score: 47, passed: true },
      { date: '2024-04-09', score: 46, passed: true },
      { date: '2024-04-02', score: 48, passed: true },
      { date: '2024-03-26', score: 45, passed: true },
    ],
    hazardTests: [
      { date: '2024-04-23', score: 68, passed: true },
      { date: '2024-04-12', score: 65, passed: true },
      { date: '2024-04-01', score: 60, passed: true },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 20, total: 20 },
      { category: 'Rules of the Road',     correct: 19, total: 20 },
      { category: 'Vehicle Safety',        correct: 14, total: 15 },
      { category: 'Hazard Awareness',      correct: 14, total: 15 },
      { category: 'Motorway Driving',      correct: 10, total: 10 },
      { category: 'Vulnerable Road Users', correct: 11, total: 12 },
      { category: 'Environmental Issues',  correct:  7, total:  8 },
    ],
  },
  // ── stu-008 Amelia Thomas (55% mock, 50% hazard) ─────────────────────────
  {
    studentId: 'stu-008',
    mockTests: [
      { date: '2024-04-01', score: 32, passed: false },
      { date: '2024-03-25', score: 29, passed: false },
      { date: '2024-03-18', score: 31, passed: false },
      { date: '2024-03-11', score: 28, passed: false },
      { date: '2024-03-04', score: 33, passed: false },
    ],
    hazardTests: [
      { date: '2024-03-30', score: 38, passed: false },
      { date: '2024-03-20', score: 35, passed: false },
      { date: '2024-03-10', score: 40, passed: false },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 10, total: 20 },
      { category: 'Rules of the Road',     correct:  9, total: 20 },
      { category: 'Vehicle Safety',        correct:  7, total: 15 },
      { category: 'Hazard Awareness',      correct:  6, total: 15 },
      { category: 'Motorway Driving',      correct:  4, total: 10 },
      { category: 'Vulnerable Road Users', correct:  5, total: 12 },
      { category: 'Environmental Issues',  correct:  3, total:  8 },
    ],
  },
  // ── stu-011 James Carter (74% mock, 68% hazard) ──────────────────────────
  {
    studentId: 'stu-011',
    mockTests: [
      { date: '2024-04-26', score: 40, passed: false },
      { date: '2024-04-19', score: 38, passed: false },
      { date: '2024-04-12', score: 43, passed: true  },
      { date: '2024-04-05', score: 41, passed: false },
      { date: '2024-03-29', score: 44, passed: true  },
    ],
    hazardTests: [
      { date: '2024-04-22', score: 52, passed: true  },
      { date: '2024-04-10', score: 48, passed: true  },
      { date: '2024-03-25', score: 44, passed: true  },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 15, total: 20 },
      { category: 'Rules of the Road',     correct: 14, total: 20 },
      { category: 'Vehicle Safety',        correct: 11, total: 15 },
      { category: 'Hazard Awareness',      correct: 10, total: 15 },
      { category: 'Motorway Driving',      correct:  7, total: 10 },
      { category: 'Vulnerable Road Users', correct:  8, total: 12 },
      { category: 'Environmental Issues',  correct:  5, total:  8 },
    ],
  },
  // ── stu-012 Emma Wright (86% mock, 80% hazard) ───────────────────────────
  {
    studentId: 'stu-012',
    mockTests: [
      { date: '2024-04-25', score: 46, passed: true },
      { date: '2024-04-18', score: 45, passed: true },
      { date: '2024-04-11', score: 44, passed: true },
      { date: '2024-04-04', score: 43, passed: true },
      { date: '2024-03-28', score: 46, passed: true },
    ],
    hazardTests: [
      { date: '2024-04-23', score: 62, passed: true },
      { date: '2024-04-14', score: 58, passed: true },
      { date: '2024-04-02', score: 55, passed: true },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 18, total: 20 },
      { category: 'Rules of the Road',     correct: 17, total: 20 },
      { category: 'Vehicle Safety',        correct: 13, total: 15 },
      { category: 'Hazard Awareness',      correct: 12, total: 15 },
      { category: 'Motorway Driving',      correct:  9, total: 10 },
      { category: 'Vulnerable Road Users', correct: 10, total: 12 },
      { category: 'Environmental Issues',  correct:  6, total:  8 },
    ],
  },
  // ── stu-013 Oliver Brown (68% mock, 63% hazard) ──────────────────────────
  {
    studentId: 'stu-013',
    mockTests: [
      { date: '2024-04-22', score: 38, passed: false },
      { date: '2024-04-15', score: 36, passed: false },
      { date: '2024-04-08', score: 39, passed: false },
      { date: '2024-04-01', score: 43, passed: true  },
      { date: '2024-03-25', score: 37, passed: false },
    ],
    hazardTests: [
      { date: '2024-04-20', score: 50, passed: true  },
      { date: '2024-04-08', score: 46, passed: true  },
      { date: '2024-03-28', score: 42, passed: false },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 14, total: 20 },
      { category: 'Rules of the Road',     correct: 13, total: 20 },
      { category: 'Vehicle Safety',        correct: 10, total: 15 },
      { category: 'Hazard Awareness',      correct:  9, total: 15 },
      { category: 'Motorway Driving',      correct:  6, total: 10 },
      { category: 'Vulnerable Road Users', correct:  7, total: 12 },
      { category: 'Environmental Issues',  correct:  4, total:  8 },
    ],
  },
  // ── stu-003 Liam Brown (65% mock, 58% hazard) ────────────────────────────
  {
    studentId: 'stu-003',
    mockTests: [
      { date: '2024-04-23', score: 36, passed: false },
      { date: '2024-04-16', score: 34, passed: false },
      { date: '2024-04-09', score: 38, passed: false },
      { date: '2024-04-02', score: 43, passed: true  },
      { date: '2024-03-26', score: 35, passed: false },
    ],
    hazardTests: [
      { date: '2024-04-21', score: 46, passed: true  },
      { date: '2024-04-09', score: 40, passed: false },
      { date: '2024-03-30', score: 44, passed: true  },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 13, total: 20 },
      { category: 'Rules of the Road',     correct: 12, total: 20 },
      { category: 'Vehicle Safety',        correct:  9, total: 15 },
      { category: 'Hazard Awareness',      correct:  9, total: 15 },
      { category: 'Motorway Driving',      correct:  6, total: 10 },
      { category: 'Vulnerable Road Users', correct:  7, total: 12 },
      { category: 'Environmental Issues',  correct:  4, total:  8 },
    ],
  },
  // ── stu-004 Olivia Davis (78% mock, 74% hazard) ──────────────────────────
  {
    studentId: 'stu-004',
    mockTests: [
      { date: '2024-03-15', score: 41, passed: false },
      { date: '2024-03-08', score: 43, passed: true  },
      { date: '2024-03-01', score: 40, passed: false },
      { date: '2024-02-23', score: 44, passed: true  },
      { date: '2024-02-16', score: 42, passed: false },
    ],
    hazardTests: [
      { date: '2024-03-14', score: 57, passed: true  },
      { date: '2024-03-04', score: 54, passed: true  },
      { date: '2024-02-22', score: 50, passed: true  },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 16, total: 20 },
      { category: 'Rules of the Road',     correct: 15, total: 20 },
      { category: 'Vehicle Safety',        correct: 11, total: 15 },
      { category: 'Hazard Awareness',      correct: 11, total: 15 },
      { category: 'Motorway Driving',      correct:  8, total: 10 },
      { category: 'Vulnerable Road Users', correct:  9, total: 12 },
      { category: 'Environmental Issues',  correct:  6, total:  8 },
    ],
  },
  // ── stu-009 Harry Jackson (88% mock, 79% hazard) ─────────────────────────
  {
    studentId: 'stu-009',
    mockTests: [
      { date: '2024-04-26', score: 47, passed: true },
      { date: '2024-04-19', score: 45, passed: true },
      { date: '2024-04-12', score: 46, passed: true },
      { date: '2024-04-05', score: 44, passed: true },
      { date: '2024-03-29', score: 47, passed: true },
    ],
    hazardTests: [
      { date: '2024-04-25', score: 61, passed: true },
      { date: '2024-04-15', score: 57, passed: true },
      { date: '2024-04-05', score: 55, passed: true },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 18, total: 20 },
      { category: 'Rules of the Road',     correct: 16, total: 20 },
      { category: 'Vehicle Safety',        correct: 13, total: 15 },
      { category: 'Hazard Awareness',      correct: 12, total: 15 },
      { category: 'Motorway Driving',      correct:  9, total: 10 },
      { category: 'Vulnerable Road Users', correct: 10, total: 12 },
      { category: 'Environmental Issues',  correct:  6, total:  8 },
    ],
  },
  // ── stu-014 Charlotte Evans (79% mock, 73% hazard) ───────────────────────
  {
    studentId: 'stu-014',
    mockTests: [
      { date: '2024-04-24', score: 42, passed: false },
      { date: '2024-04-17', score: 44, passed: true  },
      { date: '2024-04-10', score: 41, passed: false },
      { date: '2024-04-03', score: 43, passed: true  },
      { date: '2024-03-27', score: 45, passed: true  },
    ],
    hazardTests: [
      { date: '2024-04-22', score: 57, passed: true  },
      { date: '2024-04-10', score: 52, passed: true  },
      { date: '2024-03-30', score: 48, passed: true  },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 16, total: 20 },
      { category: 'Rules of the Road',     correct: 15, total: 20 },
      { category: 'Vehicle Safety',        correct: 12, total: 15 },
      { category: 'Hazard Awareness',      correct: 11, total: 15 },
      { category: 'Motorway Driving',      correct:  7, total: 10 },
      { category: 'Vulnerable Road Users', correct:  9, total: 12 },
      { category: 'Environmental Issues',  correct:  5, total:  8 },
    ],
  },
  // ── stu-015 Mason Turner (61% mock, 55% hazard) ──────────────────────────
  {
    studentId: 'stu-015',
    mockTests: [
      { date: '2024-04-25', score: 35, passed: false },
      { date: '2024-04-18', score: 33, passed: false },
      { date: '2024-04-11', score: 36, passed: false },
      { date: '2024-04-04', score: 38, passed: false },
      { date: '2024-03-28', score: 43, passed: true  },
    ],
    hazardTests: [
      { date: '2024-04-23', score: 44, passed: true  },
      { date: '2024-04-11', score: 40, passed: false },
      { date: '2024-04-01', score: 38, passed: false },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 12, total: 20 },
      { category: 'Rules of the Road',     correct: 11, total: 20 },
      { category: 'Vehicle Safety',        correct:  9, total: 15 },
      { category: 'Hazard Awareness',      correct:  8, total: 15 },
      { category: 'Motorway Driving',      correct:  6, total: 10 },
      { category: 'Vulnerable Road Users', correct:  7, total: 12 },
      { category: 'Environmental Issues',  correct:  4, total:  8 },
    ],
  },
  // ── stu-005 Noah Wilson (72% mock, 66% hazard) ───────────────────────────
  {
    studentId: 'stu-005',
    mockTests: [
      { date: '2024-04-10', score: 39, passed: false },
      { date: '2024-04-03', score: 43, passed: true  },
      { date: '2024-03-27', score: 40, passed: false },
      { date: '2024-03-20', score: 44, passed: true  },
      { date: '2024-03-13', score: 38, passed: false },
    ],
    hazardTests: [
      { date: '2024-04-08', score: 52, passed: true  },
      { date: '2024-03-28', score: 47, passed: true  },
      { date: '2024-03-18', score: 44, passed: true  },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 15, total: 20 },
      { category: 'Rules of the Road',     correct: 13, total: 20 },
      { category: 'Vehicle Safety',        correct: 11, total: 15 },
      { category: 'Hazard Awareness',      correct: 10, total: 15 },
      { category: 'Motorway Driving',      correct:  7, total: 10 },
      { category: 'Vulnerable Road Users', correct:  8, total: 12 },
      { category: 'Environmental Issues',  correct:  5, total:  8 },
    ],
  },
  // ── stu-016 Isabella Moore (84% mock, 77% hazard) ────────────────────────
  {
    studentId: 'stu-016',
    mockTests: [
      { date: '2024-04-08', score: 45, passed: true },
      { date: '2024-04-01', score: 44, passed: true },
      { date: '2024-03-25', score: 43, passed: true },
      { date: '2024-03-18', score: 46, passed: true },
      { date: '2024-03-11', score: 44, passed: true },
    ],
    hazardTests: [
      { date: '2024-04-06', score: 60, passed: true },
      { date: '2024-03-26', score: 56, passed: true },
      { date: '2024-03-16', score: 52, passed: true },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 17, total: 20 },
      { category: 'Rules of the Road',     correct: 16, total: 20 },
      { category: 'Vehicle Safety',        correct: 13, total: 15 },
      { category: 'Hazard Awareness',      correct: 11, total: 15 },
      { category: 'Motorway Driving',      correct:  8, total: 10 },
      { category: 'Vulnerable Road Users', correct:  9, total: 12 },
      { category: 'Environmental Issues',  correct:  6, total:  8 },
    ],
  },
  // ── stu-017 Ethan Scott (70% mock, 62% hazard) ───────────────────────────
  {
    studentId: 'stu-017',
    mockTests: [
      { date: '2024-04-05', score: 38, passed: false },
      { date: '2024-03-29', score: 40, passed: false },
      { date: '2024-03-22', score: 43, passed: true  },
      { date: '2024-03-15', score: 37, passed: false },
      { date: '2024-03-08', score: 41, passed: false },
    ],
    hazardTests: [
      { date: '2024-04-03', score: 49, passed: true  },
      { date: '2024-03-24', score: 45, passed: true  },
      { date: '2024-03-14', score: 42, passed: false },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 14, total: 20 },
      { category: 'Rules of the Road',     correct: 13, total: 20 },
      { category: 'Vehicle Safety',        correct: 10, total: 15 },
      { category: 'Hazard Awareness',      correct: 10, total: 15 },
      { category: 'Motorway Driving',      correct:  7, total: 10 },
      { category: 'Vulnerable Road Users', correct:  8, total: 12 },
      { category: 'Environmental Issues',  correct:  5, total:  8 },
    ],
  },
  // ── stu-018 Poppy Harris (52% mock, 48% hazard) ──────────────────────────
  {
    studentId: 'stu-018',
    mockTests: [
      { date: '2024-03-20', score: 30, passed: false },
      { date: '2024-03-13', score: 28, passed: false },
      { date: '2024-03-06', score: 31, passed: false },
      { date: '2024-02-28', score: 27, passed: false },
      { date: '2024-02-21', score: 32, passed: false },
    ],
    hazardTests: [
      { date: '2024-03-18', score: 38, passed: false },
      { date: '2024-03-08', score: 35, passed: false },
      { date: '2024-02-27', score: 37, passed: false },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct:  9, total: 20 },
      { category: 'Rules of the Road',     correct:  8, total: 20 },
      { category: 'Vehicle Safety',        correct:  7, total: 15 },
      { category: 'Hazard Awareness',      correct:  6, total: 15 },
      { category: 'Motorway Driving',      correct:  4, total: 10 },
      { category: 'Vulnerable Road Users', correct:  5, total: 12 },
      { category: 'Environmental Issues',  correct:  3, total:  8 },
    ],
  },
  // ── stu-006 Isla Taylor (95% mock, 92% hazard) ───────────────────────────
  {
    studentId: 'stu-006',
    mockTests: [
      { date: '2024-04-26', score: 50, passed: true },
      { date: '2024-04-19', score: 49, passed: true },
      { date: '2024-04-12', score: 50, passed: true },
      { date: '2024-04-05', score: 48, passed: true },
      { date: '2024-03-29', score: 49, passed: true },
    ],
    hazardTests: [
      { date: '2024-04-25', score: 71, passed: true },
      { date: '2024-04-16', score: 69, passed: true },
      { date: '2024-04-06', score: 67, passed: true },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 20, total: 20 },
      { category: 'Rules of the Road',     correct: 20, total: 20 },
      { category: 'Vehicle Safety',        correct: 15, total: 15 },
      { category: 'Hazard Awareness',      correct: 14, total: 15 },
      { category: 'Motorway Driving',      correct: 10, total: 10 },
      { category: 'Vulnerable Road Users', correct: 12, total: 12 },
      { category: 'Environmental Issues',  correct:  8, total:  8 },
    ],
  },
  // ── stu-007 Jack Anderson (87% mock, 83% hazard) ─────────────────────────
  {
    studentId: 'stu-007',
    mockTests: [
      { date: '2024-04-25', score: 46, passed: true },
      { date: '2024-04-18', score: 45, passed: true },
      { date: '2024-04-11', score: 47, passed: true },
      { date: '2024-04-04', score: 44, passed: true },
      { date: '2024-03-28', score: 46, passed: true },
    ],
    hazardTests: [
      { date: '2024-04-24', score: 65, passed: true },
      { date: '2024-04-14', score: 61, passed: true },
      { date: '2024-04-04', score: 58, passed: true },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 18, total: 20 },
      { category: 'Rules of the Road',     correct: 17, total: 20 },
      { category: 'Vehicle Safety',        correct: 13, total: 15 },
      { category: 'Hazard Awareness',      correct: 13, total: 15 },
      { category: 'Motorway Driving',      correct:  9, total: 10 },
      { category: 'Vulnerable Road Users', correct: 10, total: 12 },
      { category: 'Environmental Issues',  correct:  7, total:  8 },
    ],
  },
  // ── stu-010 Grace White (90% mock, 85% hazard) ───────────────────────────
  {
    studentId: 'stu-010',
    mockTests: [
      { date: '2024-04-24', score: 48, passed: true },
      { date: '2024-04-17', score: 47, passed: true },
      { date: '2024-04-10', score: 46, passed: true },
      { date: '2024-04-03', score: 48, passed: true },
      { date: '2024-03-27', score: 45, passed: true },
    ],
    hazardTests: [
      { date: '2024-04-23', score: 66, passed: true },
      { date: '2024-04-13', score: 62, passed: true },
      { date: '2024-04-03', score: 60, passed: true },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 19, total: 20 },
      { category: 'Rules of the Road',     correct: 18, total: 20 },
      { category: 'Vehicle Safety',        correct: 14, total: 15 },
      { category: 'Hazard Awareness',      correct: 13, total: 15 },
      { category: 'Motorway Driving',      correct:  9, total: 10 },
      { category: 'Vulnerable Road Users', correct: 11, total: 12 },
      { category: 'Environmental Issues',  correct:  7, total:  8 },
    ],
  },
  // ── stu-019 William Lewis (76% mock, 70% hazard) ─────────────────────────
  {
    studentId: 'stu-019',
    mockTests: [
      { date: '2024-04-23', score: 41, passed: false },
      { date: '2024-04-16', score: 43, passed: true  },
      { date: '2024-04-09', score: 40, passed: false },
      { date: '2024-04-02', score: 44, passed: true  },
      { date: '2024-03-26', score: 42, passed: false },
    ],
    hazardTests: [
      { date: '2024-04-21', score: 55, passed: true  },
      { date: '2024-04-11', score: 51, passed: true  },
      { date: '2024-04-01', score: 47, passed: true  },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 16, total: 20 },
      { category: 'Rules of the Road',     correct: 14, total: 20 },
      { category: 'Vehicle Safety',        correct: 11, total: 15 },
      { category: 'Hazard Awareness',      correct: 11, total: 15 },
      { category: 'Motorway Driving',      correct:  7, total: 10 },
      { category: 'Vulnerable Road Users', correct:  9, total: 12 },
      { category: 'Environmental Issues',  correct:  5, total:  8 },
    ],
  },
  // ── stu-020 Chloe Martin (59% mock, 53% hazard) ──────────────────────────
  {
    studentId: 'stu-020',
    mockTests: [
      { date: '2024-03-28', score: 34, passed: false },
      { date: '2024-03-21', score: 31, passed: false },
      { date: '2024-03-14', score: 35, passed: false },
      { date: '2024-03-07', score: 33, passed: false },
      { date: '2024-02-29', score: 36, passed: false },
    ],
    hazardTests: [
      { date: '2024-03-26', score: 42, passed: false },
      { date: '2024-03-16', score: 39, passed: false },
      { date: '2024-03-06', score: 41, passed: false },
    ],
    categories: [
      { category: 'Road Signs & Markings', correct: 11, total: 20 },
      { category: 'Rules of the Road',     correct: 10, total: 20 },
      { category: 'Vehicle Safety',        correct:  8, total: 15 },
      { category: 'Hazard Awareness',      correct:  8, total: 15 },
      { category: 'Motorway Driving',      correct:  5, total: 10 },
      { category: 'Vulnerable Road Users', correct:  6, total: 12 },
      { category: 'Environmental Issues',  correct:  4, total:  8 },
    ],
  },
];

export const STATS = {
  totalBusinesses: BUSINESSES.length,
  activeBusinesses: BUSINESSES.filter(b => b.status === 'active').length,
  pendingApplications: BUSINESSES.filter(b => b.status === 'pending').length,
  suspendedBusinesses: BUSINESSES.filter(b => b.status === 'suspended').length,
  totalStudents: STUDENTS.length,
  activeStudents: STUDENTS.filter(s => s.status === 'active').length,
  suspendedStudents: STUDENTS.filter(s => s.status === 'suspended').length,
};
