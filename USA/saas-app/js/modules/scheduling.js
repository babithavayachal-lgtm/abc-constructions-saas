/* =========================================
   ABC Constructions — Scheduling Module (Phase 3)
   Job scheduling, crew dispatch, 7-day advance
   customer notification, work dates tracking
   ========================================= */

const Scheduling = {
  render() {
    const wipProjects = AppData.getProjectsByStatus('wip');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Projects scheduled within 7 days
    const upcoming7Days = wipProjects.filter((p) => {
      if (!p.scheduledDate) return false;
      const sched = new Date(p.scheduledDate);
      sched.setHours(0, 0, 0, 0);
      const diffDays = (sched - today) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    });

    // Projects with no schedule yet
    const unscheduled = wipProjects.filter((p) => !p.scheduledDate);

    return `
      <div class="page-header">
        <h1 class="page-title">Scheduling</h1>
        <p class="page-subtitle">Job scheduling, crew dispatch, and 7-day advance customer notifications</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Scheduled Jobs</div>
          <div class="stat-value">${wipProjects.filter(p => p.scheduledDate).length}</div>
          <div class="stat-change neutral">Work-in-progress with dates</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Upcoming (7 Days)</div>
          <div class="stat-value">${upcoming7Days.length}</div>
          <div class="stat-change warning">Notify customers 7 days in advance</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Unscheduled</div>
          <div class="stat-value">${unscheduled.length}</div>
          <div class="stat-change negative">Needs scheduling</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Crew Dispatch</div>
          <div class="stat-value">0</div>
          <div class="stat-change neutral">Ready for dispatch</div>
        </div>
      </div>

      <!-- Schedule New Job -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Schedule a Job</h2>
        </div>
        <div class="table-container" style="padding: 1.5rem;">
          <form id="schedule-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div class="form-group">
              <label>Select Project</label>
              <select name="projectId" required>
                <option value="">Select project</option>
                ${wipProjects.filter(p => !p.scheduledDate).map(p => `
                  <option value="${p.id}">${p.id} — ${p.customerName} (${p.workType})</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Scheduled Date</label>
              <input type="date" name="scheduledDate" required min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
              <label>Crew Assignment</label>
              <input type="text" name="crew" placeholder="e.g. Crew A">
            </div>
            <div class="form-group" style="grid-column: 1 / -1; display: flex; gap: 0.5rem;">
              <button type="submit" class="btn btn-primary">Schedule Job</button>
              <button type="button" class="btn btn-secondary" id="cancel-schedule">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Upcoming Jobs (7-Day Notification) -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Upcoming Jobs — 7-Day Advance Notification</h2>
          <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
            Customers are notified 7 days (tentative) in advance about their scheduled work days.
          </p>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Scheduled Date</th>
                <th>Days Until</th>
                <th>Notification Sent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${upcoming7Days.map((p) => {
    const sched = new Date(p.scheduledDate);
    const diffDays = Math.ceil((sched - today) / (1000 * 60 * 60 * 24));
    const notified = p.scheduleNotificationSent || false;
    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td>${p.workType}</td>
                    <td>${p.scheduledDate}</td>
                    <td>${diffDays} day${diffDays !== 1 ? 's' : ''}</td>
                    <td><span class="badge ${notified ? 'badge-approved' : 'badge-pending'}">${notified ? 'Sent' : 'Pending'}</span></td>
                    <td>
                      ${!notified
                        ? `<button class="btn btn-sm btn-primary" onclick="Scheduling.send7DayNotice('${p.id}')">Send Notice</button>`
                        : `<span class="badge badge-approved">Notified</span>`
                      }
                    </td>
                  </tr>
                `;
  }).join('') || `
                <tr>
                  <td colspan="7" class="empty-state" style="padding: 1rem;">
                    No upcoming jobs within the next 7 days.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- All Scheduled Jobs -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">All Scheduled Jobs</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Scheduled Date</th>
                <th>Sales Person</th>
                <th>Job Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${wipProjects.filter(p => p.scheduledDate).map((p) => {
    const salesPerson = AppData.getSalesPersonName(p.salesPerson);
    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td>${p.workType}</td>
                    <td>${p.scheduledDate}</td>
                    <td>${salesPerson}</td>
                    <td>$${p.jobValue.toLocaleString()}</td>
                    <td><span class="badge badge-wip">WIP</span></td>
                    <td>
                      <button class="btn btn-sm btn-secondary" onclick="Scheduling.reschedule('${p.id}')">Reschedule</button>
                    </td>
                  </tr>
                `;
  }).join('') || `
                <tr>
                  <td colspan="8" class="empty-state" style="padding: 1rem;">
                    No scheduled jobs yet.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // Send 7-day advance notification to customer
  send7DayNotice(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const today = new Date();
    const sched = new Date(project.scheduledDate);
    const diffDays = Math.ceil((sched - today) / (1000 * 60 * 60 * 24));

    if (confirm(`Send 7-day advance notification to ${project.customerName}?\n\nProject: ${project.id}\nWork: ${project.workType}\nScheduled Date: ${project.scheduledDate}\nDays until work: ${diffDays}`)) {
      project.scheduleNotificationSent = true;
      project.notificationSentAt = new Date().toISOString();

      const notification = {
        id: 'NOT-' + Date.now(),
        projectId: project.id,
        customerName: project.customerName,
        type: 'schedule_notice',
        message: `📅 Your ${project.workType} work is scheduled for ${project.scheduledDate} (${diffDays} days from now). Please ensure the property is accessible for our crew.`,
        link: project.proposalLink,
        channels: ['whatsapp', 'email', 'sms'],
        sentAt: new Date().toISOString(),
        status: 'sent',
      };

      if (!AppData.notifications) AppData.notifications = [];
      AppData.notifications.push(notification);

      alert(`✅ 7-day advance notice sent!\n\n${notification.message}\n\nNotification sent via WhatsApp/Email/SMS.`);

      App.renderPage('scheduling');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
    }
  },

  // Reschedule a job
  reschedule(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const newDate = prompt(`Enter new scheduled date for ${project.customerName} (YYYY-MM-DD):`, project.scheduledDate);
    if (newDate) {
      project.scheduledDate = newDate;
      project.scheduleNotificationSent = false; // Reset notification flag

      alert(`✅ Job rescheduled to ${newDate}.\n\nCustomer will receive a new 7-day advance notice.`);

      App.renderPage('scheduling');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
    }
  },
};
