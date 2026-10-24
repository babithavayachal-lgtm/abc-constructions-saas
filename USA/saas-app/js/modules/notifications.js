/* =========================================
   ABC Constructions — Notifications Module (Phase 5)
   View all WhatsApp/email/SMS notifications sent
   ========================================= */

const Notifications = {
  render() {
    const notifications = AppData.notifications || [];

    // Group by type for stats
    const stats = {
      total: notifications.length,
      proposalCreated: notifications.filter(n => n.type === 'proposal_created').length,
      proposalApproved: notifications.filter(n => n.type === 'proposal_approved').length,
      proposalDenied: notifications.filter(n => n.type === 'proposal_denied').length,
      paymentReceived: notifications.filter(n => n.type === 'payment_received').length,
      permitReceived: notifications.filter(n => n.type === 'permit_received').length,
      scheduleNotice: notifications.filter(n => n.type === 'schedule_notice').length,
      changeOrder: notifications.filter(n => n.type === 'change_order_approved').length,
      workClosure: notifications.filter(n => n.type === 'work_closure').length,
      finalPayment: notifications.filter(n => n.type === 'final_payment').length,
    };

    return `
      <div class="page-header">
        <h1 class="page-title">Notifications Center</h1>
        <p class="page-subtitle">All WhatsApp, email, and SMS notifications sent to customers and team</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Notifications</div>
          <div class="stat-value">${stats.total}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Proposal Created</div>
          <div class="stat-value">${stats.proposalCreated}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Approvals</div>
          <div class="stat-value">${stats.proposalApproved}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Payments</div>
          <div class="stat-value">${stats.paymentReceived}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Permits</div>
          <div class="stat-value">${stats.permitReceived}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Schedule Notices</div>
          <div class="stat-value">${stats.scheduleNotice}</div>
        </div>
      </div>

      <!-- Notification Channels -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Notification Channels</h2>
        </div>
        <div class="grid-3">
          <div class="stat-card">
            <div class="stat-label">WhatsApp</div>
            <div class="stat-value">Enabled</div>
            <div class="stat-change positive">Instant delivery</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Email</div>
            <div class="stat-value">Enabled</div>
            <div class="stat-change positive">HTML templates</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">SMS</div>
            <div class="stat-value">Enabled</div>
            <div class="stat-change positive">Text messages</div>
          </div>
        </div>
      </div>

      <!-- Notification Log -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Notification Log</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Project</th>
                <th>Message</th>
                <th>Channels</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${notifications.slice().reverse().map((n) => {
    const time = new Date(n.sentAt).toLocaleString();
    const typeLabel = n.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    return `
                  <tr>
                    <td>${time}</td>
                    <td><span class="badge badge-info">${typeLabel}</span></td>
                    <td>${n.customerName}</td>
                    <td>${n.projectId}</td>
                    <td style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${n.message}">${n.message}</td>
                    <td>${n.channels.join(', ')}</td>
                    <td><span class="badge badge-approved">${n.status}</span></td>
                  </tr>
                `;
  }).join('') || `
                <tr>
                  <td colspan="7" class="empty-state" style="padding: 1rem;">
                    No notifications sent yet. Notifications are created when proposals, payments, permits, schedules, change orders, and work closures occur.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Send Test Notification -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Send Test Notification</h2>
        </div>
        <div class="table-container" style="padding: 1.5rem;">
          <form id="test-notification-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div class="form-group">
              <label>Customer Name</label>
              <input type="text" name="customerName" placeholder="e.g. Robert Martinez" required>
            </div>
            <div class="form-group">
              <label>Project ID</label>
              <input type="text" name="projectId" placeholder="e.g. PJ-1001" required>
            </div>
            <div class="form-group">
              <label>Message</label>
              <input type="text" name="message" placeholder="Test notification message" required>
            </div>
            <div class="form-group" style="grid-column: 1 / -1; display: flex; gap: 0.5rem;">
              <button type="submit" class="btn btn-primary">Send Test Notification</button>
              <button type="button" class="btn btn-secondary" id="cancel-test-notification">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  sendTestNotification(formData) {
    const notification = {
      id: 'NOT-' + Date.now(),
      projectId: formData.get('projectId'),
      customerName: formData.get('customerName'),
      type: 'test',
      message: formData.get('message'),
      channels: ['whatsapp', 'email', 'sms'],
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!AppData.notifications) AppData.notifications = [];
    AppData.notifications.push(notification);

    alert(`✅ Test notification sent!\n\nCustomer: ${notification.customerName}\nProject: ${notification.projectId}\nMessage: ${notification.message}\nChannels: WhatsApp, Email, SMS`);

    App.renderPage('notifications');
  },
};
