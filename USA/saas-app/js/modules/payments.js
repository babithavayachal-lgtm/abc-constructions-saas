/* =========================================
   ABC Constructions — Payments Module (Phase 3)
   50% deposit, remaining balance, Stripe integration,
   payment status tracking, payment links
   ========================================= */

const Payments = {
  render() {
    const projects = AppData.projects;

    const totalCollected = AppData.projects.reduce((s, p) => s + p.depositPaid, 0);
    const pendingBalances = AppData.projects.reduce((s, p) => s + p.remainingBalance, 0);
    const fullyPaid = AppData.projects.filter(p => p.paymentStatus === 'paid').length;
    const partiallyPaid = AppData.projects.filter(p => p.paymentStatus === 'partial').length;
    const unpaid = AppData.projects.filter(p => p.paymentStatus === 'unpaid').length;

    return `
      <div class="page-header">
        <h1 class="page-title">Payments</h1>
        <p class="page-subtitle">Track 50% deposits, remaining balances, and payment status across all projects</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Collected</div>
          <div class="stat-value">$${totalCollected.toLocaleString()}</div>
          <div class="stat-change positive">Deposits & final payments</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending Balances</div>
          <div class="stat-value">$${pendingBalances.toLocaleString()}</div>
          <div class="stat-change warning">Remaining to collect</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Fully Paid</div>
          <div class="stat-value">${fullyPaid}</div>
          <div class="stat-change positive">Payment complete</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Partially Paid</div>
          <div class="stat-value">${partiallyPaid}</div>
          <div class="stat-change neutral">50% deposit received</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Unpaid</div>
          <div class="stat-value">${unpaid}</div>
          <div class="stat-change negative">Awaiting payment</div>
        </div>
      </div>

      <!-- Payment Table -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Project Payments</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Customer</th>
                <th>Job Value</th>
                <th>50% Deposit</th>
                <th>Remaining Balance</th>
                <th>Payment Status</th>
                <th>Payment Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${projects.map((p) => {
    const deposit = (p.jobValue * 0.5).toFixed(2);
    const badgeClass = p.paymentStatus === 'paid' ? 'badge-paid' : p.paymentStatus === 'partial' ? 'badge-partial' : 'badge-unpaid';
    const showPayButton = p.customerApproved && !p.customerDenied && p.paymentStatus !== 'paid';
    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td>$${p.jobValue.toLocaleString()}</td>
                    <td>$${deposit}</td>
                    <td>$${p.remainingBalance.toLocaleString()}</td>
                    <td><span class="badge ${badgeClass}">${p.paymentStatus}</span></td>
                    <td>
                      <div style="display:flex; align-items:center; gap:0.5rem;">
                        <input type="text" value="${p.proposalLink}" readonly style="flex:1; padding:0.25rem; font-size:0.75rem; border:1px solid var(--border); border-radius:4px;">
                        <button class="btn btn-sm btn-secondary" onclick="copyLink('${p.proposalLink}')" title="Copy link">Copy</button>
                      </div>
                    </td>
                    <td>
                      ${showPayButton
                        ? `<button class="btn btn-sm btn-success" onclick="Payments.openPaymentModal('${p.id}')">Collect Payment</button>`
                        : `<span class="badge badge-${p.paymentStatus === 'paid' ? 'approved' : 'denied'}">${p.paymentStatus === 'paid' ? 'Paid' : 'N/A'}</span>`
                      }
                    </td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Stripe Payment API Configuration -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Payment API Configuration (Stripe)</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Setting</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Payment Gateway</strong></td>
                <td>Stripe</td>
                <td><span class="badge badge-pending">Sandbox Mode</span></td>
              </tr>
              <tr>
                <td><strong>Publishable Key</strong></td>
                <td>pk_test_************</td>
                <td><span class="badge badge-approved">Configured</span></td>
              </tr>
              <tr>
                <td><strong>Secret Key</strong></td>
                <td>sk_test_************</td>
                <td><span class="badge badge-approved">Configured</span></td>
              </tr>
              <tr>
                <td><strong>Webhook Endpoint</strong></td>
                <td>/api/webhooks/stripe</td>
                <td><span class="badge badge-pending">Pending</span></td>
              </tr>
              <tr>
                <td><strong>50% Deposit Link</strong></td>
                <td>Auto-generated per project</td>
                <td><span class="badge badge-approved">Active</span></td>
              </tr>
              <tr>
                <td><strong>Final Payment Link</strong></td>
                <td>Generated on work closure</td>
                <td><span class="badge badge-pending">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Payments -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Recent Payment Activity</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${this.getRecentPayments().map((pay) => `
                <tr>
                  <td>${pay.date}</td>
                  <td><strong>${pay.projectId}</strong></td>
                  <td>${pay.customer}</td>
                  <td>$${pay.amount.toLocaleString()}</td>
                  <td>${pay.type}</td>
                  <td><span class="badge badge-approved">Completed</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getRecentPayments() {
    const payments = [];
    AppData.projects.forEach((p) => {
      if (p.depositPaid > 0) {
        payments.push({
          date: p.approvedAt ? new Date(p.approvedAt).toLocaleDateString() : '—',
          projectId: p.id,
          customer: p.customerName,
          amount: p.depositPaid,
          type: '50% Deposit',
        });
      }
      if (p.paymentStatus === 'paid' && p.remainingBalance === 0) {
        payments.push({
          date: p.completionDate || '—',
          projectId: p.id,
          customer: p.customerName,
          amount: p.remainingBalance,
          type: 'Final Payment',
        });
      }
    });
    return payments.slice(0, 10);
  },

  // Open Stripe payment modal for 50% deposit
  openPaymentModal(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const deposit = (project.jobValue * 0.5).toFixed(2);

    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = `
      <div class="modal-overlay" style="display: flex; justify-content: center; align-items: center; padding: 1rem;">
        <div class="modal" style="display: block; max-width: 500px;">
          <div class="modal-header">
            <h3>Stripe Payment — ${project.id}</h3>
            <button class="modal-close" onclick="this.closest('.modal-overlay').style.display='none'">&times;</button>
          </div>
          <div class="modal-body" style="padding: 1.5rem;">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <div style="font-size: 0.875rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">50% Deposit Payment</div>
              <div style="font-size: 2rem; font-weight: 700; color: var(--text-primary); margin: 0.5rem 0;">$${deposit}</div>
              <div style="font-size: 0.875rem; color: var(--text-secondary);">For ${project.customerName}</div>
              <div style="font-size: 0.875rem; color: var(--text-secondary);">${project.workType} work</div>
            </div>

            <div style="background: var(--bg-body); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; margin-bottom: 1.5rem; color: var(--text-primary);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Job Value:</span>
                <span>$${project.jobValue.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>50% Deposit:</span>
                <span><strong>$${deposit}</strong></span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Remaining Balance:</span>
                <span>$${project.remainingBalance.toLocaleString()}</span>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <button onclick="Payments.processStripePayment('${project.id}', 'deposit')" class="btn btn-primary" style="flex:1;">
                💳 Pay with Stripe
              </button>
              <button onclick="Payments.simulatePayment('${project.id}', 'deposit')" class="btn btn-secondary" style="flex:1;">
                Simulate Payment
              </button>
            </div>

            <p style="margin-top: 1rem; font-size: 0.8125rem; color: var(--text-muted);">
              Powered by Stripe. Secure payment processing.
            </p>
          </div>
        </div>
      </div>
    `;
    overlay.style.display = 'flex';
  },

  // Simulate Stripe payment processing
  processStripePayment(projectId, type) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const deposit = (project.jobValue * 0.5).toFixed(2);

    // Simulate Stripe redirect
    if (confirm(`Redirect to Stripe Checkout for $${deposit}?\n\nThis would open Stripe's secure payment page in production.`)) {
      // In production, this would redirect to Stripe Checkout
      alert(`Stripe Checkout would open for $${deposit}\n\nProject: ${project.id}\nCustomer: ${project.customerName}\n\nAfter successful payment, the status would update to 'partial' (deposit received).`);
    }
  },

  // Simulate payment (for demo purposes)
  simulatePayment(projectId, type) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const deposit = (project.jobValue * 0.5).toFixed(2);

    if (type === 'deposit') {
      project.depositPaid = parseFloat(deposit);
      project.remainingBalance = project.jobValue - project.depositPaid;
      project.paymentStatus = 'partial';

      // Send payment notification
      this.notifyPaymentReceived(project, deposit, '50% Deposit');
    } else if (type === 'final') {
      project.depositPaid = project.jobValue;
      project.remainingBalance = 0;
      project.paymentStatus = 'paid';

      // Send payment notification
      this.notifyPaymentReceived(project, project.remainingBalance, 'Final Payment');
    }

    document.querySelector('.modal-overlay').style.display = 'none';
    alert(`✅ Payment of $${deposit} simulated successfully!\n\nProject: ${project.id}\nStatus: ${project.paymentStatus}\nRemaining Balance: $${project.remainingBalance.toLocaleString()}`);

    App.renderPage('payments');
    if (App.currentPage === 'dashboard') App.renderPage('dashboard');
    if (App.currentPage === 'jobs') App.renderPage('jobs');
  },

  notifyPaymentReceived(project, amount, type) {
    const notification = {
      id: 'NOT-' + Date.now(),
      projectId: project.id,
      customerName: project.customerName,
      type: 'payment_received',
      message: `💰 Payment received: ${project.customerName} paid $${amount.toLocaleString()} (${type}) for project ${project.id}.`,
      link: project.proposalLink,
      channels: ['whatsapp', 'email', 'sms'],
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!AppData.notifications) AppData.notifications = [];
    AppData.notifications.push(notification);

    console.log('[Notification - Payment]', notification);
  },
};

function copyLink(link) {
  navigator.clipboard.writeText(link);
  alert('Link copied to clipboard!');
}
