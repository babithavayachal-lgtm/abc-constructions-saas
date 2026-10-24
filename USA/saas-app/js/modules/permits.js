/* =========================================
   ABC Constructions — Permits Module (Phase 3)
   State portal permit requests, Jolley utility marking,
   permit alerts and notifications
   ========================================= */

const Permits = {
  render() {
    const permits = AppData.permits;

    const receivedCount = permits.filter(p => p.status === 'received').length;
    const pendingCount = permits.filter(p => p.status === 'pending').length;

    return `
      <div class="page-header">
        <h1 class="page-title">Permits</h1>
        <p class="page-subtitle">State portal permit requests for drainage work and utility marking tickets</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Permits</div>
          <div class="stat-value">${permits.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Received</div>
          <div class="stat-value">${receivedCount}</div>
          <div class="stat-change positive">Approved by state</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending</div>
          <div class="stat-value">${pendingCount}</div>
          <div class="stat-change warning">Awaiting state approval</div>
        </div>
      </div>

      <!-- Permit Requests -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">State Portal Permit Requests</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Permit ID</th>
                <th>Project</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Status</th>
                <th>Portal</th>
                <th>Received At</th>
                <th>Alert Sent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${permits.map((permit) => {
    const alertSent = permit.alertSent ? 'Yes' : 'No';
    const alertBadge = permit.alertSent ? 'badge-approved' : 'badge-pending';
    return `
                  <tr>
                    <td><strong>${permit.id}</strong></td>
                    <td>${permit.projectId}</td>
                    <td>${permit.customerName}</td>
                    <td>${permit.workType}</td>
                    <td><span class="badge badge-${permit.status}">${permit.status}</span></td>
                    <td>${permit.portal}</td>
                    <td>${permit.receivedAt ? new Date(permit.receivedAt).toLocaleDateString() : '—'}</td>
                    <td><span class="badge ${alertBadge}">${alertSent}</span></td>
                    <td>
                      ${permit.status === 'pending'
                        ? `<button class="btn btn-sm btn-primary" onclick="Permits.requestPermit('${permit.id}')">Request Permit</button>`
                        : `<button class="btn btn-sm btn-success" onclick="Permits.sendPermitAlert('${permit.id}')">Send Alert</button>`
                      }
                    </td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Request New Permit -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Request New Drainage Permit</h2>
        </div>
        <div class="table-container" style="padding: 1.5rem;">
          <form id="permit-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div class="form-group">
              <label>Project ID</label>
              <select name="projectId" required>
                <option value="">Select project</option>
                ${AppData.projects.filter(p => p.workType === 'drainage' && p.customerApproved).map(p => `
                  <option value="${p.id}">${p.id} — ${p.customerName}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>State Portal</label>
              <input type="text" name="portal" value="State Office Portal" readonly>
            </div>
            <div class="form-group" style="grid-column: 1 / -1; display: flex; gap: 0.5rem;">
              <button type="submit" class="btn btn-primary">Submit Permit Request</button>
              <button type="button" class="btn btn-secondary" id="cancel-permit">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Jolley Utility Marking -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Utility Marking — Jolley Company</h2>
          <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
            Once the drainage permit is obtained, a ticket is created for Jolley Company to contact
            utility providers for marking their lines on the customer's property.
          </p>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Project</th>
                <th>Customer</th>
                <th>Permit Status</th>
                <th>Utility Lines Marked</th>
                <th>Marking Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.getJolleyTickets().map((ticket) => `
                <tr>
                  <td><strong>${ticket.id}</strong></td>
                  <td>${ticket.projectId}</td>
                  <td>${ticket.customerName}</td>
                  <td><span class="badge badge-${ticket.permitStatus}">${ticket.permitStatus}</span></td>
                  <td><span class="badge ${ticket.linesMarked ? 'badge-approved' : 'badge-pending'}">${ticket.linesMarked ? 'Marked' : 'Not Marked'}</span></td>
                  <td>${ticket.markingDate || '—'}</td>
                  <td>
                    ${!ticket.linesMarked
                      ? `<button class="btn btn-sm btn-primary" onclick="Permits.markUtilityLines('${ticket.id}')">Mark Lines</button>`
                      : `<span class="badge badge-approved">Complete</span>`
                    }
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getJolleyTickets() {
    const tickets = [];
    AppData.permits.forEach((permit, index) => {
      if (permit.workType === 'drainage') {
        tickets.push({
          id: `JOL-${200 + index}`,
          projectId: permit.projectId,
          customerName: permit.customerName,
          permitStatus: permit.status,
          linesMarked: permit.status === 'received' && Math.random() > 0.5,
          markingDate: permit.status === 'received' ? new Date(Date.now() + 86400000).toLocaleDateString() : null,
        });
      }
    });
    return tickets;
  },

  requestPermit(permitId) {
    const permit = AppData.permits.find((p) => p.id === permitId);
    if (!permit) return;

    if (confirm(`Request drainage permit for ${permit.customerName} via State Portal?`)) {
      permit.status = 'pending';
      permit.requestedAt = new Date().toISOString();

      alert(`✅ Permit request submitted to State Portal.\n\nPermit: ${permit.id}\nCustomer: ${permit.customerName}\nStatus: Pending\n\nYou will receive an alert when the permit is approved.`);

      App.renderPage('permits');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
    }
  },

  sendPermitAlert(permitId) {
    const permit = AppData.permits.find((p) => p.id === permitId);
    if (!permit) return;

    permit.alertSent = true;

    const notification = {
      id: 'NOT-' + Date.now(),
      projectId: permit.projectId,
      customerName: permit.customerName,
      type: 'permit_received',
      message: `📋 Drainage permit received for ${permit.customerName} (${permit.id}). State portal approval confirmed. Ready to create Jolley utility marking ticket.`,
      link: permit.projectId,
      channels: ['whatsapp', 'email', 'sms'],
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!AppData.notifications) AppData.notifications = [];
    AppData.notifications.push(notification);

    alert(`✅ Permit alert sent!\n\n${notification.message}\n\nNotification sent via WhatsApp/Email/SMS.`);

    App.renderPage('permits');
    if (App.currentPage === 'dashboard') App.renderPage('dashboard');
  },

  markUtilityLines(ticketId) {
    const ticket = this.getJolleyTickets().find((t) => t.id === ticketId);
    if (!ticket) return;

    if (confirm(`Mark utility lines for ${ticket.customerName}?\n\nJolley Company will contact utility providers to mark lines on the property.`)) {
      ticket.linesMarked = true;
      ticket.markingDate = new Date().toLocaleDateString();

      alert(`✅ Utility lines marked!\n\nTicket: ${ticketId}\nCustomer: ${ticket.customerName}\nMarking Date: ${ticket.markingDate}\n\nThe property is now ready for ABC crew to mark drainage.`);

      App.renderPage('permits');
    }
  },
};
