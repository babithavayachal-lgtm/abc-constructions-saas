/* =========================================
   ABC Constructions — Sales Team Module
   Sales persons, commissions, and change order splits
   ========================================= */

const Sales = {
  render() {
    const team = AppData.salesTeam;

    // Calculate stats per sales person
    const salesStats = team.map((person) => {
      const originalProjects = AppData.projects.filter(p => p.salesPerson === person.id);
      const changeOrderProjects = AppData.projects.filter(p => p.changeOrderSalesPerson === person.id);
      const totalOriginalValue = originalProjects.reduce((sum, p) => sum + p.jobValue, 0);
      const totalChangeOrderValue = changeOrderProjects.reduce((sum, p) => sum + p.jobValue, 0);
      const commissionOriginal = totalOriginalValue * (person.commissionRate / 100);
      const commissionChangeOrder = totalChangeOrderValue * (person.commissionRate / 100);

      return {
        ...person,
        originalProjects: originalProjects.length,
        changeOrderProjects: changeOrderProjects.length,
        totalOriginalValue,
        totalChangeOrderValue,
        commissionOriginal,
        commissionChangeOrder,
        totalCommission: commissionOriginal + commissionChangeOrder,
      };
    });

    return `
      <div class="page-header">
        <h1 class="page-title">Sales Team</h1>
        <p class="page-subtitle">Sales persons, commissions, and change order splits</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Sales Persons</div>
          <div class="stat-value">${team.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Commission</div>
          <div class="stat-value">$${salesStats.reduce((s, p) => s + p.totalCommission, 0).toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Projects Handled</div>
          <div class="stat-value">${AppData.projects.length}</div>
        </div>
      </div>

      <div class="section">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Original Projects</th>
                <th>Change Order Projects</th>
                <th>Original Value</th>
                <th>Change Order Value</th>
                <th>Commission Rate</th>
                <th>Total Commission</th>
              </tr>
            </thead>
            <tbody>
              ${salesStats.map((s) => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td>${s.role}</td>
                  <td>${s.originalProjects}</td>
                  <td>${s.changeOrderProjects}</td>
                  <td>$${s.totalOriginalValue.toLocaleString()}</td>
                  <td>$${s.totalChangeOrderValue.toLocaleString()}</td>
                  <td>${s.commissionRate}%</td>
                  <td>$${s.totalCommission.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Commission Split Rules</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Commission Split</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Original Sales Person</strong></td>
                <td>20%</td>
                <td>Sales person who dealt with the first order gets 20% commission on the value of the project.</td>
              </tr>
              <tr>
                <td><strong>Change Order by Same Sales Person</strong></td>
                <td>20%</td>
                <td>Same sales person gets full 20% on change order value.</td>
              </tr>
              <tr>
                <td><strong>Change Order by Other Sales Person</strong></td>
                <td>10% / 10%</td>
                <td>Commission split between the original sales person and the sales person who created the change order.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
};
