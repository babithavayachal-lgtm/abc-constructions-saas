/* =========================================
   ABC Constructions — Jobs Module (WIP)
   ========================================= */

const Jobs = {
  render() {
    const wipProjects = AppData.getProjectsByStatus('wip');

    return `
      <div class="page-header">
        <h1 class="page-title">Jobs (WIP)</h1>
        <p class="page-subtitle">All work-in-progress jobs with scheduling and status tracking</p>
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
                <th>Deposit (50%)</th>
                <th>Remaining Balance</th>
                <th>Payment Status</th>
                <th>Sales Person</th>
                <th>Scheduled Date</th>
                <th>Permit</th>
                <th>On Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${wipProjects.map((p) => {
    const deposit = (p.jobValue * 0.5).toFixed(2);
    const paymentBadge = p.paymentStatus === 'partial' ? 'badge-partial' : p.paymentStatus === 'paid' ? 'badge-paid' : 'badge-unpaid';
    const permitBadge = p.permitReceived ? 'badge-approved' : 'badge-pending';
    const onTimeClass = p.onTime ? 'badge-on-time' : 'badge-delayed';
    const salesPerson = AppData.getSalesPersonName(p.salesPerson);
    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td>${p.workType}</td>
                    <td>$${p.jobValue.toLocaleString()}</td>
                    <td>$${deposit}</td>
                    <td>$${p.remainingBalance.toLocaleString()}</td>
                    <td><span class="badge ${paymentBadge}">${p.paymentStatus}</span></td>
                    <td>${salesPerson}</td>
                    <td>${p.scheduledDate}</td>
                    <td><span class="badge ${permitBadge}">${p.permitReceived ? 'Received' : 'Pending'}</span></td>
                    <td><span class="badge ${onTimeClass}">${p.onTime ? 'On Time' : 'Delayed'}</span></td>
                    <td>
                      <button class="btn btn-sm btn-primary">View Details</button>
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
};
