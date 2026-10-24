/* =========================================
   ABC Constructions — App Module
   Core application initialization and utilities
   ========================================= */

const App = {
  currentPage: 'dashboard',

  init() {
    this.setupNavigation();
    this.setupModals();
    this.setupAddProjectForm();
    this.setupInterestForm();
    this.setupCustomerPortalForm();
    this.setupPermitForm();
    this.setupScheduleForm();
    this.setupChangeOrderForm();
    this.setupMaintenanceGuideForm();
    this.setupTestNotificationForm();
    this.setupThemeToggle();
    Router.init();
    Dashboard.render();
  },

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        this.navigateTo(page);
      });
    });
  },

  navigateTo(page) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach((l) => {
      l.classList.remove('active');
      if (l.getAttribute('data-page') === page) {
        l.classList.add('active');
      }
    });

    // Update page title
    const titles = {
      dashboard: 'Dashboard',
      interestForms: 'Interest Forms',
      customerPortal: 'Customer Portal',
      proposals: 'Proposals',
      jobs: 'Jobs (WIP)',
      completed: 'Completed Projects',
      payments: 'Payments',
      permits: 'Permits',
      scheduling: 'Scheduling',
      changeOrders: 'Change Orders',
      crewDispatch: 'Crew Dispatch',
      workClosure: 'Work Closure',
      maintenanceGuide: 'Maintenance Guide',
      notifications: 'Notifications Center',
      inventory: 'Inventory',
      sales: 'Sales Team',
      settings: 'Settings',
    };

    document.getElementById('page-title').textContent = titles[page] || 'Dashboard';

    // Render page content
    this.currentPage = page;
    this.renderPage(page);
  },

  renderPage(page) {
    const content = document.getElementById('dashboard-content');

    switch (page) {
      case 'dashboard':
        Dashboard.render();
        break;
      case 'interestForms':
        content.innerHTML = InterestForms.render();
        break;
      case 'customerPortal':
        content.innerHTML = CustomerPortal.render();
        break;
      case 'proposals':
        content.innerHTML = Proposals.render();
        break;
      case 'jobs':
        content.innerHTML = Jobs.render();
        break;
      case 'completed':
        content.innerHTML = Completed.render();
        break;
      case 'payments':
        content.innerHTML = Payments.render();
        break;
      case 'permits':
        content.innerHTML = Permits.render();
        break;
      case 'scheduling':
        content.innerHTML = Scheduling.render();
        break;
      case 'change-orders':
        content.innerHTML = ChangeOrders.render();
        break;
      case 'crew-dispatch':
        content.innerHTML = CrewDispatch.render();
        break;
      case 'work-closure':
        content.innerHTML = WorkClosure.render();
        break;
      case 'maintenance-guide':
        content.innerHTML = MaintenanceGuide.render();
        break;
      case 'notifications':
        content.innerHTML = Notifications.render();
        break;
      case 'inventory':
        content.innerHTML = Inventory.render();
        break;
      case 'sales':
        content.innerHTML = Sales.render();
        break;
      case 'settings':
        content.innerHTML = Settings.render();
        break;
      default:
        Dashboard.render();
    }
  },

  setupModals() {
    const overlay = document.getElementById('modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close');

    closeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach((m) => m.classList.remove('open'));
        overlay.classList.remove('open');
      });
    });

    overlay.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach((m) => m.classList.remove('open'));
      overlay.classList.remove('open');
    });
  },

  setupInterestForm() {
    const form = document.getElementById('interest-form');
    const cancelBtn = document.getElementById('cancel-interest');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newForm = {
          id: 'IF-' + (1000 + AppData.interestForms.length + 1),
          customerName: formData.get('customerName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          workType: formData.get('workType'),
          description: formData.get('description'),
          status: 'new',
          submittedAt: new Date().toISOString(),
          assignedSalesPerson: AppData.salesTeam[0].id, // Auto-assign first sales person
        };

        AppData.interestForms.push(newForm);
        form.reset();
        App.renderPage('interestForms');
        alert('Interest form submitted successfully!');
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        document.getElementById('interest-form').reset();
      });
    }
  },

  setupCustomerPortalForm() {
    const form = document.getElementById('customer-interest-form');
    const cancelBtn = document.getElementById('cancel-customer-form');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const newForm = {
          id: 'IF-' + (1000 + AppData.interestForms.length + 1),
          customerName: 'Website Customer',
          phone: formData.get('phone'),
          zipCode: formData.get('zipCode'),
          workType: formData.get('workType'),
          description: `Customer requested ${formData.get('workType')} work via website interest form`,
          status: 'new',
          submittedAt: new Date().toISOString(),
          assignedSalesPerson: AppData.salesTeam[0].id,
          source: 'website',
        };

        AppData.interestForms.push(newForm);
        form.reset();

        alert(`Thank you! Your interest form has been submitted.\n\nWork Type: ${formData.get('workType')}\nPhone: ${formData.get('phone')}\nZip Code: ${formData.get('zipCode')}\n\nOur sales team will call you back shortly.`);

        App.renderPage('interestForms');
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        document.getElementById('customer-interest-form').reset();
      });
    }
  },

  setupAddProjectForm() {
    const btn = document.getElementById('btn-add-project');
    const modal = document.getElementById('add-project-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-add-project');
    const form = document.getElementById('add-project-form');
    const salesSelect = document.querySelector('select[name="salesPerson"]');

    // Populate sales person dropdown
    AppData.salesTeam.forEach((person) => {
      const option = document.createElement('option');
      option.value = person.id;
      option.textContent = person.name;
      salesSelect.appendChild(option);
    });

    btn.addEventListener('click', () => {
      modal.classList.add('open');
      overlay.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      overlay.classList.remove('open');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const newProject = {
        id: 'PJ-' + (1000 + AppData.projects.length + 1),
        customerName: formData.get('customerName'),
        workType: formData.get('workType'),
        jobValue: parseFloat(formData.get('jobValue')),
        depositPaid: 0,
        remainingBalance: parseFloat(formData.get('jobValue')),
        paymentStatus: 'unpaid',
        status: 'wip',
        scheduledDate: formData.get('scheduledDate'),
        completionDate: null,
        salesPerson: formData.get('salesPerson'),
        changeOrderSalesPerson: null,
        commissionSplit: null,
        permitReceived: false,
        permitAlert: false,
        inspectionStatus: 'pending',
        onTime: true,
        proposalLink: `https://app.abcconstructions.com/proposal/PJ-${1000 + AppData.projects.length + 1}`,
        customerApproved: false,
        approvedAt: null,
        createdAt: new Date().toISOString(),
      };

      AppData.projects.push(newProject);
      modal.classList.remove('open');
      overlay.classList.remove('open');
      form.reset();
      Dashboard.render();
      alert('Project created successfully!');
    });
  },

  setupPermitForm() {
    const form = document.getElementById('permit-form');
    const cancelBtn = document.getElementById('cancel-permit');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const projectId = formData.get('projectId');
        const project = AppData.projects.find((p) => p.id === projectId);

        if (!project) return;

        const newPermit = {
          id: 'PER-' + (200 + AppData.permits.length + 1),
          projectId: project.id,
          customerName: project.customerName,
          workType: project.workType,
          status: 'pending',
          receivedAt: null,
          portal: formData.get('portal') || 'State Office Portal',
          alertSent: false,
        };

        AppData.permits.push(newPermit);
        form.reset();
        App.renderPage('permits');
        alert(`Permit request created for ${project.customerName}!\nPermit ID: ${newPermit.id}\nStatus: Pending`);
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        document.getElementById('permit-form').reset();
      });
    }
  },

  setupScheduleForm() {
    const form = document.getElementById('schedule-form');
    const cancelBtn = document.getElementById('cancel-schedule');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const projectId = formData.get('projectId');
        const scheduledDate = formData.get('scheduledDate');
        const crew = formData.get('crew');

        const project = AppData.projects.find((p) => p.id === projectId);
        if (!project) return;

        project.scheduledDate = scheduledDate;
        project.crewAssignment = crew;
        project.scheduleNotificationSent = false;

        form.reset();
        App.renderPage('scheduling');
        alert(`Job scheduled!\n\nProject: ${project.id}\nCustomer: ${project.customerName}\nDate: ${scheduledDate}\nCrew: ${crew || 'Not assigned'}`);
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        document.getElementById('schedule-form').reset();
      });
    }
  },

  setupChangeOrderForm() {
    const form = document.getElementById('change-order-form');
    const cancelBtn = document.getElementById('cancel-change-order');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const changeOrder = ChangeOrders.createChangeOrder(formData);

        if (changeOrder) {
          form.reset();
          App.renderPage('change-orders');
          alert(`Change Order created!\n\nCO ID: ${changeOrder.id}\nProject: ${changeOrder.projectId}\nAdditional Value: $${changeOrder.additionalValue.toLocaleString()}\nStatus: Pending\n\nCommission Split:\n${Object.entries(changeOrder.commissionSplit).map(([id, pct]) => `  ${AppData.getSalesPersonName(id)}: ${pct}%`).join('\n')}`);
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        document.getElementById('change-order-form').reset();
      });
    }
  },

  setupMaintenanceGuideForm() {
    const form = document.getElementById('maintenance-guide-form');
    const cancelBtn = document.getElementById('cancel-maintenance-guide');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const guide = MaintenanceGuide.generateGuide(formData);

        if (guide) {
          form.reset();
          App.renderPage('maintenance-guide');
          alert(`Maintenance Guide generated!\n\nGuide ID: ${guide.id}\nProject: ${guide.projectId}\nCustomer: ${guide.customerName}\nWork Type: ${guide.workType}\n\nThe guide has been generated and is ready to be sent with the final invoice.`);
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        document.getElementById('maintenance-guide-form').reset();
      });
    }
  },

  setupTestNotificationForm() {
    const form = document.getElementById('test-notification-form');
    const cancelBtn = document.getElementById('cancel-test-notification');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        Notifications.sendTestNotification(formData);
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        document.getElementById('test-notification-form').reset();
      });
    }
  },

  setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      toggleBtn.textContent = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        toggleBtn.textContent = '🌙';
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggleBtn.textContent = '☀️';
      }
    });
  },
};
