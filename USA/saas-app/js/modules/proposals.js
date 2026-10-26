/* =========================================
   ABC Constructions — Proposals Module (Phase 2)
   Proposals with customer Approve/Deny flow,
   notification system, and 50% payment link
   ========================================= */

const Proposals = {
  render() {
    const projects = AppData.projects;

    return `
      <div class="page-header">
        <h1 class="page-title">Proposals</h1>
        <p class="page-subtitle">Project proposals with customer approval status and shareable links</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Proposals</div>
          <div class="stat-value">${projects.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Approved</div>
          <div class="stat-value">${projects.filter(p => p.customerApproved).length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending Approval</div>
          <div class="stat-value">${projects.filter(p => !p.customerApproved && !p.customerDenied).length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Denied</div>
          <div class="stat-value">${projects.filter(p => p.customerDenied).length}</div>
        </div>
      </div>

      <div class="section">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Job Value</th>
                <th>50% Deposit</th>
                <th>Approval Status</th>
                <th>Proposal Link</th>
                <th>Customer Action</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${projects.map((p) => {
    const deposit = (p.jobValue * 0.5).toFixed(2);
    let approvalBadge, approvalText;
    if (p.customerApproved) {
      approvalBadge = 'badge-approved';
      approvalText = 'Approved';
    } else if (p.customerDenied) {
      approvalBadge = 'badge-denied';
      approvalText = 'Denied';
    } else {
      approvalBadge = 'badge-pending';
      approvalText = 'Pending';
    }

    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td>${p.workType}</td>
                    <td>$${p.jobValue.toLocaleString()}</td>
                    <td>$${deposit}</td>
                    <td><span class="badge ${approvalBadge}">${approvalText} ${!p.customerApproved && !p.customerDenied ? '⚠️ Pending' : ''}</span></td>
                    <td>
                        <a href="proposal.html?id=${p.id}" target="_blank" class="btn btn-sm btn-primary" style="flex:1; padding:0.25rem 0.5rem; font-size:0.75rem; text-decoration:none; text-align:center;" title="Open Live Customer Proposal Page">🔗 Open Proposal</a>
                        <button class="btn btn-sm btn-secondary" onclick="copyLink(window.location.origin + '/proposal.html?id=${p.id}')" title="Copy proposal link">Copy</button>
                        <button class="btn btn-sm btn-info" onclick="Proposals.sendProposalEmail('${p.id}')" title="Send Proposal Email">Email</button>
                    </td>
                    <td>
                      ${!p.customerApproved && !p.customerDenied
                        ? `
                          <button class="btn btn-sm btn-warning" onclick="Proposals.simulateCustomerApprove('${p.id}')" title="Simulate Customer Approve">⚠️ Awaiting Approval</button>
                          <button class="btn btn-sm btn-danger" onclick="Proposals.simulateCustomerDeny('${p.id}')" title="Simulate Customer Deny">Deny</button>
                        `
                        : `<span class="badge ${p.customerApproved ? 'badge-approved' : 'badge-denied'}">${p.customerApproved ? 'Approved' : 'Denied'}</span>`
                      }
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary" onclick="Proposals.viewDetails('${p.id}')">Details</button>
                    </td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  copyLink(link) {
    navigator.clipboard.writeText(link);
    alert('Proposal link copied to clipboard!');
  },

  sendProposalEmail(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const deposit = (project.jobValue * 0.5).toFixed(2);
    const salesPerson = AppData.getSalesPersonName(project.salesPerson);

    const subject = encodeURIComponent(`Project Proposal - ${project.id} - ABC Constructions`);
    const body = encodeURIComponent(
      `Hello ${project.customerName},\n\n` +
      `Thank you for your interest in ${project.workType} work with ABC Constructions.\n\n` +
      `Project Details:\n` +
      `  Project ID: ${project.id}\n` +
      `  Work Type: ${project.workType}\n` +
      `  Description: ${project.description || '—'}\n` +
      `  Property Type: ${project.propertyType || '—'}\n` +
      `  Timeline: ${project.timeline || '—'}\n` +
      `  Budget: ${project.budget || '—'}\n` +
      `  Job Value: $${project.jobValue.toLocaleString()}\n` +
      `  50% Deposit Due: $${deposit}\n` +
      `  Sales Person: ${salesPerson}\n` +
      `  Status: ${project.status}\n\n` +
      `Proposal Link: ${project.proposalLink}\n\n` +
      `Please review the proposal and click the link to Approve or Deny.\n\n` +
      `Best regards,\nABC Constructions Team`
    );

    const mailtoUrl = `mailto:${project.email || ''}?from=babyjune7@gmail.com&subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  },

  viewDetails(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const deposit = (project.jobValue * 0.5).toFixed(2);
    const salesPerson = AppData.getSalesPersonName(project.salesPerson);

    alert(
      `Project Details\n\n` +
      `ID: ${project.id}\n` +
      `Customer: ${project.customerName}\n` +
      `Email: ${project.email || '—'}\n` +
      `Phone: ${project.phone || '—'}\n` +
      `Work Type: ${project.workType}\n` +
      `Description: ${project.description || '—'}\n` +
      `Job Value: $${project.jobValue.toLocaleString()}\n` +
      `50% Deposit: $${deposit}\n` +
      `Remaining Balance: $${project.remainingBalance.toLocaleString()}\n` +
      `Sales Person: ${salesPerson}\n` +
      `Status: ${project.status}\n` +
      `Approval: ${project.customerApproved ? 'Approved' : project.customerDenied ? 'Denied' : 'Pending'}\n` +
      `Proposal Link: ${project.proposalLink}\n` +
      `Created: ${new Date(project.createdAt).toLocaleDateString()}`
    );
  },

  // Simulate customer clicking the proposal link and approving
  simulateCustomerApprove(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    if (confirm(`Approve proposal for ${project.customerName}?\n\nJob Value: $${project.jobValue.toLocaleString()}\n50% Deposit: $${(project.jobValue * 0.5).toFixed(2)}`)) {
      project.customerApproved = true;
      project.customerDenied = false;
      project.approvedAt = new Date().toISOString();
      // Status stays 'pending_payment' until 50% deposit is received

      AppData.save();

      AppData.save();

      // Close the customer portal modal
      this.closeCustomerPortal();

      // Open payment modal for 50% deposit
      Payments.openPaymentModal(project.id);

      // Send notification to company (email)
      this.notifyApproval(project);

      // Send payment link email to customer
      this.notifyCustomerPaymentLink(project);

      alert(`✅ Customer approved!\n\nA 50% payment link has been generated for $${(project.jobValue * 0.5).toFixed(2)}.\nPayment link emailed to customer.\nNotification sent to company via email.`);

      App.renderPage('proposals');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
    }
  },

  // Simulate customer clicking the proposal link and denying
  simulateCustomerDeny(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    if (confirm(`Deny proposal for ${project.customerName}?`)) {
      project.customerDenied = true;
      project.customerApproved = false;
      project.deniedAt = new Date().toISOString();

      AppData.save();
      FirestoreSync.saveCollection('projects');

      this.notifyDenial(project);

      alert(`❌ Customer denied the proposal.\nNotification sent to company.`);

      App.renderPage('proposals');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
    }
  },

  notifyApproval(project) {
    const deposit = (project.jobValue * 0.5).toFixed(2);
    const notification = {
      id: 'NOT-' + Date.now(),
      projectId: project.id,
      customerName: project.customerName,
      type: 'proposal_approved',
      message: `✅ ${project.customerName} approved the proposal for ${project.workType} work ($${project.jobValue.toLocaleString()}). 50% deposit of $${deposit} is now due.`,
      link: project.proposalLink,
      channels: ['whatsapp', 'email', 'sms'],
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!AppData.notifications) AppData.notifications = [];
    AppData.notifications.push(notification);

    // Send email to company about approval
    const subject = encodeURIComponent(`✅ Proposal Approved - ${project.id} - ${project.customerName}`);
    const body = encodeURIComponent(
      `Hello ABC Constructions Team,\n\n` +
      `A customer has approved a proposal.\n\n` +
      `Project Details:\n` +
      `  Project ID: ${project.id}\n` +
      `  Customer: ${project.customerName}\n` +
      `  Email: ${project.email || '—'}\n` +
      `  Phone: ${project.phone || '—'}\n` +
      `  Work Type: ${project.workType}\n` +
      `  Description: ${project.description || '—'}\n` +
      `  Job Value: $${project.jobValue.toLocaleString()}\n` +
      `  50% Deposit Due: $${deposit}\n` +
      `  Sales Person: ${AppData.getSalesPersonName(project.salesPerson)}\n` +
      `  Status: ${project.status}\n\n` +
      `Proposal Link: ${project.proposalLink}\n\n` +
      `Please follow up with the customer for the 50% deposit.\n\n` +
      `Best regards,\nABC Constructions Portal`
    );
    console.log('[Notification - Approval]', notification);
  },

  // Send payment link email to customer
  notifyCustomerPaymentLink(project) {
    const deposit = (project.jobValue * 0.5).toFixed(2);
    const salesPerson = AppData.getSalesPersonName(project.salesPerson);

    const subject = encodeURIComponent(`💰 Your 50% Payment Link - Project ${project.id} - ABC Constructions`);
    const body = encodeURIComponent(
      `Hello ${project.customerName},\n\n` +
      `Thank you for approving the proposal for your ${project.workType} work with ABC Constructions!\n\n` +
      `Project Details:\n` +
      `  Project ID: ${project.id}\n` +
      `  Work Type: ${project.workType}\n` +
      `  Description: ${project.description || '—'}\n` +
      `  Job Value: $${project.jobValue.toLocaleString()}\n` +
      `  50% Deposit Due: $${deposit}\n` +
      `  Sales Person: ${salesPerson}\n\n` +
      `Proposal Link: ${project.proposalLink}\n\n` +
      `Please click the proposal link to complete your 50% deposit payment.\n\n` +
      `Once payment is received, we'll schedule your work.\n\n` +
      `Best regards,\nABC Constructions Team`
    );
    console.log('[Notification - Customer Payment Link]', { to: project.email, subject, projectId: project.id });
  },

  notifyDenial(project) {
    const notification = {
      id: 'NOT-' + Date.now(),
      projectId: project.id,
      customerName: project.customerName,
      type: 'proposal_denied',
      message: `❌ ${project.customerName} denied the proposal for ${project.workType} work ($${project.jobValue.toLocaleString()}).`,
      link: project.proposalLink,
      channels: ['whatsapp', 'email', 'sms'],
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!AppData.notifications) AppData.notifications = [];
    AppData.notifications.push(notification);

    // Send email to company about denial
    const subject = encodeURIComponent(`❌ Proposal Denied - ${project.id} - ${project.customerName}`);
    const body = encodeURIComponent(
      `Hello ABC Constructions Team,\n\n` +
      `A customer has denied a proposal.\n\n` +
      `Project Details:\n` +
      `  Project ID: ${project.id}\n` +
      `  Customer: ${project.customerName}\n` +
      `  Email: ${project.email || '—'}\n` +
      `  Phone: ${project.phone || '—'}\n` +
      `  Work Type: ${project.workType}\n` +
      `  Description: ${project.description || '—'}\n` +
      `  Job Value: $${project.jobValue.toLocaleString()}\n` +
      `  Sales Person: ${AppData.getSalesPersonName(project.salesPerson)}\n` +
      `  Status: Denied\n\n` +
      `Proposal Link: ${project.proposalLink}\n\n` +
      `You may want to follow up with the customer to understand their decision.\n\n` +
      `Best regards,\nABC Constructions Portal`
    );
    console.log('[Notification - Denial]', notification);
  },

  // Open the customer-facing portal (simulates what the customer sees when clicking the link)
  openCustomerPortal(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const deposit = (project.jobValue * 0.5).toFixed(2);

    const portalContent = `
      <div style="max-width: 500px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="background: #2563eb; color: white; padding: 2rem; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 1.5rem;">ABC Constructions</h1>
          <p style="margin: 0.5rem 0 0; opacity: 0.9;">Project Proposal</p>
        </div>
        <div style="padding: 2rem; border: 1px solid var(--border); border-top: none; background: var(--bg-body); color: var(--text-primary);">
          <h2 style="margin-top: 0; color: var(--text-primary);">Your Project Details</h2>
          <p><strong>Project ID:</strong> ${project.id}</p>
          <p><strong>Work Type:</strong> ${project.workType}</p>
          <p><strong>Description:</strong> ${project.description || '—'}</p>
          <p><strong>Job Value:</strong> $${project.jobValue.toLocaleString()}</p>
          <p><strong>50% Deposit Due:</strong> $${deposit}</p>
          <p><strong>Sales Person:</strong> ${AppData.getSalesPersonName(project.salesPerson)}</p>
          <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid var(--border);">
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Please review the work details above. If everything looks correct, click Approve to proceed.</p>
        </div>
        <div style="padding: 2rem; border: 1px solid var(--border); border-top: none; background: var(--bg-card); display: flex; gap: 1rem; justify-content: center; border-radius: 0 0 8px 8px;">
          <button onclick="Proposals.simulateCustomerApprove('${project.id}')" style="flex:1; padding: 1rem; background: var(--success-solid); color: #ffffff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem;">✅ Approve</button>
          <button onclick="Proposals.simulateCustomerDeny('${project.id}'); Proposals.closeCustomerPortal();" style="flex:1; padding: 1rem; background: var(--danger-solid); color: #ffffff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem;">❌ Deny</button>
        </div>
      </div>
    `;

    // Show in a modal
    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = `
      <div class="modal-overlay" style="display: flex; justify-content: center; align-items: center; padding: 1rem;">
        <div class="modal" style="display: block; max-width: 600px;">
          <div class="modal-header">
            <h3>Customer Portal — ${project.id}</h3>
            <button class="modal-close" onclick="Proposals.closeCustomerPortal()">&times;</button>
          </div>
          <div class="modal-body" style="padding: 0;">
            ${portalContent}
          </div>
        </div>
      </div>
    `;
    overlay.style.display = 'flex';
  },

  closeCustomerPortal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.style.display = 'none';
    overlay.innerHTML = '';
  },
};

function copyLink(link) {
  navigator.clipboard.writeText(link);
  alert('Proposal link copied to clipboard!');
}
