/* =========================================
   ABC Constructions — Crew Dispatch & Inspection Module (Phase 4)
   Crew dispatch, county inspection (pass/fail),
   corrections, work closure
   ========================================= */

const CrewDispatch = {
  render() {
    const wipProjects = AppData.getProjectsByStatus('wip');
    const completedProjects = AppData.getProjectsByStatus('completed');

    const readyForInspection = wipProjects.filter(p => p.inspectionStatus === 'ready');
    const passedInspection = wipProjects.filter(p => p.inspectionStatus === 'passed');
    const failedInspection = wipProjects.filter(p => p.inspectionStatus === 'failed');

    return `
      <div class="page-header">
        <h1 class="page-title">Crew Dispatch & Inspection</h1>
        <p class="page-subtitle">Crew dispatch, county inspection tracking, and work closure</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Active Jobs</div>
          <div class="stat-value">${wipProjects.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Ready for Inspection</div>
          <div class="stat-value">${readyForInspection.length}</div>
          <div class="stat-change warning">County inspection pending</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Passed Inspection</div>
          <div class="stat-value">${passedInspection.length}</div>
          <div class="stat-change positive">Approved by county</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Failed Inspection</div>
          <div class="stat-value">${failedInspection.length}</div>
          <div class="stat-change negative">Needs correction</div>
        </div>
      </div>

      <!-- Crew Dispatch -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Crew Dispatch</h2>
          <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
            Material is taken by the crew to the customer's house on the day of the work.
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
                <th>Crew</th>
                <th>Material Status</th>
                <th>Dispatch Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${wipProjects.filter(p => p.scheduledDate).map((p) => {
    const dispatched = p.crewDispatched || false;
    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td>${p.workType}</td>
                    <td>${p.scheduledDate}</td>
                    <td>${p.crewAssignment || 'Not assigned'}</td>
                    <td><span class="badge badge-approved">Material Ready</span></td>
                    <td><span class="badge ${dispatched ? 'badge-approved' : 'badge-pending'}">${dispatched ? 'Dispatched' : 'Pending'}</span></td>
                    <td>
                      ${!dispatched
                        ? `<button class="btn btn-sm btn-primary" onclick="CrewDispatch.dispatchCrew('${p.id}')">Dispatch Crew</button>`
                        : `<span class="badge badge-approved">Dispatched</span>`
                      }
                    </td>
                  </tr>
                `;
  }).join('') || `
                <tr>
                  <td colspan="8" class="empty-state" style="padding: 1rem;">
                    No scheduled jobs ready for crew dispatch.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- County Inspection -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">County Inspection</h2>
          <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
            After the work, the drainage is kept open for inspection by county staff.
            The county either passes or fails the work after inspection.
          </p>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Inspection Status</th>
                <th>Inspection Date</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${wipProjects.map((p) => {
    const statusBadge = p.inspectionStatus === 'pending' ? 'badge-pending' : p.inspectionStatus === 'passed' ? 'badge-approved' : p.inspectionStatus === 'failed' ? 'badge-denied' : 'badge-warning';
    const statusText = p.inspectionStatus === 'pending' ? 'Pending' : p.inspectionStatus === 'passed' ? 'Passed' : p.inspectionStatus === 'failed' ? 'Failed' : 'Ready';
    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td>${p.workType}</td>
                    <td><span class="badge ${statusBadge}">${statusText}</span></td>
                    <td>${p.inspectionDate || '—'}</td>
                    <td>${p.inspectionResult || '—'}</td>
                    <td>
                      ${p.inspectionStatus === 'pending'
                        ? `<button class="btn btn-sm btn-primary" onclick="CrewDispatch.markReadyForInspection('${p.id}')">Mark Ready</button>`
                        : p.inspectionStatus === 'ready'
                          ? `
                            <button class="btn btn-sm btn-success" onclick="CrewDispatch.recordInspectionResult('${p.id}', 'passed')">Pass</button>
                            <button class="btn btn-sm btn-danger" onclick="CrewDispatch.recordInspectionResult('${p.id}', 'failed')">Fail</button>
                          `
                          : p.inspectionStatus === 'failed'
                            ? `<button class="btn btn-sm btn-primary" onclick="CrewDispatch.recordCorrection('${p.id}')">Record Correction</button>`
                            : `<span class="badge badge-approved">Complete</span>`
                      }
                    </td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Inspection Results Summary -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Inspection Results</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Customer</th>
                <th>Result</th>
                <th>Date</th>
                <th>Correction Required</th>
                <th>Correction Completed</th>
              </tr>
            </thead>
            <tbody>
              ${wipProjects.filter(p => p.inspectionStatus !== 'pending').map((p) => {
    const correctionNeeded = p.inspectionStatus === 'failed' || p.correctionRequired;
    const correctionDone = p.correctionCompleted || false;
    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td><span class="badge ${p.inspectionStatus === 'passed' ? 'badge-approved' : 'badge-denied'}">${p.inspectionStatus === 'passed' ? 'Passed' : 'Failed'}</span></td>
                    <td>${p.inspectionDate}</td>
                    <td><span class="badge ${correctionNeeded ? 'badge-pending' : 'badge-approved'}">${correctionNeeded ? 'Yes' : 'No'}</span></td>
                    <td><span class="badge ${correctionDone ? 'badge-approved' : 'badge-pending'}">${correctionDone ? 'Yes' : 'No'}</span></td>
                  </tr>
                `;
  }).join('') || `
                <tr>
                  <td colspan="6" class="empty-state" style="padding: 1rem;">
                    No inspection results yet.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // Mark job as ready for county inspection
  markReadyForInspection(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    if (confirm(`Mark ${project.customerName}'s job as ready for county inspection?\n\nProject: ${project.id}\nWork: ${project.workType}`)) {
      project.inspectionStatus = 'ready';
      project.inspectionReadyDate = new Date().toISOString();

      alert(`✅ Marked ready for inspection!\n\nThe county will inspect the drainage work per their standards.\n\nProject: ${project.id}\nStatus: Ready for Inspection`);

      App.renderPage('crew-dispatch');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
    }
  },

  // Record county inspection result (pass/fail)
  recordInspectionResult(projectId, result) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    const resultText = result === 'passed' ? 'PASSED' : 'FAILED';

    if (confirm(`Record county inspection result for ${project.customerName}?\n\nResult: ${resultText}\n\n${result === 'failed' ? 'The crew will need to correct the work.' : 'The work passes county standards.'}`)) {
      project.inspectionStatus = result;
      project.inspectionResult = result;
      project.inspectionDate = new Date().toLocaleDateString();

      if (result === 'failed') {
        project.correctionRequired = true;
        project.correctionCompleted = false;
        alert(`❌ Inspection FAILED!\n\nProject: ${project.id}\nThe crew must correct the work. After correction, the drainage will be covered.\n\n(Placeholder: County re-inspection after correction TBD)`);
      } else {
        project.correctionRequired = false;
        project.correctionCompleted = true;
        alert(`✅ Inspection PASSED!\n\nProject: ${project.id}\nThe county approved the work. The crew can now cover the drainage and close the job.`);
      }

      App.renderPage('crew-dispatch');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
    }
  },

  // Record correction after failed inspection
  recordCorrection(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    if (confirm(`Record correction for ${project.customerName}'s failed inspection?\n\nProject: ${project.id}\n\nAfter correction, the drainage will be covered.`)) {
      project.correctionCompleted = true;
      project.correctionDate = new Date().toISOString();

      alert(`✅ Correction recorded!\n\nProject: ${project.id}\nWork corrected and drainage covered.\n\n(Placeholder: County re-inspection after correction TBD)`);

      App.renderPage('crew-dispatch');
    }
  },

  // Close the job after inspection passes and correction (if needed)
  closeJob(projectId) {
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return;

    if (project.inspectionStatus !== 'passed') {
      alert('Cannot close job: Inspection must pass first.');
      return;
    }

    if (project.correctionRequired && !project.correctionCompleted) {
      alert('Cannot close job: Correction must be completed first.');
      return;
    }

    if (confirm(`Close job for ${project.customerName}?\n\nProject: ${project.id}\nThis will generate the final invoice for the remaining 50% balance.`)) {
      project.status = 'completed';
      project.completionDate = new Date().toLocaleDateString();
      project.closedAt = new Date().toISOString();

      // Send work closure notification
      this.notifyWorkClosure(project);

      alert(`✅ Job closed!\n\nProject: ${project.id}\nWork completion email will be sent to customer with invoice for remaining balance of $${project.remainingBalance.toLocaleString()}.`);

      App.renderPage('crew-dispatch');
      if (App.currentPage === 'dashboard') App.renderPage('dashboard');
      if (App.currentPage === 'completed') App.renderPage('completed');
    }
  },

  notifyWorkClosure(project) {
    const notification = {
      id: 'NOT-' + Date.now(),
      projectId: project.id,
      customerName: project.customerName,
      type: 'work_closure',
      message: `✅ Work completed for ${project.customerName} (${project.id}). Work closure email and invoice for remaining balance of $${project.remainingBalance.toLocaleString()} has been sent. Maintenance Guide PDF included.`,
      link: project.proposalLink,
      channels: ['whatsapp', 'email', 'sms'],
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    if (!AppData.notifications) AppData.notifications = [];
    AppData.notifications.push(notification);

    console.log('[Notification - Work Closure]', notification);
  },
};
