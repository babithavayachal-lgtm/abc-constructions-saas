/* =========================================
   ABC Constructions — Customer Portal Module
   Customer-facing interest form submission
   ========================================= */

const CustomerPortal = {
  render() {
    return `
      <div class="page-header">
        <h1 class="page-title">Request Service</h1>
        <p class="page-subtitle">Tell us what work you need done and we'll get back to you</p>
      </div>

      <!-- Customer Interest Form -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Interest Form</h2>
        </div>
        <div class="table-container" style="padding: 1.5rem; max-width: 500px;">
          <form id="customer-interest-form" style="display: grid; gap: 1rem;">
            <div class="form-group">
              <label>What work do you want done?</label>
              <select name="workType" required>
                <option value="">Select work type</option>
                <option value="drainage">Drainage</option>
                <option value="lawns">Lawns & Landscaping</option>
                <option value="lights">Trim Lights</option>
                <option value="mixed">Mixed Work</option>
              </select>
            </div>
            <div class="form-group">
              <label>Phone Number (for callback)</label>
              <input type="tel" name="phone" placeholder="(555) 000-0000" required>
            </div>
            <div class="form-group">
              <label>Zip Code</label>
              <input type="text" name="zipCode" placeholder="e.g. 90210" maxlength="5" required>
            </div>
            <div class="form-group" style="display: flex; gap: 0.5rem;">
              <button type="submit" class="btn btn-primary btn-block">Submit Request</button>
              <button type="button" class="btn btn-secondary btn-block" id="cancel-customer-form">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Info -->
      <div class="section">
        <div class="table-container" style="padding: 1.5rem; background: var(--bg-body);">
          <h3 style="margin-top: 0; color: var(--text-primary);">What happens next?</h3>
          <ol style="color: var(--text-secondary); line-height: 1.8; margin: 0;">
            <li>Our sales team receives your request</li>
            <li>We'll call you back at the phone number you provided</li>
            <li>A sales person will visit to discuss your requirements</li>
            <li>You'll receive a proposal with a link to approve or deny</li>
          </ol>
        </div>
      </div>
    `;
  },
};
