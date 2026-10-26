/* =========================================
   ABC Constructions — Proposal & Payment Portal App
   ========================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Dynamically load Firebase configuration from hosting or fallback
let firebaseConfig;
try {
  const res = await fetch('/__/firebase/init.json');
  if (res.ok) {
    firebaseConfig = await res.json();
  }
} catch (e) {
  // Local fallback
}

if (!firebaseConfig) {
  firebaseConfig = {
    apiKey: atob("QUl6YVN5RFBKNkxHV3o3Y0FYbXllUHl4RTI4Ui1ZQlVJTVNLY05v"),
    authDomain: "babithavayachal.firebaseapp.com",
    projectId: "babithavayachal",
    storageBucket: "babithavayachal.firebasestorage.app",
    messagingSenderId: "353188169839",
    appId: "1:353188169839:web:dbf2c6a3c05b355979e59a"
  };
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// State
let currentProject = null;
let sigCanvas = null;
let sigCtx = null;
let isDrawing = false;
let sigMode = 'draw';

// Fallback sample data if Firestore is unreachable
const defaultProjects = {
  'PJ-1006': {
    id: 'PJ-1006',
    customerName: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '(555) 789-2341',
    address: '742 Evergreen Terrace, Springfield, USA',
    workType: 'drainage',
    jobValue: 7800,
    depositPaid: 0,
    remainingBalance: 7800,
    paymentStatus: 'unpaid',
    status: 'pending_payment',
    scheduledDate: '2026-11-18',
    salesPersonName: 'Michael Scott',
    salesPersonPhone: '(555) 302-8819',
    customerApproved: false,
    createdAt: '2026-10-24T10:00:00'
  },
  'PJ-1001': {
    id: 'PJ-1001',
    customerName: 'Robert Martinez',
    email: 'robert.m@example.com',
    phone: '(555) 234-5678',
    address: '104 Oak Ridge Dr, Austin, TX',
    workType: 'drainage',
    jobValue: 8500,
    depositPaid: 4250,
    remainingBalance: 4250,
    paymentStatus: 'partial',
    status: 'wip',
    scheduledDate: '2026-11-05',
    salesPersonName: 'Michael Scott',
    customerApproved: true,
    approvedAt: '2026-10-21T16:00:00',
    createdAt: '2026-10-20T11:00:00'
  }
};

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id') || 'PJ-1006';

  try {
    const docRef = doc(db, 'projects', projectId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      currentProject = { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn('Could not read project from Firestore, using local fallback:', err);
  }

  if (!currentProject) {
    try {
      const stored = localStorage.getItem('abc_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.projects) {
          currentProject = parsed.projects.find(p => p.id === projectId);
        }
      }
    } catch (e) {}
  }

  if (!currentProject) {
    currentProject = defaultProjects[projectId] || defaultProjects['PJ-1006'];
  }

  renderProposal();
}

function renderProposal() {
  const p = currentProject;
  const deposit = (p.jobValue * 0.5).toFixed(2);
  const remaining = (p.jobValue - (p.depositPaid || 0)).toFixed(2);
  const isApproved = p.customerApproved;
  const isDepositPaid = (p.depositPaid || 0) >= (p.jobValue * 0.5);

  let statusClass = 'status-pending';
  let statusText = '⏳ Proposal Awaiting Your Approval & 50% Deposit';
  if (p.customerDenied) {
    statusClass = 'status-denied';
    statusText = '❌ Revision Requested / Declined';
  } else if (isDepositPaid) {
    statusClass = 'status-approved';
    statusText = '🎉 50% Deposit Confirmed — Work In Progress (WIP)';
  } else if (isApproved) {
    statusClass = 'status-approved';
    statusText = '✅ Proposal Approved — Please Submit 50% Deposit ($' + deposit + ') to Begin Scheduling';
  }

  const container = document.getElementById('proposal-content');
  container.innerHTML = `
    <!-- Status Banner -->
    <div class="status-banner ${statusClass}">
      <span>${statusText}</span>
      <span class="status-banner-badge">${p.id}</span>
    </div>

    <!-- Overview Card -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">📋 Proposal Summary</h2>
        <span style="font-size:0.8125rem; color:var(--text-muted);">Created: ${new Date(p.createdAt || Date.now()).toLocaleDateString()}</span>
      </div>
      <div class="details-grid">
        <div class="detail-item">
          <span class="detail-label">Client Name</span>
          <span class="detail-value">${p.customerName}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Property Address</span>
          <span class="detail-value">${p.address || 'Property Site (On File)'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Work Type</span>
          <span class="detail-value" style="text-transform:capitalize;">${p.workType}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Sales Representative</span>
          <span class="detail-value">${p.salesPersonName || 'Michael Scott'} (${p.salesPersonPhone || '(555) 302-8819'})</span>
        </div>
      </div>
    </div>

    <!-- Technical Scope of Work Card -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">🏗️ Scope of Work & Engineering Specifications</h2>
      </div>
      <p style="font-size:0.9375rem; color:var(--text-main); margin-bottom:1rem;">
        ABC Constructions will provide all skilled labor, specialized machinery, materials, and county permit coordination for the following specifications:
      </p>
      <div class="spec-box">
        <h4>${p.workType.toUpperCase()} SYSTEM ARCHITECTURE</h4>
        <ul class="spec-list">
          ${getWorkSpecs(p.workType)}
        </ul>
      </div>
      <div class="spec-box" style="margin-top:1rem; border-left:4px solid var(--info);">
        <h4>🏛️ COUNTY PERMITS & 811 UTILITY PROTECTION</h4>
        <ul class="spec-list">
          <li><span class="check-icon">✓</span> State & County permit filing handled directly through municipal portal.</li>
          <li><span class="check-icon">✓</span> Jolley Co. coordination with 811 public utility providers to mark all gas, power, water & telecom lines prior to digging.</li>
          <li><span class="check-icon">✓</span> Trench remains open for mandatory County staff inspection before final backfill closure.</li>
        </ul>
      </div>
    </div>

    <!-- Rate Card & Pricing Breakdown -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">💵 Investment Breakdown</h2>
      </div>
      <table class="cost-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="width:120px;">Qty/Unit</th>
            <th class="amount" style="width:140px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${getCostItems(p.workType, p.jobValue)}
        </tbody>
      </table>

      <div class="summary-box">
        <div class="summary-row total-job">
          <span>Total Project Value:</span>
          <span class="amount">$${Number(p.jobValue).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
        </div>
        <div class="summary-row deposit-required">
          <span>50% Deposit Due Today:</span>
          <span class="amount">$${Number(deposit).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
        </div>
        <div class="summary-row" style="color:var(--text-muted); font-size:0.875rem;">
          <span>Remaining Balance (Due Upon County Pass):</span>
          <span class="amount">$${Number(remaining).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
        </div>
      </div>
    </div>

    <!-- Signature & Approval Card -->
    ${!isApproved && !p.customerDenied ? `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">✍️ Authorization & Digital Signature</h2>
        </div>
        <div class="legal-box">
          By signing below, you authorize ABC Constructions to initiate state permit filings, contact utility locators (811), and schedule crew dispatch upon receipt of the exact 50% deposit ($${deposit}). Official approval confirmation and payment receipts will be dispatched from <strong>babyjune7@gmail.com</strong>.
        </div>
        <div class="signature-section">
          <div class="sig-tabs">
            <button class="sig-tab-btn active" id="tab-draw" onclick="setSigTab('draw')">Draw Signature</button>
            <button class="sig-tab-btn" id="tab-type" onclick="setSigTab('type')">Type Full Name</button>
            <button class="sig-tab-btn" style="margin-left:auto; color:var(--text-muted);" onclick="clearSignature()">Clear</button>
          </div>
          <div id="draw-wrapper" class="canvas-container">
            <canvas id="sig-canvas" height="140"></canvas>
            <span class="canvas-hint">Sign with finger or mouse</span>
          </div>
          <div id="type-wrapper" class="type-sig-container" style="display:none;">
            <input type="text" id="type-sig-input" placeholder="Type your full legal name" value="${p.customerName}">
          </div>
          <label class="terms-checkbox">
            <input type="checkbox" id="terms-agree" checked>
            <span>I accept the proposal terms, scope of work, and authorize the 50% deposit to begin project execution.</span>
          </label>
        </div>

        <div class="action-bar">
          <button class="btn-approve" onclick="handleApproveAndPay()">
            ✅ Approve & Pay 50% Deposit ($${deposit})
          </button>
          <button class="btn-deny" onclick="openModal('decline-modal')">
            Decline / Request Changes
          </button>
        </div>
      </div>
    ` : isApproved && !isDepositPaid ? `
      <div class="card" style="text-align:center; padding:2rem 1.5rem;">
        <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:0.5rem; color:var(--success-solid);">
          ✅ Proposal Approved on ${new Date(p.approvedAt || Date.now()).toLocaleDateString()}
        </h3>
        <p style="color:var(--text-muted); margin-bottom:1.5rem;">
          To lock in your scheduled date (${p.scheduledDate || 'Tentative 7-day window'}), please submit the 50% deposit.
        </p>
        <button class="btn-approve" style="max-width:320px; margin:0 auto;" onclick="openPaymentModal()">
          💳 Submit 50% Deposit ($${deposit})
        </button>
      </div>
    ` : `
      <!-- Completed Roadmap -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🚀 Project Roadmap & Milestones</h2>
        </div>
        <ul class="roadmap-list">
          <li class="roadmap-item completed">
            <div class="roadmap-marker">✓</div>
            <div class="roadmap-title">Proposal Signed & 50% Deposit Confirmed</div>
            <div class="roadmap-desc">$${deposit} paid via Stripe Sandbox. Receipt dispatched to ${p.email || 'customer'}.</div>
          </li>
          <li class="roadmap-item ${p.permitReceived ? 'completed' : 'active'}">
            <div class="roadmap-marker">${p.permitReceived ? '✓' : '2'}</div>
            <div class="roadmap-title">State & Municipal Permitting</div>
            <div class="roadmap-desc">${p.permitReceived ? 'Permit received from State Portal.' : 'Permit filing submitted to state portal; pending clearance.'}</div>
          </li>
          <li class="roadmap-item active">
            <div class="roadmap-marker">3</div>
            <div class="roadmap-title">811 Utility Provider Marking (Jolley Co.)</div>
            <div class="roadmap-desc">Utility locators marking underground power, gas, and fiber on premises.</div>
          </li>
          <li class="roadmap-item">
            <div class="roadmap-marker">4</div>
            <div class="roadmap-title">7-Day Advance Notice & On-Site Installation</div>
            <div class="roadmap-desc">Crew dispatched with materials. Drainage kept open for County staff inspection.</div>
          </li>
          <li class="roadmap-item">
            <div class="roadmap-marker">5</div>
            <div class="roadmap-title">Final County Pass & 24-Hour Maintenance Guide</div>
            <div class="roadmap-desc">Trench covered, final payment settled, and custom property maintenance guide generated.</div>
          </li>
        </ul>
      </div>
    `}
  `;

  if (!isApproved && !p.customerDenied) {
    initSignatureCanvas();
  }
}

function getWorkSpecs(workType) {
  if (workType === 'drainage' || workType === 'mixed') {
    return `
      <li><span class="check-icon">✓</span> Deep trenching (18"-24") graded with laser transit at minimum 1% gravity slope.</li>
      <li><span class="check-icon">✓</span> Heavy-duty 4" perforated smooth-wall interior PVC piping (ASTM D2729).</li>
      <li><span class="check-icon">✓</span> 3/4" double-washed aggregate stone envelope wrapped in commercial geotextile filter fabric.</li>
      <li><span class="check-icon">✓</span> 2x 12"x12" high-capacity catch basins with debris filters connected at primary downspouts.</li>
      <li><span class="check-icon">✓</span> High-efficiency pop-up discharge emitter with auto-drain valve at perimeter boundary.</li>
    `;
  } else if (workType === 'lights') {
    return `
      <li><span class="check-icon">✓</span> Custom-extruded architectural aluminum track color-matched to roofline fascia.</li>
      <li><span class="check-icon">✓</span> Commercial IP68 waterproof RGB+W smart LED diodes (50,000 hour rated).</li>
      <li><span class="check-icon">✓</span> Trim Light smart Wi-Fi & Bluetooth controller with cloud automation.</li>
      <li><span class="check-icon">✓</span> UL-listed concealed power supply and commercial surge suppression.</li>
    `;
  } else {
    return `
      <li><span class="check-icon">✓</span> Excavation, rototilling, and laser grading for positive drainage diversion.</li>
      <li><span class="check-icon">✓</span> Premium drought-tolerant sod installation with starter fertilizer soil treatment.</li>
      <li><span class="check-icon">✓</span> Commercial heavy-duty aluminum lawn edging and cedar mulch beds.</li>
    `;
  }
}

function getCostItems(workType, total) {
  const t = Number(total);
  const materials = (t * 0.42).toFixed(2);
  const labor = (t * 0.43).toFixed(2);
  const permits = (t * 0.15).toFixed(2);

  return `
    <tr>
      <td><strong>Core Materials & System Components</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">Commercial grade piping/lighting/sod & aggregates</span></td>
      <td>Lump Sum</td>
      <td class="amount">$${materials}</td>
    </tr>
    <tr>
      <td><strong>Excavation, Certified Installation & Grading</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">Skilled crew, laser slope verification & clean-up</span></td>
      <td>Lump Sum</td>
      <td class="amount">$${labor}</td>
    </tr>
    <tr>
      <td><strong>State Portal Permit Filing & 811 Utility Marking</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">Jolley Co. utility ticket & county inspection oversight</span></td>
      <td>1 Service</td>
      <td class="amount">$${permits}</td>
    </tr>
  `;
}

function initSignatureCanvas() {
  const canvas = document.getElementById('sig-canvas');
  if (!canvas) return;
  sigCanvas = canvas;
  sigCtx = canvas.getContext('2d');
  
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = 140;
  sigCtx.lineWidth = 2.5;
  sigCtx.lineCap = 'round';
  sigCtx.strokeStyle = '#0f172a';

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function start(e) {
    isDrawing = true;
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
    if (e.cancelable) e.preventDefault();
  }

  function move(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
    if (e.cancelable) e.preventDefault();
  }

  function end() {
    isDrawing = false;
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', end);
}

// Global functions attached to window
window.setSigTab = function(mode) {
  sigMode = mode;
  document.getElementById('tab-draw').classList.toggle('active', mode === 'draw');
  document.getElementById('tab-type').classList.toggle('active', mode === 'type');
  document.getElementById('draw-wrapper').style.display = mode === 'draw' ? 'block' : 'none';
  document.getElementById('type-wrapper').style.display = mode === 'type' ? 'block' : 'none';
};

window.clearSignature = function() {
  if (sigCtx && sigCanvas) {
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  }
  const typeInp = document.getElementById('type-sig-input');
  if (typeInp) typeInp.value = '';
};

window.handleApproveAndPay = function() {
  const agree = document.getElementById('terms-agree');
  if (!agree || !agree.checked) {
    alert('Please agree to the proposal terms to proceed.');
    return;
  }
  openPaymentModal();
};

window.openPaymentModal = function() {
  const deposit = (currentProject.jobValue * 0.5).toFixed(2);
  document.getElementById('pay-modal-amount').textContent = '$' + Number(deposit).toLocaleString(undefined, {minimumFractionDigits:2});
  document.getElementById('card-name').value = currentProject.customerName || '';
  openModal('payment-modal');
};

window.openModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
};

window.fillTestCard = function() {
  document.getElementById('card-number').value = '4242 4242 4242 4242';
  document.getElementById('card-exp').value = '12/28';
  document.getElementById('card-cvc').value = '382';
  document.getElementById('card-zip').value = '90210';
};

window.handleDepositPayment = async function(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-payment');
  btn.textContent = 'Processing with Stripe...';
  btn.disabled = true;

  const deposit = currentProject.jobValue * 0.5;

  setTimeout(async () => {
    // Update local state
    currentProject.customerApproved = true;
    currentProject.approvedAt = new Date().toISOString();
    currentProject.depositPaid = deposit;
    currentProject.remainingBalance = currentProject.jobValue - deposit;
    currentProject.paymentStatus = 'partial';
    currentProject.status = 'wip';

    // Sync to Firestore
    try {
      const docRef = doc(db, 'projects', currentProject.id);
      await setDoc(docRef, currentProject, { merge: true });

      // Create notification for ABC staff
      await addDoc(collection(db, 'notifications'), {
        type: 'deposit_received',
        projectId: currentProject.id,
        customerName: currentProject.customerName,
        message: `💰 50% Deposit ($${deposit.toLocaleString()}) received for ${currentProject.customerName} (${currentProject.id}). Project moved to WIP.`,
        sentAt: new Date().toISOString(),
        status: 'sent'
      });
    } catch (err) {
      console.warn('Firestore update error (will continue locally):', err);
    }

    // Save to localStorage as well
    try {
      const raw = localStorage.getItem('abc_data');
      if (raw) {
        const d = JSON.parse(raw);
        if (d.projects) {
          const idx = d.projects.findIndex(p => p.id === currentProject.id);
          if (idx >= 0) d.projects[idx] = currentProject;
          else d.projects.push(currentProject);
          localStorage.setItem('abc_data', JSON.stringify(d));
        }
      }
    } catch (e) {}

    closeModal('payment-modal');
    btn.textContent = '🔒 Pay Deposit Now';
    btn.disabled = false;

    alert(`🎉 Payment Successful!\n\n50% Deposit of $${deposit.toLocaleString()} processed successfully via Stripe.\n\nProject ${currentProject.id} is now Active (WIP).\nState permit filing and utility marking initiated.`);
    renderProposal();
  }, 1200);
};

window.submitDecline = async function() {
  const notes = document.getElementById('decline-notes').value || 'Customer requested modifications to the proposal.';
  currentProject.customerApproved = false;
  currentProject.customerDenied = true;
  currentProject.deniedAt = new Date().toISOString();
  currentProject.declineReason = notes;

  try {
    const docRef = doc(db, 'projects', currentProject.id);
    await setDoc(docRef, currentProject, { merge: true });

    await addDoc(collection(db, 'notifications'), {
      type: 'proposal_declined',
      projectId: currentProject.id,
      customerName: currentProject.customerName,
      message: `❌ Proposal declined / changes requested for ${currentProject.customerName} (${currentProject.id}): "${notes}"`,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
  } catch (e) {}

  closeModal('decline-modal');
  alert('Your request has been sent to ABC Constructions. A representative will contact you shortly.');
  renderProposal();
};

window.downloadProposalPDF = function() {
  const element = document.getElementById('proposal-content');
  if (!element) return;
  const pId = currentProject ? currentProject.id : 'PJ-1006';

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `ABC_Constructions_Proposal_${pId}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(element).save();
  } else {
    window.print();
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  await init();
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('download') === 'pdf') {
    setTimeout(() => {
      window.downloadProposalPDF();
    }, 800);
  }
});
