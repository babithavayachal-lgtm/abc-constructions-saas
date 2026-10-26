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

      <!-- Client Stripe Dashboard & Merchant Configuration -->
      <div class="section">
        <div class="section-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2 class="section-title">Client Stripe Merchant Dashboard</h2>
            <p style="font-size:0.8125rem; color:var(--text-muted); margin-top:0.25rem;">
              Manage your company's Stripe account, bank account payouts, and customer 50% deposit routing directly from this portal.
            </p>
          </div>
          <span class="badge ${settings.stripeLiveMode ? 'badge-approved' : 'badge-pending'}" id="stripe-status-badge">
            ${settings.stripeLiveMode ? '🟢 LIVE MODE (Bank Deposits Active)' : '🟡 SANDBOX / TEST MODE'}
          </span>
        </div>

        <!-- Quick Access Shortcuts for Client -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin-bottom:1.25rem;">
          <a href="https://dashboard.stripe.com/payouts" target="_blank" class="stat-card" style="text-decoration:none; padding:1rem; border-left:4px solid var(--success);">
            <div class="stat-label">Stripe Bank Payouts</div>
            <div style="font-size:1.125rem; font-weight:700; color:var(--text-primary); margin:0.25rem 0;">🏦 Direct Payouts ↗</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${settings.stripeBankName || 'Linked Checking Account'}</div>
          </a>
          <a href="https://dashboard.stripe.com/payments" target="_blank" class="stat-card" style="text-decoration:none; padding:1rem; border-left:4px solid var(--primary);">
            <div class="stat-label">Customer Transactions</div>
            <div style="font-size:1.125rem; font-weight:700; color:var(--text-primary); margin:0.25rem 0;">💳 Live Payments ↗</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">View credit card charges & receipts</div>
          </a>
          <a href="https://dashboard.stripe.com/payment-links" target="_blank" class="stat-card" style="text-decoration:none; padding:1rem; border-left:4px solid var(--info);">
            <div class="stat-label">Hosted Payment Links</div>
            <div style="font-size:1.125rem; font-weight:700; color:var(--text-primary); margin:0.25rem 0;">🔗 Payment Links ↗</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Create standalone checkout links</div>
          </a>
        </div>

        <!-- Merchant Configuration Form -->
        <div class="table-container" style="padding:1.5rem; background:var(--bg-card);">
          <form id="stripe-merchant-form" onsubmit="Settings.saveStripeConfig(event)" style="display:grid; gap:1.25rem;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label style="font-size:0.8125rem; font-weight:600; display:block; margin-bottom:0.375rem;">Gateway Environment Mode</label>
                <select id="cfg-stripe-mode" style="width:100%; padding:0.625rem; border-radius:4px; border:1px solid var(--border); background:var(--bg-body); color:var(--text-primary);">
                  <option value="sandbox" ${!settings.stripeLiveMode ? 'selected' : ''}>🟡 Sandbox Mode (Testing & Demos with 4242 Card)</option>
                  <option value="live" ${settings.stripeLiveMode ? 'selected' : ''}>🟢 Live Mode (Real Cards & Direct Bank Deposits)</option>
                </select>
                <small style="color:var(--text-muted); font-size:0.75rem; display:block; margin-top:0.25rem;">Switch to Live Mode when ready to receive actual customer funds.</small>
              </div>

              <div class="form-group">
                <label style="font-size:0.8125rem; font-weight:600; display:block; margin-bottom:0.375rem;">Linked Business Bank Account</label>
                <input type="text" id="cfg-stripe-bank" value="${settings.stripeBankName || 'Chase Business Checking (••••4892)'}" placeholder="e.g. Chase Business Checking (••••4892)" style="width:100%; padding:0.625rem; border-radius:4px; border:1px solid var(--border); background:var(--bg-body); color:var(--text-primary);">
                <small style="color:var(--text-muted); font-size:0.75rem; display:block; margin-top:0.25rem;">Account configured in Stripe where payouts are deposited.</small>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label style="font-size:0.8125rem; font-weight:600; display:block; margin-bottom:0.375rem;">Stripe Publishable Key</label>
                <input type="text" id="cfg-stripe-pub-key" value="${settings.stripePublishableKey || ''}" placeholder="pk_live_... or pk_test_..." style="width:100%; padding:0.625rem; border-radius:4px; border:1px solid var(--border); background:var(--bg-body); color:var(--text-primary); font-family:var(--font-mono); font-size:0.8125rem;">
                <small style="color:var(--text-muted); font-size:0.75rem; display:block; margin-top:0.25rem;">Found in Stripe Dashboard → Developers → API Keys.</small>
              </div>

              <div class="form-group">
                <label style="font-size:0.8125rem; font-weight:600; display:block; margin-bottom:0.375rem;">Stripe Custom Payment Link (Optional)</label>
                <input type="url" id="cfg-stripe-payment-link" value="${settings.stripePaymentLink || ''}" placeholder="https://buy.stripe.com/..." style="width:100%; padding:0.625rem; border-radius:4px; border:1px solid var(--border); background:var(--bg-body); color:var(--text-primary); font-size:0.8125rem;">
                <small style="color:var(--text-muted); font-size:0.75rem; display:block; margin-top:0.25rem;">If provided, customers can be redirected to your hosted Stripe checkout.</small>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; pt-2; border-top:1px solid var(--border); padding-top:1rem;">
              <div style="font-size:0.8125rem; color:var(--text-muted);">
                🔒 Changes apply immediately across all client proposals and the payment portal.
              </div>
              <button type="submit" class="btn btn-primary" style="padding:0.625rem 1.5rem; font-weight:700;">
                💾 Save Stripe Configuration
              </button>
            </div>
          </form>
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

  saveStripeConfig(e) {
    if (e && e.preventDefault) e.preventDefault();

    const isLive = document.getElementById('cfg-stripe-mode').value === 'live';
    const bankName = document.getElementById('cfg-stripe-bank').value.trim();
    const pubKey = document.getElementById('cfg-stripe-pub-key').value.trim();
    const paymentLink = document.getElementById('cfg-stripe-payment-link').value.trim();

    if (!AppData.settings) AppData.settings = {};
    AppData.settings.stripeLiveMode = isLive;
    AppData.settings.stripeBankName = bankName || 'Chase Business Checking (••••4892)';
    AppData.settings.stripePublishableKey = pubKey;
    AppData.settings.stripePaymentLink = paymentLink;

    AppData.save();

    // Sync to Firestore if available
    if (window.FirestoreSync && window.FirestoreSync.saveDoc) {
      window.FirestoreSync.saveDoc('settings', 'stripe', {
        stripeLiveMode: isLive,
        stripeBankName: bankName,
        stripePublishableKey: pubKey,
        stripePaymentLink: paymentLink,
        updatedAt: new Date().toISOString()
      });
    }

    const modeText = isLive ? '🟢 LIVE MODE (Direct Bank Deposits)' : '🟡 SANDBOX / TEST MODE';
    alert(`✅ Stripe Merchant Configuration Saved!\n\nGateway Mode: ${modeText}\nLinked Bank Account: ${AppData.settings.stripeBankName}\nPublishable Key: ${pubKey ? 'Configured (' + pubKey.substring(0, 12) + '...)' : 'Default'}\nCustom Payment Link: ${paymentLink || 'Dynamic In-App Checkout'}\n\nCustomer payments will now route through your configured Stripe account.`);

    App.renderPage('settings');
  },
};
