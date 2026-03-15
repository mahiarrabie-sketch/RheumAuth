// ═══════════════════════════════════════════════════════════
// RheumAuth — Main Application Logic
// ═══════════════════════════════════════════════════════════

const ANTHROPIC_API_KEY = "YOUR_API_KEY_HERE"; // Replace with actual key

// ── App State ───────────────────────────────────────────────
const AppState = {
  currentSection: 'dashboard',
  paForm: {
    step: 1,
    data: {}
  },
  denialForm: { data: {} },
  p2pForm: { data: {} }
};

// ── Navigation ──────────────────────────────────────────────
function navigateTo(section) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.section === section);
  });
  document.querySelectorAll('.section').forEach(el => {
    el.classList.toggle('active', el.id === `section-${section}`);
  });
  AppState.currentSection = section;

  const titles = {
    dashboard: 'Dashboard',
    pa_submission: 'PA Submission Tool',
    insurance_db: 'Insurance Requirements',
    denial_appeal: 'Denial Appeal Generator',
    peer_to_peer: 'Peer-to-Peer Prep',
    settings: 'Settings'
  };
  document.getElementById('topbar-title').textContent = titles[section] || section;
}

// ── PA Submission Wizard ─────────────────────────────────────
function initPAWizard() {
  goToStep(1);
  loadDrugGrid();
}

function goToStep(step) {
  AppState.paForm.step = step;

  document.querySelectorAll('.step-panel').forEach((p, i) => {
    p.classList.toggle('active', i + 1 === step);
  });

  document.querySelectorAll('.step-item').forEach((el, i) => {
    el.classList.remove('active', 'completed');
    if (i + 1 === step) el.classList.add('active');
    if (i + 1 < step) el.classList.add('completed');
  });
}

function loadDrugGrid() {
  const grid = document.getElementById('drug-grid');
  if (!grid) return;
  grid.innerHTML = '';

  Object.entries(DRUG_DATABASE).forEach(([key, drug]) => {
    const card = document.createElement('div');
    card.className = 'drug-card';
    card.dataset.key = key;
    card.innerHTML = `
      <div class="drug-name">${drug.name}</div>
      <div class="drug-class">${drug.brand} · ${drug.class}</div>
      <div class="drug-indications">
        ${drug.indications.map(i => `<span class="badge badge-teal">${i}</span>`).join('')}
      </div>
    `;
    card.addEventListener('click', () => selectDrug(key, card));
    grid.appendChild(card);
  });
}

