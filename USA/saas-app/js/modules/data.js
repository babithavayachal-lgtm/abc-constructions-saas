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
      workType: 'drainage',
      description: 'Backyard drainage installation for new home',
      status: 'new',
      submittedAt: '2026-10-20T10:30:00',
      assignedSalesPerson: 's1',
    },
    {
      id: 'IF-002',
      customerName: 'Linda Chen',
      email: 'linda.chen@email.com',
      phone: '(555) 234-5678',
      workType: 'lawns',
      description: 'Front lawn landscaping and irrigation',
      status: 'contacted',
      submittedAt: '2026-10-21T14:15:00',
      assignedSalesPerson: 's2',
    },
    {
      id: 'IF-003',
      customerName: 'David Parker',
      email: 'david.parker@email.com',
      phone: '(555) 345-6789',
      workType: 'lights',
      description: 'Exterior trim lighting installation',
      status: 'new',
      submittedAt: '2026-10-22T09:00:00',
      assignedSalesPerson: 's3',
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
