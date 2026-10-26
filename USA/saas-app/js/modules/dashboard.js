/* =========================================
   ABC Constructions — Dashboard Module
   Executive Operations & Financial Dashboard
   - Compact 2-column upper split (KPIs + Donut Chart)
   - Unified WIP & Completed project ledger with interactive filters
   - Full column totals row (Full Value, Advance Paid, Pending Amount)
   ========================================= */

const Dashboard = {
  activeFilter: 'all', // 'all' | 'wip' | 'completed' | 'pending_payment'
  chartMetric: 'status', // 'status' | 'revenue' | 'workType'
  searchQuery: '',

  render() {
    const stats = AppData.getDashboardStats();
    const projects = AppData.projects || [];
    const content = document.getElementById('dashboard-content');
    if (!content) return;

    // Filter counts for badges
    const allCount = projects.length;
    const wipCount = projects.filter((p) => p.status === 'wip').length;
    const completedCount = projects.filter((p) => p.status === 'completed').length;
    const pendingCount = projects.filter((p) => p.status === 'pending_payment').length;

    // Financial totals across all projects
    const totalJobValue = projects.reduce((sum, p) => sum + (Number(p.jobValue) || 0), 0);
    const totalDepositPaid = projects.reduce((sum, p) => sum + (Number(p.depositPaid) || 0), 0);
    const totalPendingBalance = projects.reduce((sum, p) => sum + (Number(p.remainingBalance) || 0), 0);

    // Schedule adherence percentage
    const onTimeProjects = projects.filter((p) => p.onTime).length;
    const onTimeRate = allCount > 0 ? Math.round((onTimeProjects / allCount) * 100) : 100;

    content.innerHTML = `
      <div class="page-header" style="margin-bottom:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 class="page-title" style="font-size:1.5rem; margin-bottom:0.25rem;">Executive Operations & Financial Dashboard</h1>
            <p class="page-subtitle" style="font-size:0.8125rem;">Consolidated real-time tracking of WIP, Completed jobs, Cashflow, and Receivables</p>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button class="btn btn-sm btn-secondary" onclick="Dashboard.refreshData()" title="Reload Firestore and Local Data">
              <span>🔄</span> Refresh
            </button>
            <button class="btn btn-sm btn-primary" onclick="App.showModal('add-project-modal')">
              <span>➕</span> New Project
            </button>
          </div>
        </div>
      </div>

      <!-- Upper Half: Compact Split (Left: Compact Metric Cards | Right: Interactive Donut Chart) -->
      <div class="dashboard-hero-split">
        <!-- Left: 6 Compact KPI Tiles -->
        <div class="compact-stats-grid">
          <div class="compact-stat-card" style="border-left: 3px solid var(--primary);">
            <div>
              <div class="stat-label"><span>💼</span> Total Contract Value</div>
              <div class="stat-value">$${totalJobValue.toLocaleString()}</div>
            </div>
            <div class="stat-sub neutral">
              <span>${allCount} total portfolio projects</span>
            </div>
          </div>

          <div class="compact-stat-card" style="border-left: 3px solid var(--success);">
            <div>
              <div class="stat-label"><span>💵</span> 50% Advance Collected</div>
              <div class="stat-value" style="color:var(--text-success);">$${totalDepositPaid.toLocaleString()}</div>
            </div>
            <div class="stat-sub positive">
              <span>Realized cash in bank</span>
            </div>
          </div>

          <div class="compact-stat-card" style="border-left: 3px solid var(--warning);">
            <div>
              <div class="stat-label"><span>⏳</span> Pending Receivables</div>
              <div class="stat-value" style="color:var(--text-warning);">$${totalPendingBalance.toLocaleString()}</div>
            </div>
            <div class="stat-sub warning">
              <span>Upcoming milestone payments</span>
            </div>
          </div>

          <div class="compact-stat-card" style="border-left: 3px solid var(--info);">
            <div>
              <div class="stat-label"><span>🏗️</span> WIP Active Jobs</div>
              <div class="stat-value" style="color:var(--text-info);">${wipCount}</div>
            </div>
            <div class="stat-sub info">
              <span>Active crew deployments</span>
            </div>
          </div>

          <div class="compact-stat-card" style="border-left: 3px solid var(--success);">
            <div>
              <div class="stat-label"><span>✅</span> Completed Jobs</div>
              <div class="stat-value" style="color:var(--text-success);">${completedCount}</div>
            </div>
            <div class="stat-sub positive">
              <span>Delivered & closed</span>
            </div>
          </div>

          <div class="compact-stat-card" style="border-left: 3px solid ${onTimeRate >= 80 ? 'var(--success)' : 'var(--danger)'};">
            <div>
              <div class="stat-label"><span>⏱️</span> Schedule Health</div>
              <div class="stat-value">${onTimeRate}%</div>
            </div>
            <div class="stat-sub ${onTimeRate >= 80 ? 'positive' : 'warning'}">
              <span>${stats.onTime} on time &bull; ${stats.delayed} delayed</span>
            </div>
          </div>
        </div>

        <!-- Right: Interactive Donut Chart -->
        <div class="dashboard-donut-card">
          <div class="donut-card-header">
            <div class="donut-card-title">
              <span>📊</span> Breakdown
            </div>
            <div class="donut-card-toggles">
              <button class="donut-toggle-btn ${this.chartMetric === 'status' ? 'active' : ''}" onclick="Dashboard.setChartMetric('status')">Status</button>
              <button class="donut-toggle-btn ${this.chartMetric === 'revenue' ? 'active' : ''}" onclick="Dashboard.setChartMetric('revenue')">Revenue</button>
              <button class="donut-toggle-btn ${this.chartMetric === 'workType' ? 'active' : ''}" onclick="Dashboard.setChartMetric('workType')">Service</button>
            </div>
          </div>
          <div id="dashboard-donut-container">
            ${this.renderDonutContent()}
          </div>
        </div>
      </div>

      <!-- Consolidated Projects & Receivables Hub (WIP + Completed on One Screen) -->
      <div class="section" style="margin-bottom:1.5rem;">
        <div class="projects-toolbar">
          <div class="project-filter-pills">
            <button class="filter-pill ${this.activeFilter === 'all' ? 'active' : ''}" onclick="Dashboard.setFilter('all')">
              <span>All Projects</span>
              <span class="pill-count">${allCount}</span>
            </button>
            <button class="filter-pill ${this.activeFilter === 'wip' ? 'active' : ''}" onclick="Dashboard.setFilter('wip')">
              <span>🏗️ WIP (Active)</span>
              <span class="pill-count">${wipCount}</span>
            </button>
            <button class="filter-pill ${this.activeFilter === 'completed' ? 'active' : ''}" onclick="Dashboard.setFilter('completed')">
              <span>✅ Completed</span>
              <span class="pill-count">${completedCount}</span>
            </button>
            <button class="filter-pill ${this.activeFilter === 'pending_payment' ? 'active' : ''}" onclick="Dashboard.setFilter('pending_payment')">
              <span>⏳ Pending Payment</span>
              <span class="pill-count">${pendingCount}</span>
            </button>
          </div>

          <div class="projects-search-box">
            <span class="projects-search-icon">🔍</span>
            <input
              type="text"
              class="projects-search-input"
              placeholder="Filter by customer, ID, or service..."
              value="${this.searchQuery}"
              oninput="Dashboard.onSearchInput(this.value)"
            />
          </div>
        </div>

        <div class="table-container" id="projects-table-container">
          ${this.renderProjectsTable()}
        </div>
      </div>

      <!-- Operational Permits Alert Bar -->
      <div class="section">
        <div class="section-header" style="margin-bottom:0.75rem;">
          <h2 class="section-title" style="font-size:1rem; display:flex; align-items:center; gap:0.5rem;">
            <span>📋</span> Operational Permits & Compliance
          </h2>
          <span style="font-size:0.75rem; color:var(--text-muted);">${(AppData.permits || []).length} active permits</span>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Permit ID</th>
                <th>Project Ref</th>
                <th>Customer</th>
                <th>Work Type</th>
                <th>Permit Status</th>
                <th>Issuing Portal</th>
                <th>Received Date</th>
              </tr>
            </thead>
            <tbody>
              ${(AppData.permits || []).map((permit) => `
                <tr>
                  <td><strong>${permit.id}</strong></td>
                  <td>${permit.projectId || '—'}</td>
                  <td>${permit.customerName}</td>
                  <td><span class="badge badge-${permit.workType}">${permit.workType}</span></td>
                  <td><span class="badge badge-${permit.status}">${permit.status}</span></td>
                  <td>${permit.portal}</td>
                  <td>${permit.receivedAt || 'Pending State Approval'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // Get currently filtered list of projects based on tab and search
  getFilteredProjects() {
    let list = AppData.projects || [];

    if (this.activeFilter === 'wip') {
      list = list.filter((p) => p.status === 'wip');
    } else if (this.activeFilter === 'completed') {
      list = list.filter((p) => p.status === 'completed');
    } else if (this.activeFilter === 'pending_payment') {
      list = list.filter((p) => p.status === 'pending_payment');
    }

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter((p) =>
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.customerName && p.customerName.toLowerCase().includes(q)) ||
        (p.workType && p.workType.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q))
      );
    }

    return list;
  },

  // Renders the table along with the comprehensive column totals row
  renderProjectsTable() {
    const list = this.getFilteredProjects();

    // Compute column totals dynamically for the filtered set
    const totalJobValue = list.reduce((sum, p) => sum + (Number(p.jobValue) || 0), 0);
    const totalDepositPaid = list.reduce((sum, p) => sum + (Number(p.depositPaid) || 0), 0);
    const totalRemainingBalance = list.reduce((sum, p) => sum + (Number(p.remainingBalance) || 0), 0);

    if (list.length === 0) {
      return `
        <div style="padding:2.5rem 1rem; text-align:center; color:var(--text-muted);">
          <div style="font-size:2rem; margin-bottom:0.5rem;">🔍</div>
          <div style="font-weight:600; font-size:0.95rem; color:var(--text-primary);">No projects match the selected criteria</div>
          <p style="font-size:0.8125rem; margin-top:0.25rem;">Try adjusting the filter pills or clear your search term.</p>
        </div>
      `;
    }

    return `
      <table class="table">
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Customer & Site</th>
            <th>Work Type</th>
            <th>Status</th>
            <th>Schedule / Completion</th>
            <th style="text-align:right;">Project Full Value</th>
            <th style="text-align:right;">Advance Paid (50%)</th>
            <th style="text-align:right;">Pending Amount</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${list.map((p) => this.projectRow(p)).join('')}
        </tbody>
        <tfoot>
          <!-- Prominent Totals Row for Revenue, Cash Collected, and Upcoming Receivables -->
          <tr class="table-totals-row">
            <td colspan="5">
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <span style="font-size:1.25rem;">📈</span>
                <div>
                  <div class="table-totals-label">
                    COLUMN TOTALS (${list.length} ${list.length === 1 ? 'Project' : 'Projects'} Displayed)
                  </div>
                  <div class="total-cell-sub">
                    Real-time monthly revenue, deposits collected, and upcoming receivables
                  </div>
                </div>
              </div>
            </td>
            <td style="text-align:right;">
              <div class="total-cell-val full-val">$${totalJobValue.toLocaleString()}</div>
              <div class="total-cell-sub">Total Full Value</div>
            </td>
            <td style="text-align:right;">
              <div class="total-cell-val paid-val">$${totalDepositPaid.toLocaleString()}</div>
              <div class="total-cell-sub">Deposits In Bank</div>
            </td>
            <td style="text-align:right;">
              <div class="total-cell-val pending-val">$${totalRemainingBalance.toLocaleString()}</div>
              <div class="total-cell-sub">Upcoming Due</div>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    `;
  },

  projectRow(p) {
    const paymentBadge = p.paymentStatus === 'paid' ? 'badge-paid' : p.paymentStatus === 'partial' ? 'badge-partial' : 'badge-unpaid';
    const statusBadge = p.status === 'wip' ? 'badge-wip' : p.status === 'completed' ? 'badge-completed' : 'badge-pending';
    const statusLabel = p.status === 'wip' ? 'WIP (Active)' : p.status === 'completed' ? 'Completed' : 'Pending Payment';
    const workTypeClass = `badge-${p.workType || 'drainage'}`;

    const dateDisplay = p.status === 'completed' && p.completionDate
      ? `Completed: ${p.completionDate}`
      : `Scheduled: ${p.scheduledDate || '—'}`;

    const proposalUrl = p.proposalLink || `proposal.html?id=${p.id}`;

    return `
      <tr>
        <td>
          <strong>${p.id}</strong>
        </td>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${p.customerName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${p.address || 'Austin, TX'}</div>
        </td>
        <td>
          <span class="badge ${workTypeClass}">${p.workType || 'Service'}</span>
        </td>
        <td>
          <span class="badge ${statusBadge}">${statusLabel}</span>
        </td>
        <td>
          <div style="font-size:0.8125rem; font-weight:600;">${dateDisplay}</div>
          <div style="font-size:0.7rem; color:${p.onTime ? 'var(--text-success)' : 'var(--text-danger)'};">
            ${p.onTime ? '● On Schedule' : '▲ Behind Schedule'}
          </div>
        </td>
        <td style="text-align:right;">
          <div style="font-weight:700; font-size:0.9375rem; color:var(--text-primary);">
            $${Number(p.jobValue || 0).toLocaleString()}
          </div>
        </td>
        <td style="text-align:right;">
          <div style="font-weight:700; font-size:0.9375rem; color:var(--text-success);">
            $${Number(p.depositPaid || 0).toLocaleString()}
          </div>
          <div style="font-size:0.6875rem; color:var(--text-muted);">
            ${p.depositPaid > 0 ? '50% Collected' : 'Awaiting Deposit'}
          </div>
        </td>
        <td style="text-align:right;">
          <div style="font-weight:700; font-size:0.9375rem; color:var(--text-warning);">
            $${Number(p.remainingBalance || 0).toLocaleString()}
          </div>
          <div style="font-size:0.6875rem; color:var(--text-muted);">
            ${p.remainingBalance > 0 ? 'Balance Pending' : 'Fully Settled'}
          </div>
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:0.35rem; align-items:center;">
            <a href="${proposalUrl}" target="_blank" class="btn btn-sm btn-secondary" title="Open Customer Proposal & Contract" style="padding:0.25rem 0.5rem; font-size:0.75rem;">
              📄 Proposal
            </a>
            <button class="btn btn-sm btn-primary" onclick="App.navigateTo('jobs')" title="View Job Details" style="padding:0.25rem 0.5rem; font-size:0.75rem;">
              View
            </button>
          </div>
        </td>
      </tr>
    `;
  },

  // Generates data breakdown for the Donut Chart based on current metric
  getDonutData() {
    const projects = AppData.projects || [];

    if (this.chartMetric === 'status') {
      const wip = projects.filter((p) => p.status === 'wip');
      const completed = projects.filter((p) => p.status === 'completed');
      const pending = projects.filter((p) => p.status === 'pending_payment');

      const items = [
        { label: 'WIP (Active)', count: wip.length, color: '#0284c7', sub: `$${wip.reduce((s, p) => s + (p.jobValue || 0), 0).toLocaleString()}` },
        { label: 'Completed', count: completed.length, color: '#059669', sub: `$${completed.reduce((s, p) => s + (p.jobValue || 0), 0).toLocaleString()}` },
        { label: 'Pending Payment', count: pending.length, color: '#d97706', sub: `$${pending.reduce((s, p) => s + (p.jobValue || 0), 0).toLocaleString()}` },
      ].filter((item) => item.count > 0);

      const totalCount = projects.length;
      return {
        items,
        total: totalCount,
        centerVal: `${totalCount}`,
        centerLabel: 'Total Jobs',
      };
    } else if (this.chartMetric === 'revenue') {
      const paid = projects.reduce((s, p) => s + (Number(p.depositPaid) || 0), 0);
      const pending = projects.reduce((s, p) => s + (Number(p.remainingBalance) || 0), 0);
      const total = paid + pending;

      const items = [
        { label: 'Advance Paid', count: paid, color: '#059669', sub: `$${paid.toLocaleString()}` },
        { label: 'Pending Due', count: pending, color: '#d97706', sub: `$${pending.toLocaleString()}` },
      ];

      return {
        items,
        total: total || 1,
        centerVal: `$${Math.round(total / 1000)}k`,
        centerLabel: 'Gross Value',
      };
    } else {
      // workType
      const types = {};
      const colors = {
        drainage: '#0284c7',
        lawns: '#10b981',
        lights: '#8b5cf6',
        mixed: '#f59e0b',
      };

      projects.forEach((p) => {
        const wt = p.workType || 'drainage';
        if (!types[wt]) {
          types[wt] = { count: 0, val: 0 };
        }
        types[wt].count++;
        types[wt].val += Number(p.jobValue || 0);
      });

      const items = Object.keys(types).map((wt) => {
        const cap = wt.charAt(0).toUpperCase() + wt.slice(1);
        return {
          label: cap,
          count: types[wt].count,
          color: colors[wt] || '#64748b',
          sub: `$${types[wt].val.toLocaleString()}`,
        };
      });

      const totalCount = projects.length;
      return {
        items,
        total: totalCount,
        centerVal: `${totalCount}`,
        centerLabel: 'By Service',
      };
    }
  },

  renderDonutContent() {
    const data = this.getDonutData();
    const radius = 50;
    const circumference = 2 * Math.PI * radius; // ~314.159
    let currentOffset = 0;

    const segmentsSvg = data.items.map((item) => {
      const pct = data.total > 0 ? (item.count / data.total) : 0;
      const dashLength = pct * circumference;
      const strokeDasharray = `${dashLength} ${circumference}`;
      const strokeDashoffset = -currentOffset;
      currentOffset += dashLength;

      const pctFormatted = Math.round(pct * 100);

      return `
        <circle
          class="donut-segment"
          cx="70"
          cy="70"
          r="${radius}"
          stroke="${item.color}"
          stroke-dasharray="${strokeDasharray}"
          stroke-dashoffset="${strokeDashoffset}"
          data-label="${item.label}"
          data-val="${item.sub}"
          data-pct="${pctFormatted}%"
          onmouseenter="Dashboard.onHoverSegment('${item.label}', '${item.sub}', '${pctFormatted}%')"
          onmouseleave="Dashboard.onLeaveSegment()"
        />
      `;
    }).join('');

    const legendHtml = data.items.map((item) => {
      const pct = data.total > 0 ? Math.round((item.count / data.total) * 100) : 0;
      return `
        <div class="donut-legend-item"
          onmouseenter="Dashboard.onHoverSegment('${item.label}', '${item.sub}', '${pct}%')"
          onmouseleave="Dashboard.onLeaveSegment()"
        >
          <div class="donut-legend-left">
            <span class="donut-legend-dot" style="background:${item.color};"></span>
            <span>${item.label}</span>
          </div>
          <div class="donut-legend-right">
            <span>${item.sub}</span>
            <span style="font-size:0.6875rem; color:var(--text-muted); font-weight:normal; margin-left:3px;">(${pct}%)</span>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="donut-chart-layout">
        <div class="donut-svg-container">
          <svg class="donut-svg" viewBox="0 0 140 140" style="transform: rotate(-90deg);">
            <!-- Background base circle -->
            <circle cx="70" cy="70" r="${radius}" fill="none" stroke="var(--border)" stroke-width="16" />
            <!-- Coloured segments -->
            ${segmentsSvg}
          </svg>
          <div class="donut-center-info">
            <div class="donut-center-val" id="donut-center-val">${data.centerVal}</div>
            <div class="donut-center-label" id="donut-center-label">${data.centerLabel}</div>
          </div>
        </div>
        <div class="donut-legend">
          ${legendHtml}
        </div>
      </div>
    `;
  },

  onHoverSegment(label, sub, pct) {
    const valElem = document.getElementById('donut-center-val');
    const labelElem = document.getElementById('donut-center-label');
    if (valElem && labelElem) {
      valElem.textContent = pct;
      labelElem.textContent = label;
    }
  },

  onLeaveSegment() {
    const data = this.getDonutData();
    const valElem = document.getElementById('donut-center-val');
    const labelElem = document.getElementById('donut-center-label');
    if (valElem && labelElem) {
      valElem.textContent = data.centerVal;
      labelElem.textContent = data.centerLabel;
    }
  },

  setFilter(filter) {
    this.activeFilter = filter;
    this.render();
  },

  setChartMetric(metric) {
    this.chartMetric = metric;
    const container = document.getElementById('dashboard-donut-container');
    if (container) {
      container.innerHTML = this.renderDonutContent();
      // Update toggle buttons active class
      document.querySelectorAll('.donut-toggle-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(metric === 'workType' ? 'service' : metric));
      });
    } else {
      this.render();
    }
  },

  onSearchInput(val) {
    this.searchQuery = val;
    const tableContainer = document.getElementById('projects-table-container');
    if (tableContainer) {
      tableContainer.innerHTML = this.renderProjectsTable();
    }
  },

  refreshData() {
    if (typeof AppData !== 'undefined' && AppData.load) {
      AppData.load();
    }
    this.render();
  },
};