function selectDrug(drugKey, cardEl) {
  document.querySelectorAll('.drug-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  AppState.paForm.data.drug = drugKey;

  const drug = DRUG_DATABASE[drugKey];
  document.getElementById('selected-drug-name').textContent = `${drug.name} (${drug.brand})`;
  document.getElementById('selected-drug-class').textContent = `${drug.class} · ${drug.route}`;

  const labsEl = document.getElementById('required-labs-list');
  labsEl.innerHTML = drug.labsRequired.map(l =>
    `<li style="margin-bottom:4px; font-size:13px; color:var(--text-secondary)">${l}</li>`
  ).join('');

  document.getElementById('drug-jcode').textContent = drug.jcode;
  document.getElementById('drug-step-therapy').textContent = drug.stepTherapy.join(' → ');

  const icds = Object.entries(drug.icd10 || {}).map(([k,v]) => `<strong>${k}:</strong> ${v}`).join('<br>');
  document.getElementById('drug-icd10').innerHTML = icds;

  document.getElementById('drug-notes').textContent = drug.notes || '—';

  document.getElementById('drug-info-panel').style.display = 'block';
}

function filterDrugs(query, classFilter) {
  const q = query.toLowerCase();
  document.querySelectorAll('.drug-card').forEach(card => {
    const key = card.dataset.key;
    const drug = DRUG_DATABASE[key];
    const matchSearch = !q || drug.name.toLowerCase().includes(q) || drug.brand.toLowerCase().includes(q) || drug.class.toLowerCase().includes(q) || drug.indications.some(i => i.toLowerCase().includes(q));
    const matchClass = !classFilter || classFilter === 'all' || drug.class.toLowerCase().includes(classFilter.toLowerCase());
    card.style.display = matchSearch && matchClass ? '' : 'none';
  });
}

// ── Step 2: Patient & Insurance ──────────────────────────────
function loadInsuranceCriteria() {
  const drug = AppState.paForm.data.drug;
  const insurer = document.getElementById('pa-insurer').value;

  if (!drug || !insurer || insurer === '') return;

  AppState.paForm.data.insurer = insurer;
  const ins = INSURANCE_DATABASE[insurer];
  const drugData = DRUG_DATABASE[drug];

  const panel = document.getElementById('insurance-criteria-panel');
  if (!panel) return;

  let criteriaItems = drugData.commonCriteria || [];

  if (ins && ins.drugSpecific && ins.drugSpecific[drug]) {
    const specific = ins.drugSpecific[drug];
    criteriaItems = specific.requirements || criteriaItems;

    document.getElementById('ins-pa-duration').textContent = specific.paDuration || '12 months';
    document.getElementById('ins-special-notes').textContent = specific.specialNotes || '—';
    document.getElementById('ins-biosimilar').textContent = specific.biosimilarRequired ? '⚠ Yes — biosimilar trial required' : 'No';
  } else {
    document.getElementById('ins-pa-duration').textContent = '12 months (verify with plan)';
    document.getElementById('ins-special-notes').textContent = ins ? ins.generalNotes : '—';
    document.getElementById('ins-biosimilar').textContent = 'Verify with plan';
  }

  if (ins) {
    document.getElementById('ins-step-therapy').textContent = ins.stepTherapyPolicy;
    document.getElementById('ins-pa-phone').textContent = ins.paPhone;
    document.getElementById('ins-turnaround').textContent = `Standard: ${ins.turnaround.standard} · Urgent: ${ins.turnaround.urgent}`;
    document.getElementById('ins-appeals').textContent = ins.denialAppeals;
  }

  const list = document.getElementById('criteria-checklist');
  list.innerHTML = criteriaItems.map((item, i) => `
    <div class="criteria-item">
      <input type="checkbox" class="criteria-check" id="crit-${i}">
      <div>
        <div class="criteria-text">${item}</div>
      </div>
    </div>
  `).join('');

  panel.style.display = 'block';
}

// ── AI: Generate PA Letter ───────────────────────────────────
async function generatePALetter() {
  const data = AppState.paForm.data;
  const drug = DRUG_DATABASE[data.drug];
  const ins = INSURANCE_DATABASE[data.insurer];

  const patientDx = document.getElementById('pa-diagnosis').value || 'rheumatoid arthritis';
  const patientName = document.getElementById('pa-patient-initials').value || 'Patient';
  const priorTx = document.getElementById('pa-prior-tx').value || '';
  const clinicalNotes = document.getElementById('pa-clinical-notes').value || '';
  const dasScore = document.getElementById('pa-das-score').value || '';
  const diseaseActivity = document.getElementById('pa-disease-activity').value || 'moderate-to-severe';

  showAILoading('pa-letter-output', 'Generating PA letter...');

  const prompt = `You are an expert rheumatology prior authorization specialist. Write a comprehensive, compelling prior authorization letter for the following request.

DRUG: ${drug.name} (${drug.brand}) - ${drug.class}
DIAGNOSIS: ${patientDx}
PATIENT: ${patientName}
INSURANCE: ${ins ? ins.name : data.insurer}
DISEASE ACTIVITY: ${diseaseActivity} (${dasScore ? 'DAS28/CDAI: ' + dasScore : 'score not provided'})
PRIOR TREATMENTS FAILED: ${priorTx}
CLINICAL NOTES: ${clinicalNotes}

Requirements for this insurance:
${drug.commonCriteria.join('\n')}

${ins && ins.drugSpecific && ins.drugSpecific[data.drug] ? 'Insurance-specific requirements:\n' + (ins.drugSpecific[data.drug].requirements || []).join('\n') : ''}

Write a formal, professional PA letter that:
1. States the diagnosis and ICD-10 code clearly
2. Documents disease severity with objective measures
3. Details all prior treatment failures with dates/doses if provided
4. Justifies medical necessity with clinical evidence
5. References relevant ACR guidelines
6. Addresses any specific step therapy requirements
7. Requests approval citing clinical necessity

Format the letter professionally with date, subject line, and proper medical language. Be specific and compelling. Use standard PA letter format.`;

  try {
    const result = await callClaude(prompt);
    displayAIResult('pa-letter-output', result, true);
    showToast('PA letter generated successfully', 'success');
  } catch (err) {
    displayAIError('pa-letter-output', err.message);
  }
}

// ── AI: Predict Insurance Criteria ──────────────────────────
async function predictCriteria() {
  const drug = AppState.paForm.data.drug;
  const insurer = AppState.paForm.data.insurer;
  const diagnosis = document.getElementById('pa-diagnosis').value;

  if (!drug || !insurer || !diagnosis) {
    showToast('Please select drug, insurer and diagnosis first', 'warning');
    return;
  }

  const drugData = DRUG_DATABASE[drug];
  const insData = INSURANCE_DATABASE[insurer];

  showAILoading('criteria-prediction-output', 'Analyzing insurance requirements...');

  const prompt = `You are an expert rheumatology prior authorization specialist. Based on the following details, predict and list the most likely criteria this insurance company will require for approval, and flag potential denial risks.

DRUG: ${drugData.name} (${drugData.brand})
DIAGNOSIS: ${diagnosis}
INSURANCE: ${insData ? insData.name : insurer}
DRUG CLASS: ${drugData.class}

Known insurance requirements: ${JSON.stringify(insData?.drugSpecific?.[drug]?.requirements || drugData.commonCriteria)}
Insurance step therapy policy: ${insData?.stepTherapyPolicy || 'Standard step therapy'}

Provide:
1. **High Priority Requirements** (most likely to cause denial if missing)
2. **Documentation Checklist** (specific documents needed)
3. **Potential Denial Risks** (what to proactively address)
4. **Approval Tips** (insider tips for this specific insurer + drug combination)

Be specific, practical, and clinically accurate. Format clearly with sections.`;

  try {
    const result = await callClaude(prompt);
    displayAIResult('criteria-prediction-output', result, false);
  } catch (err) {
    displayAIError('criteria-prediction-output', err.message);
  }
}

// ── Denial Appeal Tool ───────────────────────────────────────
function loadDenialReasonInfo() {
  const reason = document.getElementById('denial-reason').value;
  if (!reason || reason === '') return;

  const data = DENIAL_REASONS[reason];
  if (!data) return;

  document.getElementById('denial-reason-desc').textContent = data.description;
  document.getElementById('denial-rebuttal-hint').textContent = data.commonRebuttal;

  const stratList = document.getElementById('denial-strategies-list');
  stratList.innerHTML = data.appealStrategies.map(s =>
    `<li style="margin-bottom:6px; font-size:13px; color:var(--text-secondary)">${s}</li>`
  ).join('');

  document.getElementById('denial-info-panel').style.display = 'block';
}

async function generateAppealLetter() {
  const denialReason = document.getElementById('denial-reason').value;
  const drug = document.getElementById('denial-drug').value;
  const insurer = document.getElementById('denial-insurer').value;
  const diagnosis = document.getElementById('denial-diagnosis').value;
  const denialDetails = document.getElementById('denial-details').value;
  const clinicalInfo = document.getElementById('denial-clinical-info').value;
  const priorTx = document.getElementById('denial-prior-tx').value;

  if (!denialReason || !drug || !insurer) {
    showToast('Please fill in denial reason, drug, and insurer', 'warning');
    return;
  }

  const denialData = DENIAL_REASONS[denialReason] || {};
  const drugData = DRUG_DATABASE[drug] || {};
  const insData = INSURANCE_DATABASE[insurer] || {};

  showAILoading('appeal-letter-output', 'Generating appeal letter...');

  const prompt = `You are an expert rheumatology prior authorization appeal specialist. Write a strong, compelling formal appeal letter for a denied prior authorization.

DENIAL DETAILS:
- Drug: ${drugData.name || drug} (${drugData.brand || ''})
- Diagnosis: ${diagnosis}
- Insurer: ${insData.name || insurer}
- Primary Denial Reason: ${denialData.label || denialReason}
- Specific Denial Details: ${denialDetails}

CLINICAL INFORMATION:
${clinicalInfo}

PRIOR TREATMENT HISTORY:
${priorTx}

APPEAL STRATEGIES TO USE:
${(denialData.appealStrategies || []).join('\n')}

INSURANCE APPEAL PROCESS:
${insData.denialAppeals || 'Standard formal appeal process'}

Write a comprehensive, formal appeal letter that:
1. Opens with appeal basis and urgency
2. Summarizes denial reason and why it is incorrect
3. Provides detailed clinical evidence countering the denial
4. References specific ACR guidelines and peer-reviewed literature
5. Addresses each denial criterion point by point
6. Cites relevant case law or regulatory requirements where applicable (e.g., step therapy exception laws, MHPAEA)
7. Closes with clear request for reversal and timeline
8. Include citation of any relevant state step therapy laws

Be forceful, evidence-based, and professional. This letter needs to win.`;

  try {
    const result = await callClaude(prompt);
    displayAIResult('appeal-letter-output', result, true);
    showToast('Appeal letter generated', 'success');
  } catch (err) {
    displayAIError('appeal-letter-output', err.message);
  }
}

async function analyzeDenial() {
  const denialDetails = document.getElementById('denial-details').value;
  const drug = document.getElementById('denial-drug').value;
  const insurer = document.getElementById('denial-insurer').value;

  if (!denialDetails) {
    showToast('Please enter denial details to analyze', 'warning');
    return;
  }

  showAILoading('denial-analysis-output', 'Analyzing denial...');

  const prompt = `You are a rheumatology prior authorization expert. Analyze this insurance denial and provide actionable guidance.

DENIAL TEXT/DETAILS: ${denialDetails}
DRUG: ${drug ? (DRUG_DATABASE[drug]?.name || drug) : 'Not specified'}
INSURANCE: ${insurer ? (INSURANCE_DATABASE[insurer]?.name || insurer) : 'Not specified'}

Provide:
1. **Denial Type Classification** — What category is this denial?
2. **Immediate Action Items** — What should the practice do RIGHT NOW (today)?
3. **Appeal Success Likelihood** — Rate 1-10 with reasoning
4. **Key Counterarguments** — Specific points to make in appeal
5. **Documentation Gaps** — What's likely missing that caused this denial?
6. **Timeline** — When to appeal, what deadlines to know
7. **Escalation Path** — If appeal fails, what are the next steps?

Be direct, specific, and practical. Time is critical for patients.`;

  try {
    const result = await callClaude(prompt);
    displayAIResult('denial-analysis-output', result, false);
  } catch (err) {
    displayAIError('denial-analysis-output', err.message);
  }
}

// ── Peer-to-Peer Tool ───────────────────────────────────────
async function generateP2PPrep() {
  const drug = document.getElementById('p2p-drug').value;
  const insurer = document.getElementById('p2p-insurer').value;
  const diagnosis = document.getElementById('p2p-diagnosis').value;
  const denialReason = document.getElementById('p2p-denial-reason').value;
  const clinicalCase = document.getElementById('p2p-clinical').value;
  const physicianName = document.getElementById('p2p-physician').value || 'your name';

  if (!drug || !diagnosis) {
    showToast('Please fill in drug and diagnosis', 'warning');
    return;
  }

  const drugData = DRUG_DATABASE[drug] || {};
  const insData = INSURANCE_DATABASE[insurer] || {};

  showAILoading('p2p-script-output', 'Building your P2P script...');

  const prompt = `You are an expert rheumatologist and prior authorization advocate. Create a comprehensive peer-to-peer review script for Dr. ${physicianName} to use in a physician-to-physician call with an insurance medical director.

CASE DETAILS:
- Drug Requested: ${drugData.name || drug} (${drugData.brand || ''}) - ${drugData.class || ''}
- Diagnosis: ${diagnosis}
- Insurance: ${insData.name || insurer}
- Denial Reason: ${denialReason}
- Clinical Summary: ${clinicalCase}

Create a structured P2P script that includes:

## OPENING (30 seconds)
Exact words to say when the call connects

## CASE PRESENTATION (2-3 minutes)
- Patient presentation talking points
- Disease activity and severity
- Functional impairment

## TREATMENT HISTORY (2 minutes)
- Prior medications and why they failed
- What was tried, for how long, and outcome

## CLINICAL ARGUMENT (Core of the call - 3-5 minutes)
- Medical necessity justification
- ACR guideline references with specifics
- Peer-reviewed evidence to cite
- Why THIS drug for THIS patient

## HANDLING OBJECTIONS
- If they say step therapy not met: [rebuttal]
- If they say not medically necessary: [rebuttal]
- If they ask about biosimilars: [rebuttal]
- If they push back on diagnosis: [rebuttal]

## KEY DATA TO HAVE READY
List specific numbers, scores, dates to reference

## CLOSING
Exact closing language and what to do if denied again

## IF UNSUCCESSFUL
Escalation steps

Make it natural, confident, and evidence-based. This physician needs to WIN this call.`;

  try {
    const result = await callClaude(prompt);
    displayAIResult('p2p-script-output', result, false);

    document.getElementById('p2p-quick-facts').style.display = 'block';
    populateP2PQuickFacts(drugData, insData);
    showToast('P2P script ready', 'success');
  } catch (err) {
    displayAIError('p2p-script-output', err.message);
  }
}

function populateP2PQuickFacts(drugData, insData) {
  const facts = document.getElementById('p2p-facts-content');
  facts.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
      <div>
        <div class="criteria-title">Key Clinical Points</div>
        ${(drugData.commonCriteria || []).slice(0, 4).map(c => `<div style="font-size:12px; padding:4px 0; border-bottom:1px solid var(--border); color:var(--text-secondary)">${c}</div>`).join('')}
      </div>
      <div>
        <div class="criteria-title">Insurance Intel</div>
        <div style="font-size:12px; color:var(--text-secondary); margin-bottom:6px"><strong>Step Therapy:</strong> ${insData.stepTherapyPolicy || 'Verify with plan'}</div>
        <div style="font-size:12px; color:var(--text-secondary); margin-bottom:6px"><strong>Appeals:</strong> ${insData.denialAppeals || 'Standard process'}</div>
        <div style="font-size:12px; color:var(--text-secondary)"><strong>P2P Tip:</strong> ${insData.generalNotes || 'Document everything'}</div>
      </div>
    </div>
  `;
}

// ── Insurance DB Section ─────────────────────────────────────
function loadInsuranceDB() {
  const grid = document.getElementById('ins-db-grid');
  if (!grid) return;
  grid.innerHTML = '';

  Object.entries(INSURANCE_DATABASE).forEach(([key, ins]) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <div class="card-body">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          <div style="width:40px;height:40px;border-radius:8px;background:${ins.color}15;border:1px solid ${ins.color}30;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:11px;font-weight:700;color:${ins.color}">${ins.short}</span>
          </div>
          <div>
            <div style="font-weight:600;font-size:14px">${ins.name}</div>
            <div style="font-size:12px;color:var(--text-muted)">${ins.paPhone}</div>
          </div>
        </div>
        <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;line-height:1.5">${ins.generalNotes.substring(0, 120)}...</div>
        <div style="display:flex;gap:8px;">
          <span class="badge badge-info">⏱ ${ins.turnaround.standard}</span>
          <span class="badge badge-warning">Urgent: ${ins.turnaround.urgent}</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openInsuranceDetail(key));
    grid.appendChild(card);
  });
}

function openInsuranceDetail(key) {
  const ins = INSURANCE_DATABASE[key];
  const modal = document.getElementById('ins-detail-modal');

  document.getElementById('ins-modal-name').textContent = ins.name;
  document.getElementById('ins-modal-body').innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
      <div class="stat-card"><div class="stat-label">PA Phone</div><div style="font-size:14px;font-weight:500;margin-top:4px">${ins.paPhone}</div></div>
      <div class="stat-card"><div class="stat-label">Portal</div><div style="font-size:14px;font-weight:500;margin-top:4px">${ins.portal}</div></div>
      <div class="stat-card"><div class="stat-label">Standard Turnaround</div><div style="font-size:14px;font-weight:500;margin-top:4px">${ins.turnaround.standard}</div></div>
      <div class="stat-card"><div class="stat-label">Urgent Turnaround</div><div style="font-size:14px;font-weight:500;margin-top:4px">${ins.turnaround.urgent}</div></div>
    </div>
    <div style="margin-bottom:16px;">
      <div class="criteria-title">Step Therapy Policy</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;background:var(--gray-50);padding:12px;border-radius:8px">${ins.stepTherapyPolicy}</div>
    </div>
    <div style="margin-bottom:16px;">
      <div class="criteria-title">Formulary Policy</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;background:var(--gray-50);padding:12px;border-radius:8px">${ins.preferredFormulary}</div>
    </div>
    <div style="margin-bottom:16px;">
      <div class="criteria-title">Denial & Appeals Process</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;background:#FFF7ED;padding:12px;border-radius:8px;border:1px solid rgba(245,158,11,0.2)">${ins.denialAppeals}</div>
    </div>
    ${ins.fax ? `<div style="margin-bottom:16px;"><div class="criteria-title">Fax Number</div><div style="font-size:13px;color:var(--text-secondary)">${ins.fax}</div></div>` : ''}
    ${Object.keys(ins.drugSpecific || {}).length > 0 ? `
    <div>
      <div class="criteria-title">Drug-Specific Requirements</div>
      ${Object.entries(ins.drugSpecific).map(([dk, dd]) => {
        const drug = DRUG_DATABASE[dk];
        return `<div style="margin-bottom:12px;padding:12px;background:white;border:1px solid var(--border);border-radius:8px;">
          <div style="font-weight:600;font-size:13px;margin-bottom:8px">${drug ? drug.name : dk} (${drug?.brand || ''})</div>
          ${(dd.requirements || []).map(r => `<div style="font-size:12px;color:var(--text-secondary);padding:3px 0;border-bottom:1px solid var(--border)">• ${r}</div>`).join('')}
          ${dd.paDuration ? `<div style="font-size:11px;color:var(--text-muted);margin-top:6px">PA Duration: ${dd.paDuration}</div>` : ''}
          ${dd.biosimilarRequired ? `<div style="font-size:11px;font-weight:600;color:#92400E;margin-top:4px">⚠ Biosimilar required</div>` : ''}
        </div>`;
      }).join('')}
    </div>
    ` : ''}
  `;

  openModal('ins-detail-modal');
}

// ── Claude API ───────────────────────────────────────────────
async function callClaude(prompt) {
  const apiKey = document.getElementById('api-key-input')?.value || ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('Please add your Anthropic API key in Settings to use AI features.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || 'No response generated.';
}

// ── AI Display Helpers ───────────────────────────────────────
function showAILoading(containerId, message) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.style.display = 'block';
  el.innerHTML = `
    <div class="ai-panel">
      <div class="ai-panel-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--teal)"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span class="ai-label">AI Processing</span>
      </div>
      <div class="ai-panel-body">
        <div class="ai-spinner">
          <div class="spinner-dot"></div>
          <div class="spinner-dot"></div>
          <div class="spinner-dot"></div>
          <span style="margin-left:4px">${message}</span>
        </div>
      </div>
    </div>
  `;
}

function displayAIResult(containerId, text, showCopy) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const formatted = formatAIText(text);

  el.innerHTML = `
    <div class="ai-panel">
      <div class="ai-panel-header" style="justify-content:space-between">
        <div style="display:flex;align-items:center;gap:8px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--teal)"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          <span class="ai-label">AI Generated</span>
        </div>
        ${showCopy ? `<button class="copy-btn" onclick="copyToClipboard('${containerId}-content')">Copy</button>` : ''}
      </div>
      <div class="ai-panel-body">
        <div class="ai-content" id="${containerId}-content">${formatted}</div>
      </div>
    </div>
  `;
}

