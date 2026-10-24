/* =========================================
   ABC Constructions — Change Orders Module (Phase 4)
   Scope changes, value updates, commission splits
   ========================================= */

const ChangeOrders = {
  render() {
    const changeOrders = AppData.changeOrders || [];
    const projects = AppData.projects;

    return `
      <div class="page-header">
        <h1 class="page-title">Change Orders</h1>
        <p class="page-subtitle">Scope changes, job value updates, and commission split tracking</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Change Orders</div>
          <div class="stat-value">${changeOrders.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Approved</div>
          <div class="stat-value">${changeOrders.filter(co => co.status === 'approved').length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending</div>
          <div class="stat-value">${changeOrders.filter(co => co.status === 'pending').length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Added Value</div>
          <div class="stat-value">$${changeOrders.reduce((s, co) => s + co.additionalValue, 0).toLocaleString()}</div>
        </div>
      </div>

      <!-- Create Change Order -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Create Change Order</h2>
        </div>
        <div class="table-container" style="padding: 1.5rem;">
          <form id="change-order-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div class="form-group">
              <label>Select Project</label>
              <select name="projectId" required>
                <option value="">Select project</option>
                ${projects.filter(p => p.customerApproved && !p.customerDenied).map(p => `
                  <option value="${p.id}">${p.id} — ${p.customerName}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Change Description</label>
              <input type="text" name="description" placeholder="e.g. Additional drainage length" required>
            </div>
            <div class="form-group">
              <label>Additional Value ($)</label>
              <input type="number" name="additionalValue" placeholder="0.00" step="0.01" required min="0">
            </div>
            <div class="form-group">
              <label>Change Order Sales Person</label>
              <select name="salesPerson" required>
                <option value="">Select sales person</option>
                ${AppData.salesTeam.map(person => `
                  <option value="${person.id}">${person.name}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group" style="grid-column: 1 / -1; display: flex; gap: 0.5rem;">
              <button type="submit" class="btn btn-primary">Create Change Order</button>
              <button type="button" class="btn btn-secondary" id="cancel-change-order">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Change Order List -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">All Change Orders</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>CO ID</th>
                <th>Project</th>
                <th>Customer</th>
                <th>Description</th>
                <th>Additional Value</th>
                <th>Original Sales Person</th>
                <th>CO Sales Person</th>
                <th>Commission Split</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${changeOrders.map((co) => {
    const originalPerson = AppData.getSalesPersonName(co.originalSalesPerson);
    const coPerson = AppData.getSalesPersonName(co.changeOrderSalesPerson);
    const split = co.commissionSplit || { [co.originalSalesPerson]: 20 };
    const splitText = Object.entries(split).map(([id, pct]) => `${AppData.getSalesPersonName(id)}: ${pct}%`).join(', ');
    const badgeClass = co.status === 'approved' ? 'badge-approved' : co.status === 'pending' ? 'badge-pending' : 'badge-denied';
    return `
                  <tr>
                    <td><strong>${co.id}</strong></td>
                    <td>${co.projectId}</td>
                    <td>${co.customerName}</td>
                    <td>${co.description}</td>
                    <td>$${co.additionalValue.toLocaleString()}</td>
                    <td>${originalPerson}</td>
                    <td>${coPerson}</td>
                    <td>${splitText}</td>
                    <td><span class="badge ${badgeClass}">${co.status}</span></td>
                    <td>
                      ${co.status === 'pending'
                        ? `
                          <button class="btn btn-sm btn-success" onclick="ChangeOrders.approveChangeOrder('${co.id}')">Approve</button>
                          <button class="btn btn-sm btn-danger" onclick="ChangeOrders.denyChangeOrder('${co.id}')">Deny</button>
                        `
                        : `<span class="badge badge-${co.status}">${co.status}</span>`
                      }
                    </td>
                  </tr>
                `;
  }).join('') || `
                <tr>
                  <td colspan="10" class="empty-state" style="padding: 1rem;">
                    No change orders yet. Create one from a project above.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Commission Split Rules -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Commission Split Rules</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Original Sales Person</th>
                <th>Change Order Sales Person</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Same sales person</strong></td>
                <td>20%</td>
                <td>20%</td>
                <td>Sales person who dealt with the first order gets 20% commission on the value of the project, including change orders they create.</td>
              </tr>
              <tr>
                <td><strong>Different sales person</strong></td>
                <td>10%</td>
                <td>10%</td>
                <td>If the change order is created by another salesperson, the 20% commission is split 10% / 10% between them.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  createChangeOrder(formData) {
    const projectId = formData.get('projectId');
    const description = formData.get('description');
    const additionalValue = parseFloat(formData.get('additionalValue'));
    const changeOrderSalesPerson = formData.get('salesPerson');

    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return null;

    const originalSalesPerson = project.salesPerson;
    const isSamePerson = originalSalesPerson === changeOrderSalesPerson;

    // Commission split logic
    let commissionSplit;
    if (isSamePerson) {
      commissionSplit = { [originalSalesPerson]: 20 };
    } else {
      commissionSplit = { [originalSalesPerson]: 10, [changeOrderSalesPerson]: 10 };
    }

    const changeOrder = {
      id: 'CO-' + (1000 + (AppData.changeOrders || []).length + 1),
      projectId,
      customerName: project.customerName,
      description,
      additionalValue,
      originalSalesPerson,
      changeOrderSalesPerson,
      commissionSplit,
      status: 'pending',
      createdAt: new Date().toISOString(),
      approvedAt: null,
    };

    if (!AppData.changeOrders) AppData.changeOrders = [];
    AppData.changeOrders.push(changeOrder);

    return changeOrder;
  },

  approveChangeOrder(coId) {
    const co = (AppData.changeOrders || []).find((c) => c.id === coId);
    if (!co) return;

    if (confirm(`Approve change order for ${co.customerName}?\n\nAdditional Value: $${co.additionalValue.toLocaleString()}\nCommission Split: ${Object.entries(co.commissionSplit).map(([id, pct]) => `${AppData.getSalesPersonName(id)}: ${pct}%`).join(', ')}`)) {
      co.status = 'approved';
      co.approvedAt = new Date().toISOString();

      // Update project job value
      const project = AppData.projects.find((p) => p.id === co.projectId);
      if (project) {
        project.jobValue += co.additionalValue;
        project.remainingBalance += co.additionalValue;
        project.changeOrderSalesPerson = co.changeOrderSalesPerson;
        project.commissionSplit = co.commissionSplit;
      }

      // Send notification
      this.notifyChangeOrderApproved(co);

      alert(`✅ Change order approved!\n\nProject value updated: $${project.jobValue.toLocaleString()}\nCommission split applied.`);

      App.renderPage('change-orders');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
      if (App.currentPage === 'jobs') App.renderPage('jobs');
      if (App.currentPage === 'sales') App.renderPage('sales');
    }
  },

  denyChangeOrder(coId) {
    const co = (AppData.changeOrders || []).find((c) => c.id === coId);
    if (!co) return;

    if (confirm(`Deny change order for ${co.customerName}?`)) {
      co.status = 'denied';
      alert(`❌ Change order denied.`);

      App.renderPage('change-orders');
    }
  },

  notifyChangeOrderApproved(co) {
    const notification = {
      id: 'NOT-' + Date.now(),
      projectId: co.projectId,
      customerName: co.customerName,
      type: 'change_order_approved',
      message: `📝 Change order approved for ${co.customerName} (${co.projectId}). Additional value: $${co.additionalValue.toLocaleString()}. Commission split: ${Object.entries(co.commissionSplit).map(([id, pct]) => `${AppData.getSalesPersonName(id)}: ${pct}%`).join(', ')}.`,
      link: co.projectId,
      channels: ['whatsapp', 'email', 'sms'],
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!AppData.notifications) AppData.notifications = [];
    AppData.notifications.push(notification);

    console.log('[Notification - Change Order]', notification);
  },
};
