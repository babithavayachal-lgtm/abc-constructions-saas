/* =========================================
   ABC Constructions — Completed Projects Module
   ========================================= */

const Completed = {
  render() {
    const completedProjects = AppData.getProjectsByStatus('completed');

    return `
      <div class="page-header">
        <h1 class="page-title">Completed Projects</h1>
        <p class="page-subtitle">Finished jobs with final payment and closure status</p>
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
                <th>Deposit Paid</th>
                <th>Final Payment</th>
                <th>Payment Status</th>
                <th>Completion Date</th>
                <th>On Time</th>
                <th>Inspection</th>
              </tr>
            </thead>
            <tbody>
              ${completedProjects.map((p) => {
    const paymentBadge = p.paymentStatus === 'paid' ? 'badge-paid' : p.paymentStatus === 'partial' ? 'badge-partial' : 'badge-unpaid';
    const onTimeClass = p.onTime ? 'badge-on-time' : 'badge-delayed';
    return `
                  <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.customerName}</td>
                    <td>${p.workType}</td>
                    <td>$${p.jobValue.toLocaleString()}</td>
                    <td>$${p.depositPaid.toLocaleString()}</td>
                    <td>$${p.remainingBalance.toLocaleString()}</td>
                    <td><span class="badge ${paymentBadge}">${p.paymentStatus}</span></td>
                    <td>${p.completionDate}</td>
                    <td><span class="badge ${onTimeClass}">${p.onTime ? 'On Time' : 'Delayed'}</span></td>
                    <td><span class="badge badge-${p.inspectionStatus}">${p.inspectionStatus}</span></td>
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