function displayAIError(containerId, message) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div style="background:#FEF2F2;border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:16px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span style="font-size:12px;font-weight:700;color:#991B1B;text-transform:uppercase;letter-spacing:0.5px">Error</span>
      </div>
      <div style="font-size:13px;color:#991B1B">${message}</div>
      ${message.includes('API key') ? `<div style="margin-top:8px"><button class="btn btn-sm btn-secondary" onclick="navigateTo('settings')">Go to Settings →</button></div>` : ''}
    </div>
  `;
}

function formatAIText(text) {
  return text
    .replace(/^## (.+)$/gm, '<h4 style="margin-top:16px;margin-bottom:8px">$1</h4>')
    .replace(/^### (.+)$/gm, '<h4 style="margin-top:12px;margin-bottom:6px;font-size:13px">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>(\n|$))+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(?!<)(.+)$/gm, '<p>$1</p>');
}

// ── Modal ───────────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Toast ───────────────────────────────────────────────────
function showToast(message, type = 'default') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' : ''}
      ${type === 'warning' ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/>' : ''}
      ${type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' : ''}
      ${type === 'default' ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' : ''}
    </svg>
    ${message}
  `;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ── Copy to Clipboard ───────────────────────────────────────
function copyToClipboard(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard', 'success');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('Copied to clipboard', 'success');
  });
}

