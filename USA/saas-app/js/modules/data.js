/* =========================================
   ABC Constructions — Data Module
   Sample data for dashboard and modules
   ========================================= */

const AppData = {
  // Sales team members
  salesTeam: [
    { id: 's1', name: 'John Smith', role: 'Sales Representative', commissionRate: 20 },
    { id: 's2', name: 'Sarah Johnson', role: 'Sales Representative', commissionRate: 20 },
    { id: 's3', name: 'Mike Wilson', role: 'Senior Sales Rep', commissionRate: 20 },
  ],

  // Interest forms submitted by customers
  interestForms: [
    {
      id: 'IF-001',
      customerName: 'Robert Martinez',
      email: 'robert.m@email.com',
      phone: '(555) 123-4567',
      address: '123 Oak Street, Austin, TX 78701',
      workType: 'drainage',
      description: 'Backyard drainage installation for new home',
      propertyType: 'residential',
      timeline: '1-2 weeks',
      budget: '5000-10000',
      status: 'new',
      priority: 'medium',
      submittedAt: '2026-10-20T10:30:00',
      assignedSalesPerson: 's1',
      adminNotes: '',
    },
    {
      id: 'IF-002',
      customerName: 'Linda Chen',
      email: 'linda.chen@email.com',
      phone: '(555) 234-5678',
      address: '456 Pine Avenue, Austin, TX 78702',
      workType: 'lawns',
      description: 'Front lawn landscaping and irrigation',
      propertyType: 'residential',
      timeline: '2-4 weeks',
      budget: '3000-5000',
      status: 'contacted',
      priority: 'high',
      submittedAt: '2026-10-21T14:15:00',
      assignedSalesPerson: 's2',
      adminNotes: 'Called back, scheduled site visit for Friday.',
    },
    {
      id: 'IF-003',
      customerName: 'David Parker',
      email: 'david.parker@email.com',
      phone: '(555) 345-6789',
      address: '789 Cedar Lane, Austin, TX 78703',
      workType: 'lights',
      description: 'Exterior trim lighting installation',
      propertyType: 'commercial',
      timeline: '1 month',
      budget: '10000-15000',
      status: 'new',
      priority: 'low',
      submittedAt: '2026-10-22T09:00:00',
      assignedSalesPerson: 's3',
      adminNotes: '',
    },
  ],

  // Proposals / Projects
  projects: [
    {
      id: 'PJ-1001',
      customerName: 'Robert Martinez',
      workType: 'drainage',
      jobValue: 8500,
      depositPaid: 4250,
      remainingBalance: 4250,
      paymentStatus: 'partial',
      status: 'wip',
      scheduledDate: '2026-11-05',
      completionDate: null,
      salesPerson: 's1',
      changeOrderSalesPerson: null,
      commissionSplit: null,
      permitReceived: false,
      permitAlert: false,
      inspectionStatus: 'pending',
      onTime: true,
      proposalLink: 'https://app.abcconstructions.com/proposal/PJ-1001',
      customerApproved: true,
      approvedAt: '2026-10-21T16:00:00',
      createdAt: '2026-10-20T11:00:00',
    },
    {
      id: 'PJ-1002',
      customerName: 'Linda Chen',
      workType: 'lawns',
      jobValue: 6200,
      depositPaid: 3100,
      remainingBalance: 3100,
      paymentStatus: 'partial',
      status: 'wip',
      scheduledDate: '2026-11-12',
      completionDate: null,
      salesPerson: 's2',
      changeOrderSalesPerson: null,
      commissionSplit: null,
      permitReceived: false,
      permitAlert: false,
      inspectionStatus: 'pending',
      onTime: true,
      proposalLink: 'https://app.abcconstructions.com/proposal/PJ-1002',
      customerApproved: true,
      approvedAt: '2026-10-22T10:30:00',
      createdAt: '2026-10-21T15:00:00',
    },
    {
      id: 'PJ-1003',
      customerName: 'David Parker',
      workType: 'lights',
      jobValue: 3400,
      depositPaid: 1700,
      remainingBalance: 1700,
      paymentStatus: 'partial',
      status: 'completed',
      scheduledDate: '2026-10-15',
      completionDate: '2026-10-18',
      salesPerson: 's3',
      changeOrderSalesPerson: null,
      commissionSplit: null,
      permitReceived: false,
      permitAlert: false,
      inspectionStatus: 'passed',
      onTime: true,
      proposalLink: 'https://app.abcconstructions.com/proposal/PJ-1003',
      customerApproved: true,
      approvedAt: '2026-10-14T09:00:00',
      createdAt: '2026-10-12T14:00:00',
    },
    {
      id: 'PJ-1004',
      customerName: 'Emily Watson',
      workType: 'drainage',
      jobValue: 12000,
      depositPaid: 6000,
      remainingBalance: 6000,
      paymentStatus: 'partial',
      status: 'wip',
      scheduledDate: '2026-10-30',
      completionDate: null,
      salesPerson: 's1',
      changeOrderSalesPerson: 's2',
      commissionSplit: { s1: 10, s2: 10 },
      permitReceived: true,
      permitAlert: true,
      inspectionStatus: 'pending',
      onTime: false,
      proposalLink: 'https://app.abcconstructions.com/proposal/PJ-1004',
      customerApproved: true,
      approvedAt: '2026-10-18T11:00:00',
      createdAt: '2026-10-15T09:00:00',
    },
    {
      id: 'PJ-1005',
      customerName: 'Michael Torres',
      workType: 'mixed',
      jobValue: 15500,
      depositPaid: 7750,
      remainingBalance: 7750,
      paymentStatus: 'partial',
      status: 'wip',
      scheduledDate: '2026-11-20',
      completionDate: null,
      salesPerson: 's2',
      changeOrderSalesPerson: null,
      commissionSplit: null,
      permitReceived: true,
      permitAlert: false,
      inspectionStatus: 'pending',
      onTime: true,
      proposalLink: 'https://app.abcconstructions.com/proposal/PJ-1005',
      customerApproved: true,
      approvedAt: '2026-10-20T14:00:00',
      createdAt: '2026-10-18T16:00:00',
    },
  ],

  // Inventory items (Trim Light supplier credits)
  inventory: [
    { id: 'inv-1', item: 'LED Trim Lights (50ft)', sku: 'TL-LED-50', quantity: 120, minThreshold: 50, unitCost: 8.50, supplier: 'Trim Light Co.' },
    { id: 'inv-2', item: 'Light Channels (white)', sku: 'TL-CH-W', quantity: 85, minThreshold: 30, unitCost: 4.20, supplier: 'Trim Light Co.' },
    { id: 'inv-3', item: 'WiFi Controller', sku: 'TL-WFC-1', quantity: 15, minThreshold: 10, unitCost: 45.00, supplier: 'Trim Light Co.' },
    { id: 'inv-4', item: 'Drainage Pipe (4in)', sku: 'DR-PIPE-4', quantity: 200, minThreshold: 100, unitCost: 6.75, supplier: 'Build Supply Co.' },
    { id: 'inv-5', item: 'Drainage Fittings', sku: 'DR-FIT-4', quantity: 45, minThreshold: 25, unitCost: 3.50, supplier: 'Build Supply Co.' },
  ],

  // Permits
  permits: [
    { id: 'PER-201', projectId: 'PJ-1004', customerName: 'Emily Watson', workType: 'drainage', status: 'received', receivedAt: '2026-10-22T09:00:00', portal: 'State Portal' },
    { id: 'PER-202', projectId: 'PJ-1005', customerName: 'Michael Torres', workType: 'drainage', status: 'pending', receivedAt: null, portal: 'State Portal' },
  ],

  // Settings
  settings: {
    companyName: 'The ABC Constructions Company',
    location: 'USA',
    rateCardVersion: '2026-v1',
    paymentProvider: 'Stripe',
    notificationChannels: ['whatsapp', 'email', 'sms'],
    advanceNoticeDays: 7,
    depositPercentage: 50,
  },

  // Staff members organized by category
  staff: [
    // HR
    { id: 'st-001', name: 'Alice Johnson', category: 'HR', role: 'HR Manager', systemRole: 'Admin', email: 'alice.j@abcconstructions.com', phone: '(555) 101-0001', salary: 75000, hireDate: '2024-03-15', attendance: [], leaveBalance: 15, leavesTaken: 3 },
    { id: 'st-002', name: 'Bob Smith', category: 'HR', role: 'HR Coordinator', systemRole: 'Manager', email: 'bob.s@abcconstructions.com', phone: '(555) 101-0002', salary: 55000, hireDate: '2025-01-10', attendance: [], leaveBalance: 15, leavesTaken: 1 },
    // Production
    { id: 'st-003', name: 'Carol Davis', category: 'Production', role: 'Production Supervisor', systemRole: 'Manager', email: 'carol.d@abcconstructions.com', phone: '(555) 102-0001', salary: 68000, hireDate: '2023-08-20', attendance: [], leaveBalance: 15, leavesTaken: 2 },
    { id: 'st-004', name: 'David Lee', category: 'Production', role: 'Production Worker', systemRole: 'Staff', email: 'david.l@abcconstructions.com', phone: '(555) 102-0002', salary: 48000, hireDate: '2024-06-05', attendance: [], leaveBalance: 15, leavesTaken: 0 },
    { id: 'st-005', name: 'Eva Martinez', category: 'Production', role: 'Production Worker', systemRole: 'Staff', email: 'eva.m@abcconstructions.com', phone: '(555) 102-0003', salary: 48000, hireDate: '2025-02-14', attendance: [], leaveBalance: 15, leavesTaken: 1 },
    // Field Crew
    { id: 'st-006', name: 'Frank Wilson', category: 'Field Crew', role: 'Field Crew Lead', systemRole: 'Manager', email: 'frank.w@abcconstructions.com', phone: '(555) 103-0001', salary: 62000, hireDate: '2023-11-01', attendance: [], leaveBalance: 15, leavesTaken: 4 },
    { id: 'st-007', name: 'Grace Chen', category: 'Field Crew', role: 'Field Technician', systemRole: 'Staff', email: 'grace.c@abcconstructions.com', phone: '(555) 103-0002', salary: 52000, hireDate: '2024-04-10', attendance: [], leaveBalance: 15, leavesTaken: 1 },
    { id: 'st-008', name: 'Henry Taylor', category: 'Field Crew', role: 'Field Technician', systemRole: 'Staff', email: 'henry.t@abcconstructions.com', phone: '(555) 103-0003', salary: 52000, hireDate: '2025-03-01', attendance: [], leaveBalance: 15, leavesTaken: 0 },
    // IT
    { id: 'st-009', name: 'Iris Anderson', category: 'IT', role: 'IT Administrator', systemRole: 'Admin', email: 'iris.a@abcconstructions.com', phone: '(555) 104-0001', salary: 70000, hireDate: '2023-09-15', attendance: [], leaveBalance: 15, leavesTaken: 2 },
    { id: 'st-010', name: 'Jack Robinson', category: 'IT', role: 'IT Support Specialist', systemRole: 'Staff', email: 'jack.r@abcconstructions.com', phone: '(555) 104-0002', salary: 55000, hireDate: '2024-12-01', attendance: [], leaveBalance: 15, leavesTaken: 1 },
    // Manager
    { id: 'st-011', name: 'Karen White', category: 'Manager', role: 'Operations Manager', systemRole: 'Admin', email: 'karen.w@abcconstructions.com', phone: '(555) 105-0001', salary: 90000, hireDate: '2022-05-01', attendance: [], leaveBalance: 20, leavesTaken: 5 },
    { id: 'st-012', name: 'Leo Clark', category: 'Manager', role: 'Project Manager', systemRole: 'Manager', email: 'leo.c@abcconstructions.com', phone: '(555) 105-0002', salary: 80000, hireDate: '2023-07-10', attendance: [], leaveBalance: 20, leavesTaken: 3 },
    // Customer Service
    { id: 'st-013', name: 'Mia Rodriguez', category: 'Customer Service', role: 'Customer Service Lead', systemRole: 'Manager', email: 'mia.r@abcconstructions.com', phone: '(555) 106-0001', salary: 58000, hireDate: '2024-01-20', attendance: [], leaveBalance: 15, leavesTaken: 2 },
    { id: 'st-014', name: 'Noah Baker', category: 'Customer Service', role: 'Customer Service Rep', systemRole: 'Staff', email: 'noah.b@abcconstructions.com', phone: '(555) 106-0002', salary: 45000, hireDate: '2025-01-05', attendance: [], leaveBalance: 15, leavesTaken: 0 },
  ],
};

