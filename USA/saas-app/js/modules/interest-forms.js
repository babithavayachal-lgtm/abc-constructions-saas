/* =========================================
   ABC Constructions — Interest Forms Module (Phase 2)
   Customer interest submission + conversion to proposals
   ========================================= */

const InterestForms = {
  render() {
    const forms = AppData.interestForms;

    return `
      <div class="page-header">
        <h1 class="page-title">Interest Forms</h1>
        <p class="page-subtitle">Customer interest submissions for drainage, lawns, lights, and landscaping</p>
      </div>

      <!-- Add Interest Form -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Submit New Interest Form</h2>
        </div>
        <div class="table-container" style="padding: 1.5rem;">
          <form id="interest-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div class="form-group">
              <label>Customer Name</label>
              <input type="text" name="customerName" placeholder="e.g. Robert Martinez" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="customer@email.com" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" placeholder="(555) 000-0000" required>
            </div>
            <div class="form-group">
              <label>Work Type</label>
              <select name="workType" required>
                <option value="">Select work type</option>
                <option value="drainage">Drainage</option>
                <option value="lawns">Lawns & Landscaping</option>
                <option value="lights">Trim Lights</option>
                <option value="mixed">Mixed Work</option>
              </select>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Description / Requirements</label>
              <textarea name="description" rows="3" placeholder="Describe the work the customer wants done..." required></textarea>
            </div>
            <div class="form-group" style="grid-column: 1 / -1; display: flex; gap: 0.5rem;">
              <button type="submit" class="btn btn-primary">Submit Interest Form</button>
              <button type="button" class="btn btn-secondary" id="cancel-interest">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Existing Interest Forms -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Submitted Interest Forms</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Form ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Work Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${forms.map((f) => `
                <tr>
                  <td><strong>${f.id}</strong></td>
                  <td>${f.customerName}</td>
                  <td>${f.email}</td>
                  <td>${f.phone}</td>
                  <td>${f.workType}</td>
                  <td>${f.description}</td>
                  <td><span class="badge badge-${f.status}">${f.status}</span></td>
                  <td>${new Date(f.submittedAt).toLocaleDateString()}</td>
                  <td>${AppData.getSalesPersonName(f.assignedSalesPerson)}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="InterestForms.convertToProposal('${f.id}')">
                      Create Proposal
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  convertToProposal(formId) {
    const form = AppData.interestForms.find((f) => f.id === formId);
    if (!form) return;

    // Mark form as converted
    form.status = 'converted';

    // Create a project/proposal from the interest form
    const jobValue = this.estimateJobValue(form.workType, form.description);
    const deposit = (jobValue * 0.5).toFixed(2);

    const newProject = {
      id: 'PJ-' + (1000 + AppData.projects.length + 1),
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      workType: form.workType,
      description: form.description,
      jobValue: jobValue,
      depositPaid: 0,
      remainingBalance: jobValue,
      paymentStatus: 'unpaid',
      status: 'wip',
      scheduledDate: null,
      completionDate: null,
      salesPerson: form.assignedSalesPerson,
      changeOrderSalesPerson: null,
      commissionSplit: null,
      permitReceived: false,
      permitAlert: false,
      inspectionStatus: 'pending',
      onTime: true,
      proposalLink: `https://app.abcconstructions.com/proposal/PJ-${1000 + AppData.projects.length + 1}`,
      customerApproved: false,
      customerDenied: false,
      approvedAt: null,
      deniedAt: null,
      notificationSent: false,
      createdAt: new Date().toISOString(),
      sourceFormId: form.id,
    };

    AppData.projects.push(newProject);

    // Generate proposal link and notify
    this.notifyProposalCreated(newProject);

    alert(`Proposal created for ${form.customerName}!\nProject ID: ${newProject.id}\nJob Value: $${jobValue.toLocaleString()}\n50% Deposit: $${deposit}\nProposal Link: ${newProject.proposalLink}`);

    // Re-render both pages
    App.renderPage('interestForms');
    if (App.currentPage === 'proposals') {
      App.renderPage('proposals');
    } else if (App.currentPage === 'dashboard') {
      App.renderPage('dashboard');
    }
  },

  estimateJobValue(workType, description) {
    // Simple rate card estimation based on work type
    const baseRates = {
      drainage: 8500,
      lawns: 6200,
      lights: 3400,
      mixed: 12000,
    };
    return baseRates[workType] || 5000;
  },

  notifyProposalCreated(project) {
    // Simulate sending notification via WhatsApp/email/message
    const notification = {
      id: 'NOT-' + Date.now(),
      projectId: project.id,
      customerName: project.customerName,
      type: 'proposal_created',
      message: `A proposal has been created for ${project.customerName} (${project.workType} work, $${project.jobValue.toLocaleString()}). Share the proposal link for customer approval.`,
      link: project.proposalLink,
      channels: ['whatsapp', 'email', 'sms'],
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!AppData.notifications) {
      AppData.notifications = [];
    }
    AppData.notifications.push(notification);
    project.notificationSent = true;

    console.log('[Notification Sent]', notification);
  },
};
