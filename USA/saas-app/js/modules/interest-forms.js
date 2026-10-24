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
        <p class="page-subtitle">Customer interest submissions imported from the website interest form</p>
      </div>

      <!-- Imported Interest Forms Table -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Submitted Interest Forms (from Website)</h2>
          <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
            These forms were submitted by customers through the website interest form portal.
          </p>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Form ID</th>
                <th>Work Type</th>
                <th>Phone Number</th>
                <th>Zip Code</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${forms.map((f) => `\n                <tr>
                  <td><strong>${f.id}</strong></td>
                  <td>${f.workType}</td>
                  <td>${f.phone}</td>
                  <td>${f.zipCode}</td>
                  <td><span class="badge badge-${f.status}">${f.status}</span></td>
                  <td>${new Date(f.submittedAt).toLocaleDateString()}</td>
                  <td>${AppData.getSalesPersonName(f.assignedSalesPerson)}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="InterestForms.convertToProposal('${f.id}')">
                      Create Proposal
                    </button>
                  </td>
                </tr>
              `).join('') || `
                <tr>
                  <td colspan="8" class="empty-state" style="padding: 1rem;">
                    No interest forms submitted yet. Customers can submit forms through the website portal.
                  </td>
                </tr>
              `}
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
    const jobValue = this.estimateJobValue(form.workType);
    const deposit = (jobValue * 0.5).toFixed(2);

    const newProject = {
      id: 'PJ-' + (1000 + AppData.projects.length + 1),
      customerName: form.customerName || 'Website Customer',
      phone: form.phone,
      zipCode: form.zipCode,
      workType: form.workType,
      description: form.description || `Customer requested ${form.workType} work via website interest form`,
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

    alert(`Proposal created for ${form.customerName || 'Website Customer'}!\n\nProject ID: ${newProject.id}\nWork Type: ${form.workType}\nPhone: ${form.phone}\nZip Code: ${form.zipCode}\nJob Value: $${jobValue.toLocaleString()}\n50% Deposit: $${deposit}\nProposal Link: ${newProject.proposalLink}`);

    // Re-render both pages
    App.renderPage('interestForms');
    if (App.currentPage === 'proposals') {
      App.renderPage('proposals');
    } else if (App.currentPage === 'dashboard') {
      App.renderPage('dashboard');
    }
  },

  estimateJobValue(workType) {
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
