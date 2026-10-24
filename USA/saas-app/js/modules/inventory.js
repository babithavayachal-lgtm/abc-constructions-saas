/* =========================================
   ABC Constructions — Inventory Module
   Trim Light supplier credits and dynamic inventory
   ========================================= */

const Inventory = {
  render() {
    const items = AppData.inventory;

    return `
      <div class="page-header">
        <h1 class="page-title">Inventory</h1>
        <p class="page-subtitle">Dynamic inventory tracking from Trim Light supplier credits</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Items</div>
          <div class="stat-value">${items.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Low Stock</div>
          <div class="stat-value">${items.filter(i => i.quantity <= i.minThreshold).length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">In Stock</div>
          <div class="stat-value">${items.filter(i => i.quantity > i.minThreshold).length}</div>
        </div>
      </div>

      <div class="section">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Min Threshold</th>
                <th>Unit Cost</th>
                <th>Supplier</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item) => {
    const lowStock = item.quantity <= item.minThreshold;
    const badgeClass = lowStock ? 'badge-danger' : 'badge-success';
    const badgeText = lowStock ? 'Low Stock' : 'In Stock';
    return `
                  <tr>
                    <td><strong>${item.item}</strong></td>
                    <td>${item.sku}</td>
                    <td>${item.quantity}</td>
                    <td>${item.minThreshold}</td>
                    <td>$${item.unitCost.toFixed(2)}</td>
                    <td>${item.supplier}</td>
                    <td><span class="badge ${badgeClass}">${badgeText}</span></td>
                    <td>
                      <button class="btn btn-sm btn-primary">Restock</button>
                    </td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Supplier Credits (Trim Light Co.)</h2>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Credit Type</th>
                <th>Available Credits</th>
                <th>Used Credits</th>
                <th>Remaining</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Trim Light Co.</strong></td>
                <td>Lighting Materials</td>
                <td>$5,000.00</td>
                <td>$2,350.00</td>
                <td>$2,650.00</td>
                <td><span class="badge badge-approved">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
};
