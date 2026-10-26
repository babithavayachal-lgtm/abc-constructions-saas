/* =========================================
   ABC Constructions — Interest Forms Module (Phase 2)
   Customer interest submission + conversion to proposals
   ========================================= */

const InterestForms = {
  render() {
    const forms = AppData.interestForms;
    const newCount = forms.filter(f => f.status === 'new').length;

    return `
      <div class="page-header">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
          <div>
            <h1 class="page-title">Interest Forms</h1>
            <p class="page-subtitle">Customer interest submissions from the website portal</p>
          </div>
          ${newCount > 0 ? `
            <div class="stat-card" style="display:inline-block; padding:0.75rem 1rem; min-width:140px;">
              <div class="stat-label" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">New Requests</div>
              <div class="stat-value" style="font-size:1.5rem; color:var(--text-warning);">${newCount}</div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Status Filter Chips -->
      <div class="section" style="margin-bottom:1rem;">
        <div class="section-header" style="margin-bottom:0.75rem;">
          <h2 class="section-title" style="font-size:1rem;">Submitted Interest Forms</h2>
        </div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">
          <button onclick="InterestForms.filterStatus('all')" class="btn btn-sm ${InterestForms._currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" style="padding:0.375rem 0.75rem;">All</button>
          <button onclick="InterestForms.filterStatus('new')" class="btn btn-sm ${InterestForms._currentFilter === 'new' ? 'btn-warning' : 'btn-secondary'}" style="padding:0.375rem 0.75rem;">New</button>
          <button onclick="InterestForms.filterStatus('contacted')" class="btn btn-sm ${InterestForms._currentFilter === 'contacted' ? 'btn-info' : 'btn-secondary'}" style="padding:0.375rem 0.75rem;">Contacted</button>
          <button onclick="InterestForms.filterStatus('quoted')" class="btn btn-sm ${InterestForms._currentFilter === 'quoted' ? 'btn-info' : 'btn-secondary'}" style="padding:0.375rem 0.75rem;">Quoted</button>
          <button onclick="InterestForms.filterStatus('converted')" class="btn btn-sm ${InterestForms._currentFilter === 'converted' ? 'btn-success' : 'btn-secondary'}" style="padding:0.375rem 0.75rem;">Converted</button>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Form ID</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Property</th>
                <th>Timeline</th>
                <th>Budget</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="interest-forms-tbody">
              ${this.renderFormsTable(forms)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  _currentFilter: 'all',

  filterStatus(status) {
    this._currentFilter = status;
    App.renderPage('interestForms');
  },

  renderFormsTable(forms) {
    const filtered = this._currentFilter === 'all'
      ? forms
      : forms.filter(f => f.status === this._currentFilter);

    if (filtered.length === 0) {
      return `\n                <tr>
                    <td colspan="11" class="empty-state" style="padding:1rem;">
                      No ${this._currentFilter} interest forms found.
                    </td>
                  </tr>`;
    }

    return filtered.map((f) => {
      const priorityColor = f.priority === 'high' ? 'var(--text-danger)' : f.priority === 'medium' ? 'var(--text-warning)' : 'var(--text-success)';
      return `\n                <tr>
                    <td><strong>${f.id}</strong></td>
                    <td>
                      <div>${f.customerName}</div>
                      <div style="font-size:0.75rem; color:var(--text-muted);">${f.email || '—'}</div>
                    </td>
                    <td>${f.workType}</td>
                    <td>${f.propertyType || '—'}</td>
                    <td>${f.timeline || '—'}</td>
                    <td>${f.budget || '—'}</td>
                    <td><span style="color:${priorityColor}; font-weight:600; text-transform:uppercase; font-size:0.75rem;">${f.priority}</span></td>
                    <td><span class="badge badge-${f.status}">${f.status}</span></td>
                    <td>${new Date(f.submittedAt).toLocaleDateString()}</td>
                    <td>${AppData.getSalesPersonName(f.assignedSalesPerson)}</td>
                    <td>
                      <div style="display:flex; gap:0.25rem; flex-direction:column;">
                        <button class="btn btn-sm btn-primary" onclick="InterestForms.convertToProposal('${f.id}')" style="padding:0.375rem 0.6rem; font-size:0.75rem;">Create Proposal</button>
                        ${f.status !== 'converted' ? `
                          <button class="btn btn-sm btn-secondary" onclick="InterestForms.updateStatus('${f.id}', 'contacted')" style="padding:0.375rem 0.6rem; font-size:0.75rem;">Mark Contacted</button>
                        ` : ''}
                        <button class="btn btn-sm" onclick="InterestForms.addNotes('${f.id}')" style="padding:0.375rem 0.6rem; font-size:0.75rem; background:var(--bg-card); border:1px solid var(--border); color:var(--text-primary);">Notes</button>
                      </div>
                    </td>
                  </tr>
              `;
    }).join('');
  },

  updateStatus(formId, newStatus) {
    const form = AppData.interestForms.find((f) => f.id === formId);
    if (!form) return;
    form.status = newStatus;
    AppData.save();
    FirestoreSync.saveCollection('interestForms');
    App.renderPage('interestForms');
    if (App.currentPage === 'dashboard') App.renderPage('dashboard');
    alert(`Form ${formId} status updated to ${newStatus}.`);
  },

  addNotes(formId) {
    const form = AppData.interestForms.find((f) => f.id === formId);
    if (!form) return;
    const notes = prompt(`Add admin notes for ${form.customerName} (${form.id}):\n\nCurrent notes: ${form.adminNotes || '—'}`, form.adminNotes || '');
    if (notes !== null) {
      form.adminNotes = notes;
      AppData.save();
      FirestoreSync.saveCollection('interestForms');
      App.renderPage('interestForms');
      alert('Notes saved.');
    }
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
      email: form.email || '',
      phone: form.phone,
      address: form.address,
      workType: form.workType,
      description: form.description || `Customer requested ${form.workType} work via website interest form`,
      propertyType: form.propertyType,
      timeline: form.timeline,
      budget: form.budget,
      jobValue: jobValue,
      depositPaid: 0,
      remainingBalance: jobValue,
      paymentStatus: 'unpaid',
      status: 'pending_payment',
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

    AppData.save();
    FirestoreSync.saveCollection('projects');

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
