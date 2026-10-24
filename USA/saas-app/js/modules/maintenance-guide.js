/* =========================================
   ABC Constructions — Maintenance Guide Module (Phase 4)
   Auto-generated PDF maintenance guide ("what to expect")
   sent with the final invoice
   ========================================= */

const MaintenanceGuide = {
  render() {
    const completedProjects = AppData.getProjectsByStatus('completed');
    const guideSent = completedProjects.filter(p => p.maintenanceGuideSent);
    const guidePending = completedProjects.filter(p => !p.maintenanceGuideSent);

    return `
      <div class="page-header">
        <h1 class="page-title">Maintenance Guide</h1>
        <p class="page-subtitle">Auto-generated maintenance guide PDF ("what to expect") sent with final invoices</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Guides Generated</div>
          <div class="stat-value">${guideSent.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending</div>
          <div class="stat-value">${guidePending.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Completion Rate</div>
          <div class="stat-value">${completedProjects.length > 0 ? Math.round((guideSent.length / completedProjects.length) * 100) : 0}%</div>
        </div>
      </div>

      <!-- Maintenance Guide Templates -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Guide Templates by Work Type</h2>
        </div>
        <div class="grid-3">
          <div class="stat-card">
            <div class="stat-label">Drainage</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
              • Keep drainage open for 24 hrs after work<br>
              • Avoid heavy equipment over the area<br>
              • Check for proper water flow after rain<br>
              • Report any pooling or blockage immediately
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Lawns & Landscaping</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
              • Water newly sodded areas daily for 2 weeks<br>
              • Avoid mowing for 10-14 days<br>
              • Fertilize after 30 days<br>
              • Monitor irrigation coverage
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Trim Lights</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
              • Test WiFi controller connection<br>
              • Clean light channels quarterly<br>
              • Replace bulbs with matching wattage<br>
              • Check transformer for moisture
            </div>
          </div>
        </div>
      </div>

      <!-- Generated Guides -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Generated Maintenance Guides</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Guide ID</th>
                <th>Project</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Generated At</th>
                <th>Sent With Invoice</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.getGeneratedGuides().map((guide) => `
                <tr>
                  <td><strong>${guide.id}</strong></td>
                  <td>${guide.projectId}</td>
                  <td>${guide.customerName}</td>
                  <td>${guide.workType}</td>
                  <td>${guide.generatedAt}</td>
                  <td><span class="badge badge-approved">Yes</span></td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="MaintenanceGuide.viewGuide('${guide.id}')">View PDF</button>
                  </td>
                </tr>
              `).join('') || `
                <tr>
                  <td colspan="7" class="empty-state" style="padding: 1rem;">
                    No maintenance guides generated yet.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Generate Guide for a Project -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Generate Maintenance Guide</h2>
          <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
            Generate a personalized maintenance guide for a completed project. The guide includes care instructions
            for the first 24 hours and general maintenance information specific to the customer's property.
          </p>
        </div>
        <div class="table-container" style="padding: 1.5rem;">
          <form id="maintenance-guide-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div class="form-group">
              <label>Select Completed Project</label>
              <select name="projectId" required>
                <option value="">Select project</option>
                ${AppData.getProjectsByStatus('completed').filter(p => !p.maintenanceGuideSent).map(p => `
                  <option value="${p.id}">${p.id} — ${p.customerName} (${p.workType})</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group" style="grid-column: 1 / -1; display: flex; gap: 0.5rem;">
              <button type="submit" class="btn btn-primary">Generate PDF Guide</button>
              <button type="button" class="btn btn-secondary" id="cancel-maintenance-guide">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  getGeneratedGuides() {
    const guides = [];
    AppData.projects.forEach((p, index) => {
      if (p.maintenanceGuideSent) {
        guides.push({
          id: 'MG-' + (1000 + index),
          projectId: p.id,
          customerName: p.customerName,
          workType: p.workType,
          generatedAt: p.maintenanceGuideSentAt || new Date().toLocaleDateString(),
        });
      }
    });
    return guides;
  },

  generateGuide(formData) {
    const projectId = formData.get('projectId');
    const project = AppData.projects.find((p) => p.id === projectId);
    if (!project) return null;

    const guide = {
      id: 'MG-' + (1000 + AppData.projects.length),
      projectId,
      customerName: project.customerName,
      workType: project.workType,
      generatedAt: new Date().toLocaleDateString(),
      content: this.generateGuideContent(project),
    };

    project.maintenanceGuide = guide;
    project.maintenanceGuideSent = true;
    project.maintenanceGuideSentAt = new Date().toISOString();

    return guide;
  },

  generateGuideContent(project) {
    const workType = project.workType;
    const customerName = project.customerName;

    let care24hrs = '';
    let generalMaintenance = '';

    if (workType === 'drainage') {
      care24hrs = 'Keep the drainage area open and uncovered for 24 hours after the work is completed. Avoid driving heavy equipment or vehicles over the drainage area.';
      generalMaintenance = 'Check water flow after heavy rain. Ensure no debris blocks the drainage outlet. Report any pooling or slow drainage immediately.';
    } else if (workType === 'lawns') {
      care24hrs = 'Water newly installed sod or plants daily for the first 2 weeks. Avoid foot traffic on newly landscaped areas.';
      generalMaintenance = 'Mow grass regularly but not shorter than 3 inches. Fertilize after 30 days. Monitor irrigation system coverage weekly.';
    } else if (workType === 'lights') {
      care24hrs = 'Test the WiFi controller and all light channels after installation. Ensure all connections are secure and weatherproof.';
      generalMaintenance = 'Clean light channels quarterly to prevent dirt buildup. Replace bulbs with matching wattage only. Check transformer for moisture ingress monthly.';
    } else {
      care24hrs = 'Follow the specific care instructions provided by your sales person for your custom project.';
      generalMaintenance = 'Regular inspection and maintenance will ensure your project lasts for years. Contact ABC Constructions for any concerns.';
    }

    return `
      # Maintenance Guide — ${project.customerName}
      ## Project: ${project.id}
      ## Work Type: ${project.workType}
      ## Date: ${new Date().toLocaleDateString()}

      ## Care to be Taken Within 24 Hours
      ${care24hrs}

      ## General Maintenance Information
      ${generalMaintenance}

      ## What Should Be Done to Maintain It Well
      - Inspect the work area monthly for any issues
      - Keep the area clean and free of debris
      - Contact ABC Constructions for any repairs or concerns
      - Refer to your original proposal for project specifications

      ---
      Generated by ABC Constructions Enterprise Solution
      Thank you for choosing The ABC Constructions Company!
    `;
  },

  viewGuide(guideId) {
    const guide = this.getGeneratedGuides().find((g) => g.id === guideId);
    if (!guide) return;

    const project = AppData.projects.find((p) => p.id === guide.projectId);
    const content = project ? project.maintenanceGuide.content : 'Guide content not available.';

    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = `
      <div class="modal-overlay" style="display: flex; justify-content: center; align-items: center; padding: 1rem;">
        <div class="modal" style="display: block; max-width: 700px; max-height: 90vh; overflow-y: auto;">
          <div class="modal-header">
            <h3>Maintenance Guide — ${guide.id}</h3>
            <button class="modal-close" onclick="this.closest('.modal-overlay').style.display='none'">&times;</button>
          </div>
          <div class="modal-body" style="padding: 1.5rem; background: white;">
            <div style="white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: var(--text-primary); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; background: #f8fafc;">
              ${content}
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.75rem;">
              <button onclick="this.closest('.modal-overlay').style.display='none'" class="btn btn-secondary">Close</button>
              <button onclick="alert('PDF download would start in production.')" class="btn btn-primary">Download PDF</button>
            </div>
          </div>
        </div>
      </div>
    `;
    overlay.style.display = 'flex';
  },
};