// Helper: get sales person name by id
AppData.getSalesPersonName = function (id) {
  const person = this.salesTeam.find((p) => p.id === id);
  return person ? person.name : 'Unassigned';
};

// Helper: get projects by status
AppData.getProjectsByStatus = function (status) {
  return this.projects.filter((p) => p.status === status);
};

// Helper: get new interest forms count (unread by admin)
AppData.getNewInterestFormsCount = function () {
  return this.interestForms.filter((f) => f.status === 'new').length;
};

// Helper: get dashboard stats
AppData.getDashboardStats = function () {
  const total = this.projects.length;
  const wip = this.projects.filter((p) => p.status === 'wip').length;
  const completed = this.projects.filter((p) => p.status === 'completed').length;
  const totalValue = this.projects.reduce((sum, p) => sum + p.jobValue, 0);
  const totalPaid = this.projects.reduce((sum, p) => sum + p.depositPaid, 0);
  const pendingBalance = this.projects.reduce((sum, p) => sum + p.remainingBalance, 0);
  const onTime = this.projects.filter((p) => p.onTime).length;
  const delayed = this.projects.filter((p) => !p.onTime).length;

  return {
    totalProjects: total,
    wipProjects: wip,
    completedProjects: completed,
    totalJobValue: totalValue,
    totalPaid: totalPaid,
    pendingBalance: pendingBalance,
    onTime: onTime,
    delayed: delayed,
  };
};