// ── Print / Export ──────────────────────────────────────────
function printContent(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>RheumAuth Export</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;line-height:1.6}h4{margin-top:20px}ul{padding-left:20px}</style></head><body>${el.innerHTML}</body></html>`);
  w.document.close();
  w.print();
}

// ── Inner Tabs ──────────────────────────────────────────────
function switchInnerTab(tabGroup, tab) {
  document.querySelectorAll(`[data-tab-group="${tabGroup}"]`).forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab);
  });
  document.querySelectorAll(`[data-tab-panel="${tabGroup}"]`).forEach(el => {
    el.style.display = el.dataset.panel === tab ? 'block' : 'none';
  });
}

// ── Collapsible ─────────────────────────────────────────────
function toggleCollapsible(headerId) {
  const header = document.getElementById(headerId);
  const body = document.getElementById(headerId.replace('header', 'body'));
  if (!header || !body) return;
  header.classList.toggle('open');
  body.classList.toggle('open');
}

// ── Settings ─────────────────────────────────────────────────
function saveApiKey() {
  const key = document.getElementById('api-key-input').value;
  if (key && key.startsWith('sk-ant-')) {
    localStorage.setItem('rheumauth_api_key', key);
    showToast('API key saved', 'success');
    document.getElementById('api-key-status').innerHTML = '<span class="badge badge-success">✓ Connected</span>';
  } else {
    showToast('Invalid API key format', 'error');
  }
}

function loadSettings() {
  const key = localStorage.getItem('rheumauth_api_key');
  if (key) {
    document.getElementById('api-key-input').value = key;
    document.getElementById('api-key-status').innerHTML = '<span class="badge badge-success">✓ Connected</span>';
  }
}

// ── Dashboard Stats ─────────────────────────────────────────
function updateDashboard() {
  // In a real app this would load from a backend
}

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('dashboard');
  loadSettings();

  // API Key from storage
  const savedKey = localStorage.getItem('rheumauth_api_key');
  if (savedKey) {
    const input = document.getElementById('api-key-input');
    if (input) input.value = savedKey;
  }

  // Drug search
  const drugSearch = document.getElementById('drug-search');
  if (drugSearch) {
    drugSearch.addEventListener('input', e => {
      const classFilter = document.getElementById('drug-class-filter')?.value;
      filterDrugs(e.target.value, classFilter);
    });
  }

  const classFilter = document.getElementById('drug-class-filter');
  if (classFilter) {
    classFilter.addEventListener('change', e => {
      const query = document.getElementById('drug-search')?.value;
      filterDrugs(query, e.target.value);
    });
  }

  // Insurer change
  const insPASelect = document.getElementById('pa-insurer');
  if (insPASelect) insPASelect.addEventListener('change', loadInsuranceCriteria);

  const denialReasonSel = document.getElementById('denial-reason');
  if (denialReasonSel) denialReasonSel.addEventListener('change', loadDenialReasonInfo);
});
