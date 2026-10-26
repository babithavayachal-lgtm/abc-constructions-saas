/* =========================================
   ABC Constructions — App Module
   Core application initialization and utilities
   ========================================= */

const App = {
  currentPage: 'dashboard',
  session: {
    isSignedIn: false,
    staffId: null,
    staffName: null,
    systemRole: 'Staff',
  },

  init() {
    this.setupNavigation();
    this.setupModals();
    this.setupAuth();
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
    this.updateAuthUI();
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
      'interest-forms': 'Interest Forms',
      'customer-portal': 'Customer Portal',
      proposals: 'Proposals',
      jobs: 'Jobs (WIP)',
      completed: 'Completed Projects',
      payments: 'Payments',
      permits: 'Permits',
      scheduling: 'Scheduling',
      'change-orders': 'Change Orders',
      'crew-dispatch': 'Crew Dispatch',
      'work-closure': 'Work Closure',
      'maintenance-guide': 'Maintenance Guide',
      notifications: 'Notifications Center',
      staff: 'Staff Management',
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
      case 'interest-forms':
        content.innerHTML = InterestForms.render();
        break;
      case 'customer-portal':
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
      case 'staff':
        content.innerHTML = Staff.render();
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
        AppData.save();
        FirestoreSync.saveCollection('interestForms');
        App.renderPage('interest-forms');
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
    // Use event delegation so the listener works even after the form is
    // dynamically injected into the DOM by CustomerPortal.render().
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('#customer-interest-form');
      if (!form) return;

      e.preventDefault();
      const formData = new FormData(form);

      const timeline = formData.get('timeline');
      const priority = timeline === '1-2 weeks' ? 'high' : timeline === '2-3 months' || timeline === 'flexible' ? 'low' : 'medium';

      const newForm = {
        id: 'IF-' + (1000 + AppData.interestForms.length + 1),
        customerName: formData.get('customerName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        propertyType: formData.get('propertyType'),
        workType: formData.get('workType'),
        description: formData.get('description'),
        timeline: formData.get('timeline'),
        budget: formData.get('budget'),
        status: 'new',
        priority: priority,
        submittedAt: new Date().toISOString(),
        assignedSalesPerson: AppData.salesTeam[0].id,
        adminNotes: '',
        source: 'website',
      };

      AppData.interestForms.push(newForm);
      AppData.save();
      FirestoreSync.saveCollection('interestForms');
      form.reset();

      alert(`Thank you, ${formData.get('customerName')}!

Your interest request has been submitted.

Work Type: ${formData.get('workType')}
Phone: ${formData.get('phone')}
Address: ${formData.get('address')}

Our sales team will call you back shortly.`);

      // Re-render dashboard to reflect new request count
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
      if (App.currentPage === 'interest-forms') App.renderPage('interest-forms');

      // Navigate to interest forms so the new submission is visible
      App.navigateTo('interest-forms');
    });

    document.addEventListener('click', (e) => {
      const cancelBtn = e.target.closest('#cancel-customer-form');
      if (!cancelBtn) return;

      const form = document.getElementById('customer-interest-form');
      if (form) form.reset();
    });
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
        status: 'pending_payment',
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
      AppData.save();
      FirestoreSync.saveCollection('projects');
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

  setupAuth() {
    const loginBtn = document.getElementById('btn-login');
    const logoffBtn = document.getElementById('btn-logoff');
    const roleSelect = document.getElementById('user-role-select');
    const roleSelector = document.getElementById('role-selector');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');

    loginBtn.addEventListener('click', () => {
      const role = roleSelect.value;
      const staff = AppData.staff.find((s) => s.systemRole === role);
      this.session.isSignedIn = true;
      this.session.staffId = staff ? staff.id : null;
      this.session.staffName = staff ? staff.name : role + ' User';
      this.session.systemRole = role;

      try {
        localStorage.setItem('abc_session', JSON.stringify(this.session));
      } catch (e) { /* storage unavailable */ }

      this.updateAuthUI();
      alert(`Signed in as ${this.session.staffName} (${role})`);
    });

    logoffBtn.addEventListener('click', () => {
      this.session.isSignedIn = false;
      this.session.staffId = null;
      this.session.staffName = null;
      this.session.systemRole = 'Staff';
      try {
        localStorage.removeItem('abc_session');
      } catch (e) { /* storage unavailable */ }
      this.updateAuthUI();
      alert('Signed off successfully.');
    });

    // Login screen button handler
    const loginScreenBtn = document.getElementById('btn-login-screen');
    const loginRoleSelect = document.getElementById('login-role-select');
    if (loginScreenBtn) {
      loginScreenBtn.addEventListener('click', () => {
        const role = loginRoleSelect.value;
        if (!role) {
          alert('Please select a role.');
          return;
        }
        const staff = AppData.staff.find((s) => s.systemRole === role);
        this.session.isSignedIn = true;
        this.session.staffId = staff ? staff.id : null;
        this.session.staffName = staff ? staff.name : role + ' User';
        this.session.systemRole = role;

        try {
          localStorage.setItem('abc_session', JSON.stringify(this.session));
        } catch (e) { /* storage unavailable */ }

        this.updateAuthUI();
        alert('Signed in as ' + this.session.staffName + ' (' + role + ')');
      });
    }

    // Restore session from localStorage if present
    try {
      const saved = localStorage.getItem('abc_session');
      if (saved) {
        this.session = JSON.parse(saved);
      }
    } catch (e) { /* ignore */ }
  },

  updateAuthUI() {
    const loginScreen = document.getElementById('login-screen');
    const loginBtn = document.getElementById('btn-login');
    const logoffBtn = document.getElementById('btn-logoff');
    const roleSelector = document.getElementById('role-selector');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    const mainApp = document.querySelector('.sidebar, .main-content');

    if (this.session.isSignedIn) {
      if (loginScreen) loginScreen.style.display = 'none';
      if (mainApp) mainApp.style.display = '';
      loginBtn.style.display = 'none';
      logoffBtn.style.display = 'inline-block';
      roleSelector.style.display = 'block';
      userName.textContent = this.session.staffName || 'User';
      userAvatar.textContent = (this.session.staffName || 'U').charAt(0).toUpperCase();
    } else {
      if (loginScreen) loginScreen.style.display = 'flex';
      if (mainApp) mainApp.style.display = 'none';
      loginBtn.style.display = 'none';
      logoffBtn.style.display = 'none';
      roleSelector.style.display = 'none';
      userName.textContent = 'Not Signed In';
      userAvatar.textContent = 'A';
    }
  },

  isAdmin() {
    return this.session.isSignedIn && this.session.systemRole === 'Admin';
  },

  isManagerOrAdmin() {
    return this.session.isSignedIn && (this.session.systemRole === 'Admin' || this.session.systemRole === 'Manager');
  },

  setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // The inline script in index.html has already applied the theme class before
    // first paint; read it back so the two can never disagree.
    const isNight = () =>
      html.classList.contains('theme-night') || html.getAttribute('data-theme') === 'dark';

    const applyTheme = (theme) => {
      html.classList.remove('theme-day', 'theme-night');
      html.classList.add('theme-' + theme);
      // Keep the legacy attribute in sync so a stale cached stylesheet (or a
      // stale cached script) still resolves the correct theme.
      html.setAttribute('data-theme', theme === 'night' ? 'dark' : 'light');
      try {
        localStorage.setItem('konark_theme', theme);
        localStorage.setItem('theme', theme === 'night' ? 'dark' : 'light');
      } catch (e) { /* storage unavailable — theme still applies for this session */ }

      const icon = toggleBtn.querySelector('.theme-toggle-icon');
      const label = toggleBtn.querySelector('.theme-toggle-label');

      if (theme === 'night') {
        toggleBtn.title = 'Switch to Day Mode (Light)';
        toggleBtn.setAttribute('aria-label', 'Switch to Day Mode');
        if (icon) icon.textContent = '☀️';
        if (label) label.textContent = 'Day';
      } else {
        toggleBtn.title = 'Switch to Night Mode (Dark)';
        toggleBtn.setAttribute('aria-label', 'Switch to Night Mode');
        if (icon) icon.textContent = '🌙';
        if (label) label.textContent = 'Night';
      }
    };

    applyTheme(isNight() ? 'night' : 'day');

    toggleBtn.addEventListener('click', () => {
      applyTheme(isNight() ? 'day' : 'night');
    });
  },
};