// Helper: get staff by category
AppData.getStaffByCategory = function (category) {
  return this.staff.filter((s) => s.category === category);
};

// Helper: get staff categories
AppData.getStaffCategories = function () {
  const categories = [...new Set(this.staff.map((s) => s.category))];
  return categories;
};

// Helper: get staff member by id
AppData.getStaffById = function (id) {
  return this.staff.find((s) => s.id === id);
};

// Helper: add staff member
AppData.addStaffMember = function (member) {
  this.staff.push(member);
};

// Helper: record attendance for a staff member on a date
AppData.recordAttendance = function (staffId, date, status) {
  const staff = this.getStaffById(staffId);
  if (!staff) return;
  const existing = staff.attendance.find((a) => a.date === date);
  if (existing) {
    existing.status = status;
  } else {
    staff.attendance.push({ date, status });
  }
};

// Helper: get attendance stats for a staff member
AppData.getAttendanceStats = function (staffId) {
  const staff = this.getStaffById(staffId);
  if (!staff) return { present: 0, absent: 0, leave: 0, total: 0 };
  const present = staff.attendance.filter((a) => a.status === 'present').length;
  const absent = staff.attendance.filter((a) => a.status === 'absent').length;
  const leave = staff.attendance.filter((a) => a.status === 'leave').length;
  return { present, absent, leave, total: staff.attendance.length };
};

