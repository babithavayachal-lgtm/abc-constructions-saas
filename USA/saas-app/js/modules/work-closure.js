/* =========================================
   ABC Constructions — Work Closure & Final Payment Module (Phase 4)
   Work closure email, invoice for remaining 50%,
   final payment via same software
   ========================================= */

const WorkClosure = {
  render() {
    const completedProjects = AppData.getProjectsByStatus('completed');
    const pendingFinalPayment = completedProjects.filter(p => p.paymentStatus !== 'paid');

    return `
      <div class="page-header">
        <h1 class="page-title">Work Closure & Final Payment</h1>
        <p class="page-subtitle">Work closure emails, invoices for remaining balance, and final payment collection</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Completed Jobs</div>
          <div class="stat-value">${completedProjects.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Final Payment Pending</div>
          <div class="stat-value">${pendingFinalPayment.length}</div>
          <div class="stat-change warning">Remaining balance to collect</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Final Payment Collected</div>
          <div class="stat-value">${completedProjects.filter(p => p.paymentStatus === 'paid').length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Final Balances</div>
          <div class="stat-value">$${pendingFinalPayment.reduce((s, p) => s + p.remainingBalance, 0).toLocaleString()}</div>
        </div>
      </div>

      <!-- Completed Jobs Pending Final Payment -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Jobs Awaiting Final Payment</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Customer</th>
                <th>Job Value</th>
                <th>Deposit Paid</th>
                <th>Remaining Balance</th>
                <th>Completion Date</th>
                <th>Maintenance Guide</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${pendingFinalPayment.map((p) => {
    const maintenanceGuide = p.maintenanceGuideSent || false;
    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td>$${p.jobValue.toLocaleString()}</td>
                    <td>$${p.depositPaid.toLocaleString()}</td>
                    <td>$${p.remainingBalance.toLocaleString()}</td>
                    <td>${p.completionDate}</td>
                    <td><span class="badge ${maintenanceGuide ? 'badge-approved' : 'badge-pending'}">${maintenanceGuide ? 'Sent' : 'Pending'}</span></td>
                    <td>
                      <button class="btn btn-sm btn-success" onclick="WorkClosure.generateInvoice('${p.id}')">Generate Invoice</button>
                    </td>
                  </tr>
                `;
  }).join('') || `
                <tr>
                  <td colspan="8" class="empty-state" style="padding: 1rem;">
                    No jobs awaiting final payment.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- All Completed Jobs -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">All Completed Jobs</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Job Value</th>
                <th>Final Payment</th>
                <th>Payment Status</th>
                <th>Closure Email</th>
                <th>Completion Date</th>
              </tr>
            </thead>
            <tbody>
              ${completedProjects.map((p) => {
    const paymentBadge = p.paymentStatus === 'paid' ? 'badge-paid' : p.paymentStatus === 'partial' ? 'badge-partial' : 'badge-unpaid';
    const closureSent = p.closureEmailSent || false;
    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td>${p.workType}</td>
                    <td>$${p.jobValue.toLocaleString()}</td>
                    <td>$${p.remainingBalance.toLocaleString()}</td>
                    <td><span class="badge ${paymentBadge}">${p.paymentStatus}</span></td>
                    <td><span class="badge ${closureSent ? 'badge-approved' : 'badge-pending'}">${closureSent ? 'Sent' : 'Pending'}</span></td>
                    <td>${p.completionDate}</td>
                  </tr>
                `;
  }).join('') || `
                <tr>
                  <td colspan="8" class="empty-state" style="padding: 1rem;">
                    No completed jobs yet.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Work Closure Process -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Work Closure Process</h2>
        </div>
        <div class="grid-3">
          <div class="stat-card">
            <div class="stat-label">Step 1</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
              County inspection passes → Crew covers drainage → Job marked complete
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Step 2</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
              Work closure email sent to customer with invoice for remaining 50% balance
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Step 3</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
            Maintenance Guide PDF ("what to expect") sent with invoice
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Generate invoice for remaining balance
  generateInvoice(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const remainingBalance = project.remainingBalance;

    if (confirm(`Generate final invoice for ${project.customerName}?\n\nProject: ${project.id}\nRemaining Balance: $${remainingBalance.toLocaleString()}\n\nThis will send a work closure email with invoice and Maintenance Guide PDF.`)) {
      // Mark closure email as sent
      project.closureEmailSent = true;
      project.closureEmailSentAt = new Date().toISOString();
      project.maintenanceGuideSent = true;
      project.maintenanceGuideSentAt = new Date().toISOString();

      // Generate invoice details
      const invoice = {
        id: 'INV-' + project.id,
        projectId: project.id,
        customerName: project.customerName,
        email: project.email,
        jobValue: project.jobValue,
        depositPaid: project.depositPaid,
        remainingBalance: project.remainingBalance,
        totalDue: project.remainingBalance,
        issueDate: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString(), // 7 days
        status: 'pending',
      };

      if (!AppData.invoices) AppData.invoices = [];
      AppData.invoices.push(invoice);

      // Send notification
      this.notifyWorkClosure(project, invoice);

      alert(`✅ Invoice generated!\n\nInvoice: ${invoice.id}\nAmount Due: $${remainingBalance.toLocaleString()}\nDue Date: ${invoice.dueDate}\n\nWork closure email + Maintenance Guide PDF sent to ${project.customerName}.`);

      App.renderPage('work-closure');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
      if (App.currentPage === 'completed') App.renderPage('completed');
      if (App.currentPage === 'payments') App.renderPage('payments');
    }
  },

  // Collect final payment
  collectFinalPayment(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const remainingBalance = project.remainingBalance;

    if (confirm(`Collect final payment of $${remainingBalance.toLocaleString()} from ${project.customerName}?`)) {
      project.paymentStatus = 'paid';
      project.depositPaid = project.jobValue;
      project.remainingBalance = 0;
      project.finalPaymentDate = new Date().toISOString();

      // Send payment notification
      this.notifyFinalPayment(project, remainingBalance);

      alert(`✅ Final payment collected!\n\nProject: ${project.id}\nAmount: $${remainingBalance.toLocaleString()}\nPayment Status: Paid\n\nJob is fully paid and closed.`);

      App.renderPage('work-closure');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
      if (App.currentPage === 'payments') App.renderPage('payments');
    }
  },

  notifyWorkClosure(project, invoice) {
    const notification = {
      id: 'NOT-' + Date.now(),
      projectId: project.id,
      customerName: project.customerName,
      type: 'work_closure',
      message: `✅ Work completed for ${project.customerName} (${project.id}). Work closure email sent with invoice for remaining balance of $${project.remainingBalance.toLocaleString()}. Maintenance Guide PDF ("what to expect") included.`,
      invoiceId: invoice ? invoice.id : null,
      link: project.proposalLink,
      channels: ['whatsapp', 'email', 'sms'],
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!AppData.notifications) AppData.notifications = [];
    AppData.notifications.push(notification);

    console.log('[Notification - Work Closure]', notification);
  },

  notifyFinalPayment(project, amount) {
    const notification = {
      id: 'NOT-' + Date.now(),
      projectId: project.id,
      customerName: project.customerName,
      type: 'final_payment',
      message: `💰 Final payment received: ${project.customerName} paid $${amount.toLocaleString()} for project ${project.id}. Job is fully paid and closed.`,
      link: project.proposalLink,
      channels: ['whatsapp', 'email', 'sms'],
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!AppData.notifications) AppData.notifications = [];
    AppData.notifications.push(notification);

    console.log('[Notification - Final Payment]', notification);
  },
};
