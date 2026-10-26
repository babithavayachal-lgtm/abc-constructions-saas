/* =========================================
   ABC Constructions — Staff Module
   Staff management by category, attendance,
   salaries, leaves, and calendar view
   ========================================= */

const Staff = {
  _currentCategory: null,
  _view: 'list', // list | attendance | salary | leaves | calendar
  _selectedStaffId: null,

  render() {
    const categories = AppData.getStaffCategories();

    return `
      <div class="page-header">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
          <div>
            <h1 class="page-title">Staff Management</h1>
            <p class="page-subtitle">Manage staff by category, attendance, salaries, leaves, and calendar</p>
          </div>
          <button class="btn btn-primary" onclick="Staff.openAddStaffModal()">+ Add Staff Member</button>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="section" style="margin-bottom:1rem;">
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">
          <button onclick="Staff.setCategory(null)" class="btn btn-sm ${this._currentCategory === null ? 'btn-primary' : 'btn-secondary'}" style="padding:0.375rem 0.75rem;">All Staff</button>
          ${categories.map((cat) => `
            <button onclick="Staff.setCategory('${cat}')" class="btn btn-sm ${this._currentCategory === cat ? 'btn-primary' : 'btn-secondary'}" style="padding:0.375rem 0.75rem;">${cat}</button>
          `).join('')}
        </div>
      </div>

      <!-- View Tabs -->
      <div class="section" style="margin-bottom:1rem;">
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">
          <button onclick="Staff.setView('list')" class="btn btn-sm ${this._view === 'list' ? 'btn-primary' : 'btn-secondary'}">Staff List</button>
          <button onclick="Staff.setView('attendance')" class="btn btn-sm ${this._view === 'attendance' ? 'btn-primary' : 'btn-secondary'}">Attendance</button>
          <button onclick="Staff.setView('salary')" class="btn btn-sm ${this._view === 'salary' ? 'btn-primary' : 'btn-secondary'}">Salaries</button>
          <button onclick="Staff.setView('leaves')" class="btn btn-sm ${this._view === 'leaves' ? 'btn-primary' : 'btn-secondary'}">Leaves</button>
          <button onclick="Staff.setView('calendar')" class="btn btn-sm ${this._view === 'calendar' ? 'btn-primary' : 'btn-secondary'}">Calendar</button>
        </div>
      </div>

      <!-- Content -->
      <div class="section">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                ${this._view === 'list' ? `
                  <th>Name</th>
                  <th>Category</th>
                  <th>Role</th>
                  <th>System Role</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Hire Date</th>
                  <th>Salary</th>
                  <th>Leave Balance</th>
                  <th>Actions</th>
                ` : this._view === 'attendance' ? `
                  <th>Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                ` : this._view === 'salary' ? `
                  <th>Name</th>
                  <th>Category</th>
                  <th>Role</th>
                  <th>Salary (Annual)</th>
                  <th>Monthly</th>
                  <th>Actions</th>
                ` : this._view === 'leaves' ? `
                  <th>Name</th>
                  <th>Category</th>
                  <th>Leave Balance</th>
                  <th>Leaves Taken</th>
                  <th>Remaining</th>
                  <th>Actions</th>
                ` : `
                  <th>Date</th>
                  <th>Staff Member</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                `}
              </tr>
            </thead>
            <tbody id="staff-table-body">
              ${this.renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Staff Modal -->
      <div class="modal" id="add-staff-modal">
        <div class="modal-header">
          <h3>Add Staff Member</h3>
          <button class="modal-close" onclick="Staff.closeAddStaffModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="add-staff-form" style="display: grid; gap: 1rem;">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="e.g. John Smith" required>
            </div>
            <div class="form-group">
              <label>Category</label>
              <select name="category" required>
                <option value="">Select category</option>
                <option value="HR">HR</option>
                <option value="Production">Production</option>
                <option value="Field Crew">Field Crew</option>
                <option value="IT">IT</option>
                <option value="Manager">Manager</option>
                <option value="Customer Service">Customer Service</option>
              </select>
            </div>
            <div class="form-group">
              <label>Role</label>
              <input type="text" name="role" placeholder="e.g. HR Manager" required>
            </div>
            <div class="form-group">
              <label>System Access Role</label>
              <select name="systemRole" required>
                <option value="Staff">Staff (Limited Access)</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin (Full Access)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="john@abcconstructions.com" required>
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="(555) 000-0000" required>
            </div>
            <div class="form-group">
              <label>Annual Salary ($)</label>
              <input type="number" name="salary" placeholder="50000" step="1000" required>
            </div>
            <div class="form-group">
              <label>Hire Date</label>
              <input type="date" name="hireDate" required>
            </div>
            <div class="form-group" style="display: flex; gap: 0.5rem;">
              <button type="submit" class="btn btn-primary btn-block">Add Staff</button>
              <button type="button" class="btn btn-secondary btn-block" onclick="Staff.closeAddStaffModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Mark Attendance Modal -->
      <div class="modal" id="mark-attendance-modal">
        <div class="modal-header">
          <h3>Mark Attendance</h3>
          <button class="modal-close" onclick="Staff.closeMarkAttendanceModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="mark-attendance-form" style="display: grid; gap: 1rem;">
            <div class="form-group">
              <label>Date</label>
              <input type="date" name="date" required>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select name="status" required>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="leave">On Leave</option>
              </select>
            </div>
            <div class="form-group" style="display: flex; gap: 0.5rem;">
              <button type="submit" class="btn btn-primary btn-block">Mark Attendance</button>
              <button type="button" class="btn btn-secondary btn-block" onclick="Staff.closeMarkAttendanceModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Apply Leave Modal -->
      <div class="modal" id="apply-leave-modal">
        <div class="modal-header">
          <h3>Apply for Leave</h3>
          <button class="modal-close" onclick="Staff.closeApplyLeaveModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="apply-leave-form" style="display: grid; gap: 1rem;">
            <div class="form-group">
              <label>Leave Date</label>
              <input type="date" name="leaveDate" required>
            </div>
            <div class="form-group" style="display: flex; gap: 0.5rem;">
              <button type="submit" class="btn btn-primary btn-block">Apply Leave</button>
              <button type="button" class="btn btn-secondary btn-block" onclick="Staff.closeApplyLeaveModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  setCategory(category) {
    this._currentCategory = category;
    App.renderPage('staff');
  },

  setView(view) {
    this._view = view;
    App.renderPage('staff');
  },

  renderTableBody() {
    let staff = AppData.staff;

    if (this._currentCategory) {
      staff = staff.filter((s) => s.category === this._currentCategory);
    }

    if (staff.length === 0) {
      return `<tr><td colspan="10" class="empty-state" style="padding:1rem;">No staff members found.</td></tr>`;
    }

    return staff.map((s) => {
      const stats = AppData.getAttendanceStats(s.id);
      const monthlySalary = (s.salary / 12).toFixed(2);
      const remainingLeave = s.leaveBalance - s.leavesTaken;

      if (this._view === 'list') {
        return `
          <tr>
            <td><strong>${s.name}</strong></td>
            <td><span class="badge badge-info">${s.category}</span></td>
            <td>${s.role}</td>
            <td><span class="badge badge-${s.systemRole === 'Admin' ? 'warning' : s.systemRole === 'Manager' ? 'info' : 'secondary'}">${s.systemRole || 'Staff'}</span></td>
            <td>${s.email}</td>
            <td>${s.phone}</td>
            <td>${new Date(s.hireDate).toLocaleDateString()}</td>
            <td>$${s.salary.toLocaleString()}</td>
            <td>${s.leaveBalance}</td>
            <td>
              <div style="display:flex; gap:0.25rem; flex-direction:column;">
                <button class="btn btn-sm btn-primary" onclick="Staff.selectStaff('${s.id}')" style="padding:0.375rem 0.6rem; font-size:0.75rem;">Attendance</button>
                <button class="btn btn-sm btn-secondary" onclick="Staff.applyLeave('${s.id}')" style="padding:0.375rem 0.6rem; font-size:0.75rem;">Leave</button>
              </div>
            </td>
          </tr>
        `;
      } else if (this._view === 'attendance') {
        if (stats.total === 0) {
          return `
            <tr>
              <td><strong>${s.name}</strong></td>
              <td><span class="badge badge-info">${s.category}</span></td>
              <td colspan="3" style="color:var(--text-muted);">No attendance records</td>
            </tr>
          `;
        }
        return s.attendance.map((a) => `
          <tr>
            <td><strong>${s.name}</strong></td>
            <td><span class="badge badge-info">${s.category}</span></td>
            <td>${new Date(a.date).toLocaleDateString()}</td>
            <td><span class="badge badge-${a.status === 'present' ? 'approved' : a.status === 'absent' ? 'denied' : 'pending'}">${a.status}</span></td>
            <td>
              <button class="btn btn-sm btn-secondary" onclick="Staff.editAttendance('${s.id}', '${a.date}')" style="padding:0.375rem 0.6rem; font-size:0.75rem;">Edit</button>
            </td>
          </tr>
        `).join('');
      } else if (this._view === 'salary') {
        return `
          <tr>
            <td><strong>${s.name}</strong></td>
            <td><span class="badge badge-info">${s.category}</span></td>
            <td>${s.role}</td>
            <td>$${s.salary.toLocaleString()}</td>
            <td>$${monthlySalary}</td>
            <td>
              <button class="btn btn-sm btn-secondary" onclick="Staff.editSalary('${s.id}')" style="padding:0.375rem 0.6rem; font-size:0.75rem;">Edit</button>
            </td>
          </tr>
        `;
      } else if (this._view === 'leaves') {
        return `
          <tr>
            <td><strong>${s.name}</strong></td>
            <td><span class="badge badge-info">${s.category}</span></td>
            <td>${s.leaveBalance}</td>
            <td>${s.leavesTaken}</td>
            <td>${remainingLeave}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="Staff.applyLeave('${s.id}')" style="padding:0.375rem 0.6rem; font-size:0.75rem;">Apply Leave</button>
            </td>
          </tr>
        `;
      } else if (this._view === 'calendar') {
        // Calendar view - show all attendance records
        return s.attendance.map((a) => `
          <tr>
            <td>${new Date(a.date).toLocaleDateString()}</td>
            <td><strong>${s.name}</strong></td>
            <td><span class="badge badge-info">${s.category}</span></td>
            <td><span class="badge badge-${a.status === 'present' ? 'approved' : a.status === 'absent' ? 'denied' : 'pending'}">${a.status}</span></td>
            <td></td>
          </tr>
        `).join('');
      }
    }).join('');
  },

  selectStaff(staffId) {
    this._selectedStaffId = staffId;
    this.setView('attendance');
  },

  openAddStaffModal() {
    document.getElementById('add-staff-modal').classList.add('open');
    document.getElementById('modal-overlay').classList.add('open');
  },

  closeAddStaffModal() {
    document.getElementById('add-staff-modal').classList.remove('open');
    document.getElementById('modal-overlay').classList.remove('open');
    document.getElementById('add-staff-form').reset();
  },

  closeMarkAttendanceModal() {
    document.getElementById('mark-attendance-modal').classList.remove('open');
    document.getElementById('modal-overlay').classList.remove('open');
    document.getElementById('mark-attendance-form').reset();
  },

  closeApplyLeaveModal() {
    document.getElementById('apply-leave-modal').classList.remove('open');
    document.getElementById('modal-overlay').classList.remove('open');
    document.getElementById('apply-leave-form').reset();
  },

  applyLeave(staffId) {
    this._selectedStaffId = staffId;
    document.getElementById('apply-leave-modal').classList.add('open');
    document.getElementById('modal-overlay').classList.add('open');
  },

  editAttendance(staffId, date) {
    this._selectedStaffId = staffId;
    document.getElementById('mark-attendance-form').querySelector('input[name="date"]').value = date;
    document.getElementById('mark-attendance-modal').classList.add('open');
    document.getElementById('modal-overlay').classList.add('open');
  },

  editSalary(staffId) {
    const staff = AppData.getStaffById(staffId);
    if (!staff) return;
    const newSalary = prompt(`Enter new annual salary for ${staff.name}:\nCurrent: $${staff.salary.toLocaleString()}`, staff.salary);
    if (newSalary !== null && !isNaN(newSalary)) {
      staff.salary = parseFloat(newSalary);
      AppData.save();
      FirestoreSync.saveCollection('staff');
      App.renderPage('staff');
      alert('Salary updated.');
    }
  },
};

// Setup event listeners for staff forms
document.addEventListener('DOMContentLoaded', () => {
  // Add staff form
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('#add-staff-form');
    if (!form) return;
    e.preventDefault();
    const formData = new FormData(form);
    const newStaff = {
      id: 'st-' + (100 + AppData.staff.length + 1),
      name: formData.get('name'),
      category: formData.get('category'),
      role: formData.get('role'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      salary: parseFloat(formData.get('salary')),
      hireDate: formData.get('hireDate'),
      systemRole: formData.get('systemRole') || 'Staff',
      attendance: [],
      leaveBalance: 15,
      leavesTaken: 0,
    };
    AppData.addStaffMember(newStaff);
    AppData.save();
    FirestoreSync.saveCollection('staff');
    form.reset();
    Staff.closeAddStaffModal();
    App.renderPage('staff');
    alert(`Staff member ${newStaff.name} added to ${newStaff.category}.`);
  });

  // Mark attendance form
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('#mark-attendance-form');
    if (!form) return;
    e.preventDefault();
    const formData = new FormData(form);
    const staffId = Staff._selectedStaffId;
    if (!staffId) return;
    AppData.recordAttendance(staffId, formData.get('date'), formData.get('status'));
    AppData.save();
    FirestoreSync.saveCollection('staff');
    form.reset();
    Staff.closeMarkAttendanceModal();
    App.renderPage('staff');
    alert('Attendance marked.');
  });

  // Apply leave form
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('#apply-leave-form');
    if (!form) return;
    e.preventDefault();
    const formData = new FormData(form);
    const staffId = Staff._selectedStaffId;
    if (!staffId) return;
    const staff = AppData.getStaffById(staffId);
    if (staff.leavesTaken >= staff.leaveBalance) {
      alert('No leave balance remaining.');
      Staff.closeApplyLeaveModal();
      return;
    }
    AppData.recordAttendance(staffId, formData.get('leaveDate'), 'leave');
    staff.leavesTaken += 1;
    AppData.save();
    FirestoreSync.saveCollection('staff');
    form.reset();
    Staff.closeApplyLeaveModal();
    App.renderPage('staff');
    alert('Leave applied.');
  });
});