// =========================================
// LocalStorage Persistence
// =========================================

const STORAGE_KEY = 'abc_constructions_data';

// Save all mutable data to localStorage
AppData.save = function () {
  try {
    const payload = {
      interestForms: this.interestForms,
      projects: this.projects,
      staff: this.staff,
      permits: this.permits,
      notifications: this.notifications || [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to save data to localStorage', e);
  }
};

// Load data from localStorage, falling back to defaults
AppData.load = function () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const payload = JSON.parse(raw);
    if (payload.interestForms) this.interestForms = payload.interestForms;
    if (payload.projects) this.projects = payload.projects;
    if (payload.staff) this.staff = payload.staff;
    if (payload.permits) this.permits = payload.permits;
    if (payload.notifications) this.notifications = payload.notifications;
  } catch (e) {
    console.warn('Failed to load data from localStorage', e);
  }
};

// Auto-load on module init
AppData.load();

// Convenience: auto-save after any mutation
const _originalPush = Array.prototype.push;
Array.prototype.push = function (...items) {
  const result = _originalPush.apply(this, items);
  if (this === AppData.interestForms || this === AppData.projects || this === AppData.staff || this === AppData.permits || this === AppData.notifications) {
    AppData.save();
  }
  return result;
};

// =========================================
// Role-Based Access Control
// =========================================

// Get staff members by system role
AppData.getStaffBySystemRole = function (systemRole) {
  return this.staff.filter((s) => s.systemRole === systemRole);
};

// Get all admins
AppData.getAdmins = function () {
  return this.getStaffBySystemRole('Admin');
};

// Get all managers
AppData.getManagers = function () {
  return this.getStaffBySystemRole('Manager');
};

// Check if a staff member has admin access
AppData.isAdmin = function (staffId) {
  const staff = this.getStaffById(staffId);
  return staff ? staff.systemRole === 'Admin' : false;
};

// Check if a staff member has manager or admin access
AppData.isManagerOrAdmin = function (staffId) {
  const staff = this.getStaffById(staffId);
  return staff ? (staff.systemRole === 'Admin' || staff.systemRole === 'Manager') : false;
};

// Check if a staff member can perform admin-only actions
// Use this to gate features that should be restricted to Admin only in the future
AppData.canAccessAdminOnly = function (staffId) {
  const staff = this.getStaffById(staffId);
  return staff ? staff.systemRole === 'Admin' : false;
};

// Default system role for new staff members
AppData.DEFAULT_SYSTEM_ROLE = 'Staff';

// Valid system roles
AppData.SYSTEM_ROLES = ['Admin', 'Manager', 'Staff'];
