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
        <div class="table-container" style="padding: 1.5rem; max-width: 600px;">
          <form id="customer-interest-form" style="display: grid; gap: 1rem;">
            <div class="form-group">
              <label>Your Full Name</label>
              <input type="text" name="customerName" placeholder="e.g. John Smith" required>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="john@example.com" required>
            </div>
            <div class="form-group">
              <label>Phone Number (for callback)</label>
              <input type="tel" name="phone" placeholder="(555) 000-0000" required>
            </div>
            <div class="form-group">
              <label>Property Address</label>
              <input type="text" name="address" placeholder="123 Main Street, City, State ZIP" required>
            </div>
            <div class="form-group">
              <label>Property Type</label>
              <select name="propertyType" required>
                <option value="">Select property type</option>
                <option value="residential">Residential (Home)</option>
                <option value="commercial">Commercial (Business)</option>
              </select>
            </div>
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
              <label>Project Description</label>
              <textarea name="description" rows="3" placeholder="Describe the work you need done..." required></textarea>
            </div>
            <div class="form-group">
              <label>Preferred Timeline</label>
              <select name="timeline" required>
                <option value="">Select timeline</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1 month">1 month</option>
                <option value="2-3 months">2-3 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div class="form-group">
              <label>Estimated Budget</label>
              <select name="budget" required>
                <option value="">Select budget range</option>
                <option value="under-3000">Under $3,000</option>
                <option value="3000-5000">$3,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-15000">$10,000 - $15,000</option>
                <option value="15000-plus">Over $15,000</option>
              </select>
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
            <li>Our sales team receives your interest request</li>
            <li>We'll call you back at the phone number you provided</li>
            <li>A sales person will visit to discuss your requirements</li>
            <li>You'll receive a proposal with a link to approve or deny</li>
          </ol>
        </div>
      </div>
    `;
  },
};