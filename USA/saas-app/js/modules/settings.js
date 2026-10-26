/* =========================================
   ABC Constructions — Settings Module
   ========================================= */

const Settings = {
  render() {
    const settings = AppData.settings;

    return `
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Company configuration and system preferences</p>
      </div>

      <div class="section">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Setting</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Company Name</strong></td>
                <td>${settings.companyName}</td>
              </tr>
              <tr>
                <td><strong>Company "From" Email</strong></td>
                <td><a href="mailto:${settings.companyEmail || 'babyjune7@gmail.com'}" style="color:var(--primary); font-weight:600;">${settings.companyEmail || 'babyjune7@gmail.com'}</a></td>
              </tr>
              <tr>
                <td><strong>Location</strong></td>
                <td>${settings.location}</td>
              </tr>
              <tr>
                <td><strong>Rate Card Version</strong></td>
                <td>${settings.rateCardVersion}</td>
              </tr>
              <tr>
                <td><strong>Payment Provider</strong></td>
                <td>${settings.paymentProvider}</td>
              </tr>
              <tr>
                <td><strong>Deposit Percentage</strong></td>
                <td>${settings.depositPercentage}%</td>
              </tr>
              <tr>
                <td><strong>Advance Notice Days</strong></td>
                <td>${settings.advanceNoticeDays} days</td>
              </tr>
              <tr>
                <td><strong>Notification Channels</strong></td>
                <td>${settings.notificationChannels.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Payment API Configuration</h2>
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

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Workflow Configuration</h2>
        </div>
        <div class="grid-3">
          <div class="stat-card">
            <div class="stat-label">Interest Form Intake</div>
            <div class="stat-value">Build Trend</div>
            <div class="stat-change neutral">Scanned copy → Google Drive</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Permit Portal</div>
            <div class="stat-value">State Office</div>
            <div class="stat-change neutral">Drainage permits only</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Utility Marking</div>
            <div class="stat-value">Jolley Company</div>
            <div class="stat-change neutral">Ticket-based system</div>
          </div>
        </div>
      </div>
    `;
  },
};
