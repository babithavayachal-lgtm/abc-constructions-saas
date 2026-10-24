/* =========================================
   ABC Constructions — Dashboard Module
   Main dashboard with stats and project tables
   ========================================= */

const Dashboard = {
  render() {
    const stats = AppData.getDashboardStats();
    const wipProjects = AppData.getProjectsByStatus('wip');
    const completedProjects = AppData.getProjectsByStatus('completed');

    const content = document.getElementById('dashboard-content');

    content.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Overview of all active and completed projects</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Projects</div>
          <div class="stat-value">${stats.totalProjects}</div>
          <div class="stat-change neutral">
            <span>All projects</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Work In Progress</div>
          <div class="stat-value">${stats.wipProjects}</div>
          <div class="stat-change neutral">
            <span>Active jobs</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Completed</div>
          <div class="stat-value">${stats.completedProjects}</div>
          <div class="stat-change positive">
            <span>Finished jobs</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Job Value</div>
          <div class="stat-value">$${stats.totalJobValue.toLocaleString()}</div>
          <div class="stat-change neutral">
            <span>All projects combined</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Payments Received</div>
          <div class="stat-value">$${stats.totalPaid.toLocaleString()}</div>
          <div class="stat-change positive">
            <span>Deposits collected</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending Balance</div>
          <div class="stat-value">$${stats.pendingBalance.toLocaleString()}</div>
          <div class="stat-change warning">
            <span>Remaining to collect</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">On Time</div>
          <div class="stat-value">${stats.onTime}</div>
          <div class="stat-change positive">
            <span>Jobs on schedule</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Delayed</div>
          <div class="stat-value">${stats.delayed}</div>
          <div class="stat-change negative">
            <span>Jobs behind schedule</span>
          </div>
        </div>
      </div>

      <!-- WIP Jobs Section -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Work In Progress</h2>
          <div class="section-actions">
            <button class="btn btn-sm btn-secondary">View All</button>
          </div>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Job Value</th>
                <th>Payment Status</th>
                <th>Sales Person</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${wipProjects.map((p) => this.projectRow(p)).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Completed -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Recently Completed</h2>
          <div class="section-actions">
            <button class="btn btn-sm btn-secondary">View All</button>
          </div>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Job Value</th>
                <th>Completion Date</th>
                <th>On Time</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              ${completedProjects.map((p) => this.completedRow(p)).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Permit Alerts -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Permit Alerts</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Permit ID</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Status</th>
                <th>Portal</th>
                <th>Received At</th>
              </tr>
            </thead>
            <tbody>
              ${AppData.permits.map((permit) => `
                <tr>
                  <td>${permit.id}</td>
                  <td>${permit.customerName}</td>
                  <td>${permit.workType}</td>
                  <td><span class="badge badge-${permit.status}">${permit.status}</span></td>
                  <td>${permit.portal}</td>
                  <td>${permit.receivedAt || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  projectRow(p) {
    const salesPerson = AppData.getSalesPersonName(p.salesPerson);
    const paymentBadge = p.paymentStatus === 'partial' ? 'badge-partial' : p.paymentStatus === 'paid' ? 'badge-paid' : 'badge-unpaid';
    const statusBadge = p.status === 'wip' ? 'badge-wip' : 'badge-completed';
    const onTimeClass = p.onTime ? 'badge-on-time' : 'badge-delayed';

    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>${p.customerName}</td>
        <td>${p.workType}</td>
        <td>$${p.jobValue.toLocaleString()}</td>
        <td><span class="badge ${paymentBadge}">${p.paymentStatus}</span></td>
        <td>${salesPerson}</td>
        <td>${p.scheduledDate}</td>
        <td><span class="badge ${statusBadge}">${p.status}</span></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="App.navigateTo('jobs')">View</button>
        </td>
      </tr>
    `;
  },

  completedRow(p) {
    const onTimeClass = p.onTime ? 'badge-on-time' : 'badge-delayed';
    const paymentBadge = p.paymentStatus === 'partial' ? 'badge-partial' : p.paymentStatus === 'paid' ? 'badge-paid' : 'badge-unpaid';

    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>${p.customerName}</td>
        <td>${p.workType}</td>
        <td>$${p.jobValue.toLocaleString()}</td>
        <td>${p.completionDate}</td>
        <td><span class="badge ${onTimeClass}">${p.onTime ? 'On Time' : 'Delayed'}</span></td>
        <td><span class="badge ${paymentBadge}">${p.paymentStatus}</span></td>
      </tr>
    `;
  },
};
