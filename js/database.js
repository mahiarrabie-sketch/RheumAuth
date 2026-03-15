// ═══════════════════════════════════════════════════════════
// RheumAuth — Drug & Insurance Requirements Database
// ═══════════════════════════════════════════════════════════

const DRUG_DATABASE = {
  // ── TNF Inhibitors ──────────────────────────────────────
  adalimumab: {
    name: "Adalimumab",
    brand: "Humira",
    class: "TNF Inhibitor",
    route: "Subcutaneous",
    indications: ["RA", "PsA", "AS", "PsO", "JIA", "IBD"],
    stepTherapy: ["methotrexate", "leflunomide", "sulfasalazine", "hydroxychloroquine"],
    commonCriteria: [
      "Failure of 2+ csDMARDs (MTX required for RA)",
      "Active disease despite conventional therapy",
      "Diagnosis confirmed by rheumatologist",
      "No active TB (negative TB test required)",
      "Appropriate vaccinations prior to initiation",
      "Labs: CBC, CMP, Hepatitis B/C within 6 months"
    ],
    labsRequired: ["TB test (IGRA or PPD)", "CBC", "CMP", "Hepatitis B surface antigen", "Hepatitis C antibody"],
    icd10: {
      "RA": "M05.79, M05.79, M06.9",
      "PsA": "L40.50, L40.59",
      "AS": "M45.0, M45.9",
      "PsO": "L40.0, L40.9"
    },
    jcode: "J0135",
    notes: "Biosimilars available — insurers may require biosimilar trial first (Hadlima, Hyrimoz, Cyltezo, etc.)"
  },

  etanercept: {
    name: "Etanercept",
    brand: "Enbrel",
    class: "TNF Inhibitor",
    route: "Subcutaneous",
    indications: ["RA", "PsA", "AS", "PsO", "JIA"],
    stepTherapy: ["methotrexate", "leflunomide", "sulfasalazine"],
    commonCriteria: [
      "Failure of 2+ csDMARDs (MTX preferred for RA)",
      "Active disease: DAS28 > 3.2 or CDAI > 10",
      "No active TB (TB screening required)",
      "Negative Hepatitis B/C",
      "Labs within 6 months"
    ],
    labsRequired: ["TB test", "CBC", "CMP", "Hepatitis panel"],
    icd10: { "RA": "M05.79, M06.9", "PsA": "L40.50", "AS": "M45.9" },
    jcode: "J1438",
    notes: "Biosimilar Erelzi/Eticovo may be required. No IV formulation."
  },

  infliximab: {
    name: "Infliximab",
    brand: "Remicade",
    class: "TNF Inhibitor",
    route: "IV Infusion",
    indications: ["RA", "PsA", "AS", "PsO", "IBD", "UC"],
    stepTherapy: ["methotrexate", "leflunomide"],
    commonCriteria: [
      "Failure of MTX (must be used concurrently for RA)",
      "Active disease documented",
      "TB screening — negative result required",
      "Hepatitis B/C screening",
      "Provider must be credentialed for IV biologic infusion"
    ],
    labsRequired: ["TB test", "CBC", "CMP", "Hepatitis B/C", "ANA (if SLE concern)"],
    icd10: { "RA": "M05.79, M06.9", "AS": "M45.9", "PsA": "L40.50" },
    jcode: "J1745",
    notes: "Biosimilars (Inflectra, Renflexis, Avsola, Ixifi) typically required first by most payers. Concurrent MTX mandatory for RA."
  },

  certolizumab: {
    name: "Certolizumab pegol",
    brand: "Cimzia",
    class: "TNF Inhibitor",
    route: "Subcutaneous",
    indications: ["RA", "PsA", "AS", "PsO"],
    stepTherapy: ["methotrexate", "leflunomide", "sulfasalazine"],
    commonCriteria: [
      "Failure of 2+ csDMARDs",
      "Active disease despite prior therapy",
      "Negative TB test",
      "Hepatitis screening completed",
      "Safe to use in pregnancy (does not cross placenta significantly)"
    ],
    labsRequired: ["TB test", "CBC", "CMP", "Hepatitis panel"],
    icd10: { "RA": "M05.79, M06.9", "PsA": "L40.50", "AS": "M45.9" },
    jcode: "J0718",
    notes: "Preferred in pregnancy. Unique PEGylated structure — does not cross placenta."
  },

  golimumab: {
    name: "Golimumab",
    brand: "Simponi / Simponi Aria",
    class: "TNF Inhibitor",
    route: "SC (Simponi) / IV (Simponi Aria)",
    indications: ["RA", "PsA", "AS", "UC"],
    stepTherapy: ["methotrexate", "leflunomide"],
    commonCriteria: [
      "Failure of 2+ csDMARDs including MTX",
      "Active disease documented by rheumatologist",
      "Negative TB screening",
      "Hepatitis B/C negative or treated"
    ],
    labsRequired: ["TB test", "CBC", "CMP", "Hepatitis panel"],
    icd10: { "RA": "M05.79, M06.9", "PsA": "L40.50", "AS": "M45.9" },
    jcode: "J1602 (SC), J0717 (IV)",
    notes: "Monthly SC dosing advantage. IV formulation used in infusion centers."
  },

  // ── IL-6 Inhibitors ─────────────────────────────────────
  tocilizumab: {
    name: "Tocilizumab",
    brand: "Actemra",
    class: "IL-6 Receptor Inhibitor",
    route: "IV or SC",
    indications: ["RA", "PJIA", "SJIA", "GCA", "SSc-ILD"],
    stepTherapy: ["methotrexate", "leflunomide", "TNF-inhibitor"],
    commonCriteria: [
      "RA: Failure of MTX +/- TNF inhibitor",
      "Can be used as monotherapy (unlike most biologics)",
      "GCA: Appropriate imaging/biopsy confirmation",
      "Baseline lipid panel required",
      "LFTs must be normal prior to initiation",
      "Neutropenia monitoring required"
    ],
    labsRequired: ["CBC", "CMP with LFTs", "Lipid panel", "TB test", "Hepatitis panel"],
    icd10: { "RA": "M05.79, M06.9", "GCA": "M31.5, M31.6" },
    jcode: "J3262",
    notes: "IL-6 elevation makes standard CRP/ESR unreliable during treatment. Monotherapy acceptable by many payers for RA."
  },

  sarilumab: {
    name: "Sarilumab",
    brand: "Kevzara",
    class: "IL-6 Receptor Inhibitor",
    route: "Subcutaneous",
    indications: ["RA"],
    stepTherapy: ["methotrexate", "leflunomide", "TNF-inhibitor"],
    commonCriteria: [
      "Moderate-to-severe RA",
      "Inadequate response to MTX",
      "Baseline neutrophil count must be >2000/mm³",
      "LFTs normal at baseline",
      "Lipid monitoring required"
    ],
    labsRequired: ["CBC with differential", "CMP with LFTs", "Lipid panel", "TB test"],
    icd10: { "RA": "M05.79, M06.9" },
    jcode: "J2802",
    notes: "SC only. Comparable efficacy to tocilizumab. Can be used as monotherapy."
  },

  // ── JAK Inhibitors ──────────────────────────────────────
  tofacitinib: {
    name: "Tofacitinib",
    brand: "Xeljanz",
    class: "JAK Inhibitor",
    route: "Oral",
    indications: ["RA", "PsA", "UC", "JIA"],
    stepTherapy: ["methotrexate", "leflunomide", "TNF-inhibitor (required by most payers for RA)"],
    commonCriteria: [
      "Failure of 2+ csDMARDs AND 1 biologic (TNFi)",
      "Active disease despite prior therapy",
      "Black box warning: thromboembolic events, malignancy — document risk discussion",
      "No active serious infections",
      "Negative TB test",
      "Avoid in patients with known VTE risk or ATE risk without proper anticoagulation"
    ],
    labsRequired: ["CBC", "CMP", "Lipid panel", "TB test", "Hepatitis panel"],
    icd10: { "RA": "M05.79, M06.9", "PsA": "L40.50", "UC": "K51.90" },
    jcode: "N/A (oral)",
    notes: "⚠ FDA Black Box Warning. Most payers require TNFi failure first. VTE risk counseling documentation essential for PA."
  },

  baricitinib: {
    name: "Baricitinib",
    brand: "Olumiant",
    class: "JAK Inhibitor",
    route: "Oral",
    indications: ["RA", "AA"],
    stepTherapy: ["methotrexate", "leflunomide", "TNF-inhibitor"],
    commonCriteria: [
      "Moderate-to-severe RA, inadequate response to MTX",
      "Failure of 1+ TNF inhibitor (most payers)",
      "Black box: thrombosis, malignancy, CV events",
      "Negative TB and hepatitis screening",
      "Normal renal function (dose adjust for CrCl 30-60)",
      "Document cardiovascular risk assessment"
    ],
    labsRequired: ["CBC", "CMP with creatinine", "Lipid panel", "TB test", "Hepatitis panel"],
    icd10: { "RA": "M05.79, M06.9", "AA": "L63.9" },
    jcode: "N/A (oral)",
    notes: "⚠ FDA Black Box Warning. Renal dose adjustment needed. Alopecia areata indication may have different PA criteria."
  },

  upadacitinib: {
    name: "Upadacitinib",
    brand: "Rinvoq",
    class: "JAK Inhibitor",
    route: "Oral",
    indications: ["RA", "PsA", "AS", "nr-axSpA", "AD", "UC", "CD"],
    stepTherapy: ["methotrexate", "leflunomide", "TNF-inhibitor"],
    commonCriteria: [
      "Failure of MTX + 1 TNFi (RA, PsA, AS)",
      "Black box warning documentation required",
      "No active malignancy",
      "Lipid panel at baseline and monitoring",
      "Renal function assessment"
    ],
    labsRequired: ["CBC", "CMP", "Lipid panel", "TB test", "Hepatitis panel"],
    icd10: { "RA": "M05.79, M06.9", "PsA": "L40.50", "AS": "M45.9", "AD": "L20.9" },
    jcode: "N/A (oral)",
    notes: "⚠ FDA Black Box Warning. Broadest JAK inhibitor indication set. Premium pricing — expect step therapy requirements."
  },

  filgotinib: {
    name: "Filgotinib",
    brand: "Jyseleca",
    class: "JAK Inhibitor",
    route: "Oral",
    indications: ["RA", "UC"],
    stepTherapy: ["methotrexate", "leflunomide", "TNF-inhibitor"],
    commonCriteria: [
      "Failure of MTX + TNFi",
      "JAK1-selective — may have better tolerability profile",
      "Standard JAK safety counseling",
      "Renal function assessment"
    ],
    labsRequired: ["CBC", "CMP", "Lipid panel", "TB test"],
    icd10: { "RA": "M05.79, M06.9" },
    jcode: "N/A (oral)",
    notes: "Limited US approval. Check payer coverage."
  },

  // ── IL-17 Inhibitors ────────────────────────────────────
  secukinumab: {
    name: "Secukinumab",
    brand: "Cosentyx",
    class: "IL-17A Inhibitor",
    route: "Subcutaneous",
    indications: ["PsA", "AS", "nr-axSpA", "PsO"],
    stepTherapy: ["NSAIDs", "csDMARDs", "TNF-inhibitor (some payers)"],
    commonCriteria: [
      "Active PsA or AS not adequately controlled on NSAIDs",
      "TNFi failure may be required by some payers",
      "Caution with IBD — may worsen Crohn's",
      "TB screening required",
      "Candida infection history — use with caution"
    ],
    labsRequired: ["TB test", "CBC", "CMP"],
    icd10: { "PsA": "L40.50, L40.59", "AS": "M45.0, M45.9", "PsO": "L40.0" },
    jcode: "J3316",
    notes: "First-line biologic option for AS/PsA per ACR guidelines. AVOID in patients with active IBD or Crohn's."
  },

  ixekizumab: {
    name: "Ixekizumab",
    brand: "Taltz",
    class: "IL-17A Inhibitor",
    route: "Subcutaneous",
    indications: ["PsA", "AS", "nr-axSpA", "PsO"],
    stepTherapy: ["NSAIDs", "csDMARDs"],
    commonCriteria: [
      "Active PsA/AS/PsO inadequately controlled",
      "Negative TB test",
      "No active IBD",
      "CBC monitoring for neutropenia"
    ],
    labsRequired: ["TB test", "CBC", "CMP"],
    icd10: { "PsA": "L40.50", "AS": "M45.9", "PsO": "L40.0" },
    jcode: "J1721",
    notes: "Avoid in IBD. Strong skin clearance data — may be preferred for PsA with prominent skin disease."
  },

  bimekizumab: {
    name: "Bimekizumab",
    brand: "Bimzelx",
    class: "IL-17A/F Inhibitor",
    route: "Subcutaneous",
    indications: ["PsO", "PsA", "AS"],
    stepTherapy: ["csDMARDs", "TNF-inhibitor"],
    commonCriteria: [
      "Moderate-to-severe plaque psoriasis or active PsA/AS",
      "Inadequate response to prior therapy",
      "Dual IL-17 A+F inhibition — newer mechanism",
      "TB screening required"
    ],
    labsRequired: ["TB test", "CBC", "CMP"],
    icd10: { "PsO": "L40.0, L40.9", "PsA": "L40.50", "AS": "M45.9" },
    jcode: "J0706",
    notes: "Newest IL-17 inhibitor. Expect aggressive step therapy requirements. Document prior biologic failures clearly."
  },

  // ── IL-12/23 Inhibitors ─────────────────────────────────
  ustekinumab: {
    name: "Ustekinumab",
    brand: "Stelara",
    class: "IL-12/23 Inhibitor",
    route: "SC or IV (induction for IBD)",
    indications: ["PsA", "PsO", "CD", "UC"],
    stepTherapy: ["csDMARDs", "TNF-inhibitor (some payers for PsA)"],
    commonCriteria: [
      "Active PsA or moderate-to-severe plaque psoriasis",
      "TB screening required",
      "No live vaccines within 1 year prior",
      "Dose weight-based for PsO"
    ],
    labsRequired: ["TB test", "CBC", "CMP"],
    icd10: { "PsA": "L40.50", "PsO": "L40.0", "CD": "K50.90", "UC": "K51.90" },
    jcode: "J3245",
    notes: "Biosimilar (Wezlana) available. Good safety profile. Single pathway inhibition."
  },

  // ── IL-23 Inhibitors ────────────────────────────────────
  guselkumab: {
    name: "Guselkumab",
    brand: "Tremfya",
    class: "IL-23 Inhibitor",
    route: "Subcutaneous",
    indications: ["PsA", "PsO"],
    stepTherapy: ["csDMARDs", "TNF-inhibitor (some payers)"],
    commonCriteria: [
      "Active PsA inadequately controlled on csDMARDs",
      "TB screening required",
      "Prior biologic failure may be required"
    ],
    labsRequired: ["TB test", "CBC", "CMP"],
    icd10: { "PsA": "L40.50", "PsO": "L40.0" },
    jcode: "J1743",
    notes: "First IL-23 inhibitor approved for PsA. Strong skin data."
  },

  risankizumab: {
    name: "Risankizumab",
    brand: "Skyrizi",
    class: "IL-23 Inhibitor",
    route: "SC or IV",
    indications: ["PsA", "PsO", "CD", "UC"],
    stepTherapy: ["csDMARDs", "TNF-inhibitor"],
    commonCriteria: [
      "Active disease inadequately controlled on prior therapy",
      "TB screening required",
      "Document prior csDMARD and biologic failures for IBD indications"
    ],
    labsRequired: ["TB test", "CBC", "CMP"],
    icd10: { "PsA": "L40.50", "PsO": "L40.0", "CD": "K50.90", "UC": "K51.90" },
    jcode: "J0222",
    notes: "IV formulation for CD/UC induction. Strong efficacy data across multiple conditions."
  },

  // ── B-Cell Targeted ─────────────────────────────────────
  rituximab: {
    name: "Rituximab",
    brand: "Rituxan",
    class: "Anti-CD20 (B-cell depletion)",
    route: "IV Infusion",
    indications: ["RA", "GPA", "MPA", "Vasculitis", "Lupus", "IIM"],
    stepTherapy: ["methotrexate", "TNF-inhibitor (RA)"],
    commonCriteria: [
      "RA: Failure of MTX + 1 TNF inhibitor",
      "Vasculitis (GPA/MPA): first-line option",
      "Hepatitis B screening MANDATORY — reactivation risk",
      "Immunoglobulin levels at baseline",
      "No live vaccines 4 weeks prior",
      "Pre-medicate with corticosteroids and antihistamine"
    ],
    labsRequired: ["CBC", "CMP", "Hepatitis B surface antigen", "Hepatitis B core antibody", "IgG levels", "TB test"],
    icd10: { "RA": "M05.79, M06.9", "GPA": "M31.30, M31.31", "Vasculitis": "M31.9" },
    jcode: "J9312",
    notes: "⚠ CRITICAL: Hepatitis B reactivation can be fatal. Biosimilars (Truxima, Ruxience, Riabni) often required."
  },

  belimumab: {
    name: "Belimumab",
    brand: "Benlysta",
    class: "BLyS/BAFF Inhibitor",
    route: "IV or SC",
    indications: ["SLE", "LN"],
    stepTherapy: ["hydroxychloroquine", "azathioprine", "mycophenolate"],
    commonCriteria: [
      "Active SLE with auto-antibody positivity (ANA+, anti-dsDNA+)",
      "Inadequate response to standard therapy",
      "SLEDAI or BILAG score documentation",
      "Not for severe active CNS lupus",
      "Not for severe active lupus nephritis (consider voclosporin)"
    ],
    labsRequired: ["CBC", "CMP", "dsDNA antibody", "Complement C3/C4", "UA with microscopy", "TB test"],
    icd10: { "SLE": "M32.19, M32.9", "LN": "M32.14, N08" },
    jcode: "J0490",
    notes: "Document SLEDAI ≥ 6 and serologic activity. ANA/dsDNA positivity often required by payers."
  },

  anifrolumab: {
    name: "Anifrolumab",
    brand: "Saphnelo",
    class: "Type I Interferon Receptor Inhibitor",
    route: "IV Infusion",
    indications: ["SLE"],
    stepTherapy: ["hydroxychloroquine", "azathioprine", "mycophenolate", "belimumab (some payers)"],
    commonCriteria: [
      "Moderate-to-severe active SLE on background therapy",
      "SLEDAI documentation required",
      "No active lupus nephritis or CNS lupus",
      "TB screening required",
      "Herpes zoster vaccination prior recommended"
    ],
    labsRequired: ["CBC", "CMP", "dsDNA", "Complement levels", "TB test", "UA"],
    icd10: { "SLE": "M32.19, M32.9" },
    jcode: "J0222",
    notes: "Newest SLE biologic. Expect significant step therapy requirements. IFN gene signature test may be required by some payers."
  },

  // ── T-Cell Co-stimulation ────────────────────────────────
  abatacept: {
    name: "Abatacept",
    brand: "Orencia",
    class: "T-Cell Co-stimulation Inhibitor (CTLA4-Ig)",
    route: "IV or SC",
    indications: ["RA", "PsA", "JIA"],
    stepTherapy: ["methotrexate", "leflunomide", "TNF-inhibitor (most payers)"],
    commonCriteria: [
      "Failure of MTX + 1 TNFi",
      "Active moderate-to-severe RA",
      "Preferred in patients with seropositive RA (RF+, anti-CCP+)",
      "TB screening required",
      "COPD patients — increased risk of pulmonary adverse events"
    ],
    labsRequired: ["CBC", "CMP", "TB test", "Hepatitis panel", "RF, anti-CCP (document seropositivity)"],
    icd10: { "RA": "M05.79, M06.9", "PsA": "L40.50", "JIA": "M08.00" },
    jcode: "J0129",
    notes: "Consider in RF/anti-CCP positive patients. May be preferred in those failing TNFi due to immunogenicity."
  },

  // ── Complement Inhibitors / Other ────────────────────────
  avacopan: {
    name: "Avacopan",
    brand: "Tavneos",
    class: "C5aR Inhibitor",
    route: "Oral",
    indications: ["GPA", "MPA"],
    stepTherapy: ["cyclophosphamide", "rituximab"],
    commonCriteria: [
      "ANCA-associated vasculitis (GPA or MPA)",
      "Use in combination with rituximab or cyclophosphamide",
      "PR3-ANCA or MPO-ANCA positivity",
      "Complement levels may be monitored",
      "Liver function monitoring required"
    ],
    labsRequired: ["CBC", "CMP with LFTs", "ANCA panel (PR3/MPO)", "Urinalysis"],
    icd10: { "GPA": "M31.30, M31.31", "MPA": "M31.7" },
    jcode: "N/A (oral)",
    notes: "Adjunctive therapy — not monotherapy. Document concurrent rituximab or CYC use in PA."
  },

  // ── Osteoporosis/Bone (often PA-required in rheum) ───────
  denosumab: {
    name: "Denosumab",
    brand: "Prolia / Xgeva",
    class: "RANK Ligand Inhibitor",
    route: "Subcutaneous",
    indications: ["Osteoporosis", "GIO", "Bone metastases"],
    stepTherapy: ["bisphosphonate (alendronate, risedronate, zoledronic acid)"],
    commonCriteria: [
      "DXA T-score ≤ -2.5, or",
      "FRAX 10-year fracture risk ≥ 20% (major) or ≥ 3% (hip), or",
      "Bisphosphonate intolerance or contraindication",
      "GIO: corticosteroid use ≥ 3 months at ≥7.5mg/day prednisone equivalent",
      "Calcium and Vitamin D levels prior to initiation",
      "Renal function — preferred over bisphosphonates in CKD"
    ],
    labsRequired: ["DXA scan results (T-score)", "Calcium", "25-OH Vitamin D", "Creatinine", "PTH if low calcium"],
    icd10: { "Osteoporosis": "M81.0, M81.8", "GIO": "M81.4" },
    jcode: "J0897",
    notes: "Drug holiday risk: discontinuation causes rebound bone loss — document carefully."
  },

  romosozumab: {
    name: "Romosozumab",
    brand: "Evenity",
    class: "Sclerostin Inhibitor",
    route: "Subcutaneous",
    indications: ["Osteoporosis (postmenopausal)"],
    stepTherapy: ["bisphosphonate", "denosumab", "teriparatide"],
    commonCriteria: [
      "DXA T-score ≤ -2.5",
      "FRAX high-fracture risk OR prior fragility fracture",
      "Bisphosphonate and denosumab failure or intolerance often required",
      "⚠ Cardiovascular risk — no use within 12 months of MI or CVA",
      "Calcium and Vitamin D supplementation required"
    ],
    labsRequired: ["DXA results", "Calcium", "Vitamin D", "Creatinine", "Cardiovascular risk assessment"],
    icd10: { "Osteoporosis": "M81.0, M81.6" },
    jcode: "J3111",
    notes: "⚠ Black Box: serious CV events. Document CV history. Most restrictive step therapy of osteoporosis meds."
  },

  // ── IL-1 Inhibitors ─────────────────────────────────────
  anakinra: {
    name: "Anakinra",
    brand: "Kineret",
    class: "IL-1 Receptor Antagonist",
    route: "Subcutaneous",
    indications: ["RA", "SJIA", "NOMID", "Gout flare", "MAS"],
    stepTherapy: ["methotrexate", "TNF-inhibitor (RA)"],
    commonCriteria: [
      "RA: Failure of MTX + 1 TNFi",
      "SJIA: Active systemic features",
      "Autoinflammatory: genetic or clinical diagnosis",
      "Daily injection compliance assessment",
      "Neutropenia monitoring required (monthly)"
    ],
    labsRequired: ["CBC monthly", "CMP", "TB test"],
    icd10: { "RA": "M05.79, M06.9", "SJIA": "M08.20" },
    jcode: "J0207",
    notes: "Less commonly used for RA due to daily injection burden. Preferred for autoinflammatory diseases."
  },

  canakinumab: {
    name: "Canakinumab",
    brand: "Ilaris",
    class: "IL-1β Inhibitor",
    route: "Subcutaneous",
    indications: ["SJIA", "AOSD", "CAPS", "FMF", "Gout flare"],
    stepTherapy: ["NSAIDs", "colchicine (gout)", "anakinra"],
    commonCriteria: [
      "SJIA/AOSD: Active disease with systemic features",
      "CAPS: Genetic testing (NLRP3 mutation) may be required",
      "Gout: ≥3 gout flares in prior 12 months, contraindication to other agents",
      "TB screening required",
      "Infection monitoring"
    ],
    labsRequired: ["CBC", "CMP", "TB test", "Genetic testing (CAPS)", "Uric acid (gout)"],
    icd10: { "SJIA": "M08.20", "AOSD": "M06.1", "Gout": "M10.9" },
    jcode: "J0638",
    notes: "Very high cost. Most payers require extensive documentation and specialist review. Orphan disease indications may qualify for expedited PA."
  },

  // ── SLE/Lupus Nephritis ──────────────────────────────────
  voclosporin: {
    name: "Voclosporin",
    brand: "Lupkynis",
    class: "Calcineurin Inhibitor",
    route: "Oral",
    indications: ["LN (Class III, IV, V)"],
    stepTherapy: ["hydroxychloroquine", "mycophenolate", "azathioprine"],
    commonCriteria: [
      "Active lupus nephritis Class III, IV, or V (biopsy preferred)",
      "In combination with mycophenolate and low-dose corticosteroids",
      "eGFR ≥ 45 at baseline",
      "Serum potassium monitoring",
      "BP monitoring (can cause hypertension)"
    ],
    labsRequired: ["CBC", "CMP with eGFR", "UA with microscopy", "Potassium", "BP", "Anti-dsDNA", "Complement"],
    icd10: { "LN": "M32.14, N08" },
    jcode: "N/A (oral)",
    notes: "Requires concurrent mycophenolate mofetil. Renal function mandatory. Document biopsy class when available."
  }
};

// ═══════════════════════════════════════════════════════════
// INSURANCE REQUIREMENTS DATABASE
// ═══════════════════════════════════════════════════════════

const INSURANCE_DATABASE = {
  unitedhealth: {
    name: "UnitedHealthcare",
    short: "UHC",
    color: "#0066CC",
    phone: "1-866-889-7054",
    fax: "1-866-889-7057",
    portal: "myuhc.com",
    paPhone: "1-888-397-8883",
    turnaround: { standard: "72 hours", urgent: "24 hours" },
    generalNotes: "UHC requires Step Therapy Exemption requests separately from PA. Document step therapy failures thoroughly.",
    stepTherapyPolicy: "Strict step therapy — requires documented failures with dates, doses, and reasons for discontinuation",
    preferredFormulary: "Prefer biosimilars; require biosimilar trial for adalimumab, infliximab, rituximab before branded",
    denialAppeals: "Level 1: internal appeal within 180 days. Level 2: external review. Peer-to-peer available within 30 days of denial.",
    drugSpecific: {
      adalimumab: {
        requirements: [
          "Diagnosis of RA, PsA, AS, PsO, or JIA with ICD-10 code",
          "Failure of 2 conventional DMARDs (MTX and 1 other for RA) — must include dates and doses",
          "⚠ Adalimumab biosimilar trial REQUIRED first (Hadlima or Hyrimoz preferred)",
          "Negative TB test (IGRA or PPD) within 12 months",
          "Hepatitis B/C screening within 12 months",
          "Labs: CBC, CMP within 6 months",
          "Prescriber must be rheumatologist or dermatologist"
        ],
        paDuration: "12 months initial, 12 months renewal",
        renewalCriteria: "Documentation of clinical response (improvement in disease activity scores, functional status)",
        specialNotes: "UHC Rheumatoid arthritis clinical programs require DAS28 or CDAI scoring for RA",
        biosimilarRequired: true
      },
      tocilizumab: {
        requirements: [
          "RA: Failure of MTX + 1 TNF inhibitor",
          "GCA: TAVITA or similar imaging + PMR/GCA diagnosis",
          "Baseline LFTs, CBC, lipid panel required",
          "Neutrophil count >2000/mm³ at baseline",
          "TB screening required"
        ],
        paDuration: "12 months",
        renewalCriteria: "Clinical response documented, labs reviewed",
        specialNotes: "GCA indication may qualify for expedited review as urgent"
      },
      rituximab: {
        requirements: [
          "RA: Failure of MTX + 2 TNF inhibitors",
          "Hepatitis B surface antigen and core antibody MANDATORY",
          "IgG levels at baseline",
          "TB screening required",
          "Biosimilar (Truxima/Ruxience) required first"
        ],
        paDuration: "12 months (2 infusion cycles)",
        biosimilarRequired: true
      },
      tofacitinib: {
        requirements: [
          "Failure of MTX + 1 TNF inhibitor",
          "Black box warning discussion documentation",
          "VTE risk assessment required",
          "Cardiovascular risk assessment",
          "Lipid panel, CBC within 3 months"
        ],
        paDuration: "12 months"
      },
      baricitinib: {
        requirements: [
          "Failure of MTX + 1 TNF inhibitor",
          "Renal function (CrCl >30 required, dose adjust 30-60)",
          "Black box warning documentation",
          "Lipid panel, CBC"
        ],
        paDuration: "12 months"
      }
    }
  },

  bcbs: {
    name: "Blue Cross Blue Shield",
    short: "BCBS",
    color: "#003087",
    phone: "Varies by state",
    fax: "Varies by state",
    portal: "bcbs.com",
    paPhone: "Varies by state/plan",
    turnaround: { standard: "3-5 business days", urgent: "24-72 hours" },
    generalNotes: "BCBS varies significantly by state. Federal BCBS (FEHBP) has different criteria. Always verify which BCBS plan.",
    stepTherapyPolicy: "Variable by state plan. Generally requires 2 csDMARDs before biologic. Some plans more lenient.",
    preferredFormulary: "Tier structure varies by plan. Some plans biosimilar-preferred, others allow branded with clinical justification.",
    denialAppeals: "Internal appeal within 180 days, external IRO available. P2P within 30 days.",
    drugSpecific: {
      adalimumab: {
        requirements: [
          "Active diagnosis with supporting ICD-10 code",
          "Failure of 2 csDMARDs (MTX + 1 other for RA)",
          "Biosimilar preferred by most BCBS plans",
          "TB screening within 12 months",
          "Hepatitis B/C screening",
          "Prescriber credentialing with BCBS"
        ],
        paDuration: "12 months, some plans 6 months initial",
        specialNotes: "Federal BCBS plans may have different formulary — verify FEHBP vs commercial"
      },
      rituximab: {
        requirements: [
          "RA: Failure of MTX + 1-2 biologics",
          "Hepatitis B testing REQUIRED",
          "Biosimilar typically required",
          "IgG baseline"
        ],
        paDuration: "12 months"
      }
    }
  },

  aetna: {
    name: "Aetna",
    short: "Aetna",
    color: "#7B2D8B",
    phone: "1-800-US-AETNA",
    fax: "1-888-654-3434",
    portal: "aetna.com",
    paPhone: "1-800-248-0299",
    turnaround: { standard: "3 business days", urgent: "24 hours" },
    generalNotes: "Aetna uses Clinical Policy Bulletins (CPBs). Reference specific CPB number in PA requests. Aetna generally requires TNFi trial before IL-6 or JAK.",
    stepTherapyPolicy: "Strict step therapy. Requires documentation with: drug name, dose, duration, reason for failure. Minimum trial period often specified.",
    preferredFormulary: "Aetna prefers biosimilars. Has separate biosimilar step therapy program.",
    denialAppeals: "Appeal within 180 days. P2P request must be within 30 days of denial decision. CPB number helps in appeals.",
    drugSpecific: {
      adalimumab: {
        requirements: [
          "Reference Aetna CPB 0174",
          "ICD-10 code matching CPB indication",
          "csDMARD failure documented per CPB specifications",
          "Biosimilar adalimumab trial required (Hadlima preferred by Aetna)",
          "TB/hepatitis B testing",
          "DAS28 or similar score for RA (≥3.2 moderate activity)"
        ],
        paDuration: "12 months",
        specialNotes: "Always cite CPB 0174 in PA submission. Aetna reviewers use this internally."
      },
      tocilizumab: {
        requirements: [
          "Reference Aetna CPB 0473",
          "RA: Failure of MTX and TNFi",
          "GCA: Must reference ACR classification criteria",
          "Lipid panel, LFTs, CBC required"
        ],
        paDuration: "12 months"
      },
      secukinumab: {
        requirements: [
          "PsA: Active disease, csDMARD failure",
          "AS: Active disease, NSAID failure",
          "TB screening",
          "Caution with IBD history — must be documented"
        ],
        paDuration: "12 months"
      }
    }
  },

  cigna: {
    name: "Cigna",
    short: "Cigna",
    color: "#006699",
    phone: "1-800-244-6224",
    fax: "1-888-745-3091",
    portal: "cigna.com",
    paPhone: "1-800-244-6224",
    turnaround: { standard: "3-5 business days", urgent: "24 hours" },
    generalNotes: "Cigna uses coverage policies (P series). Cigna requires Specialty Pharmacy Network compliance. RxPA via Cigna Specialty Pharmacy.",
    stepTherapyPolicy: "Step therapy required. Cigna has a formal Step Therapy Exception Process — document exceptions carefully.",
    preferredFormulary: "Cigna has preferred specialty pharmacy network — compliance affects PA approval.",
    denialAppeals: "Formal appeal process. P2P available. Cigna has clinical policy appeal pathway.",
    drugSpecific: {
      adalimumab: {
        requirements: [
          "Active RA/PsA/AS/PsO documented",
          "csDMARD failure (2+ for RA with MTX)",
          "Cigna preferred biosimilar adalimumab trial",
          "TB/hepatitis screening",
          "Specialty pharmacy must be in Cigna network"
        ],
        paDuration: "12 months",
        specialNotes: "Dispensed through Cigna Specialty Pharmacy or approved specialty pharmacy only"
      }
    }
  },

  humana: {
    name: "Humana",
    short: "Humana",
    color: "#007A33",
    phone: "1-800-448-6262",
    fax: "1-800-486-2620",
    portal: "humana.com",
    paPhone: "1-800-555-2546",
    turnaround: { standard: "3-5 days", urgent: "24 hours" },
    generalNotes: "Humana Medicare Advantage plans common in rheumatology. Part D vs medical benefit distinction important for SC vs IV drugs.",
    stepTherapyPolicy: "Part D biologics require step therapy under Medicare rules. Exceptions available with clinical documentation.",
    preferredFormulary: "Part D formulary-driven for oral meds. Medical benefit for IV drugs.",
    denialAppeals: "Medicare appeal rules apply for MA plans. Expedited appeal within 72 hours for urgent cases.",
    drugSpecific: {
      adalimumab: {
        requirements: [
          "Part D: formulary step therapy applies",
          "Medicare beneficiary: IRMAA considerations",
          "csDMARD failure documented",
          "Clinical necessity letter from specialist"
        ],
        paDuration: "12 months typically"
      }
    }
  },

  medicare: {
    name: "Medicare (Traditional)",
    short: "Medicare",
    color: "#CC0000",
    phone: "1-800-MEDICARE",
    fax: "N/A — contractor specific",
    portal: "cms.gov",
    paPhone: "Varies by MAC/contractor",
    turnaround: { standard: "5 business days", urgent: "3 business days" },
    generalNotes: "Traditional Medicare: Part B covers IV biologics (provider-administered). Part D covers SC/oral biologics. LCD policies vary by MAC (Medicare Administrative Contractor).",
    stepTherapyPolicy: "Part B: No formal step therapy requirement, but medical necessity must be documented. Part D: Plan-specific step therapy.",
    preferredFormulary: "Part B: ASP-based payment. Part D: PDP formulary.",
    denialAppeals: "ALJ appeal for Part B denials. Part D: Coverage determination → redetermination → reconsideration → ALJ.",
    drugSpecific: {
      rituximab: {
        requirements: [
          "ICD-10 supported by LCD (A57839 or appropriate MAC LCD)",
          "RA: Previous failure of TNFi documented",
          "Hepatitis B testing mandatory",
          "NPP/UPIN documentation for billing"
        ],
        paDuration: "Annual review"
      }
    }
  },

  medicaid: {
    name: "Medicaid",
    short: "Medicaid",
    color: "#00A550",
    phone: "State-specific",
    fax: "State-specific",
    portal: "medicaid.gov",
    paPhone: "State-specific",
    turnaround: { standard: "3-10 days varies", urgent: "24-72 hours" },
    generalNotes: "Medicaid varies dramatically by state. Managed Medicaid (MCO) has additional PA layer. Always check state-specific PDL (Preferred Drug List).",
    stepTherapyPolicy: "State-specific PDL. Medicaid often prefers generics/biosimilars. Some states have more lenient PA criteria for low-income patients.",
    preferredFormulary: "State PDL determines preferred/non-preferred status. Biosimilars almost always preferred.",
    denialAppeals: "State-specific appeal process. Federal Medicaid regulations guarantee fair hearing rights.",
    drugSpecific: {}
  }
};

// ═══════════════════════════════════════════════════════════
// DENIAL REASONS DATABASE
// ═══════════════════════════════════════════════════════════

const DENIAL_REASONS = {
  step_therapy: {
    label: "Step Therapy Not Met",
    description: "Insurer requires documented failure of preferred agents first",
    commonRebuttal: "Document all prior treatment failures with dates, doses, duration, and reason for discontinuation or inadequate response",
    appealStrategies: [
      "Provide detailed prior authorization history with dates",
      "Include objective documentation of disease activity before and during step therapy",
      "Note any clinical contraindications to required step therapy agents",
      "Reference ACR guidelines supporting direct biologic access",
      "Request step therapy exception for urgent medical necessity"
    ]
  },
  not_medically_necessary: {
    label: "Not Medically Necessary",
    description: "Insurer determined the requested treatment is not medically necessary",
    commonRebuttal: "Provide objective clinical documentation including disease activity scores, functional assessments, and failure of conservative therapy",
    appealStrategies: [
      "Submit DAS28, CDAI, SDAI, BASDAI or relevant disease activity score",
      "Include HAQ or functional assessment scores",
      "Reference ACR/EULAR treatment guidelines",
      "Attach relevant peer-reviewed literature supporting treatment",
      "Document impact on quality of life and functional status"
    ]
  },
  non_formulary: {
    label: "Non-Formulary Drug",
    description: "Requested drug is not on the insurer's formulary",
    commonRebuttal: "Request formulary exception based on medical necessity or contraindication to formulary alternatives",
    appealStrategies: [
      "Document failure of or contraindication to all formulary alternatives",
      "Specify clinical characteristics favoring requested drug",
      "Provide clinical literature supporting superiority or equivalence",
      "Request formulary exception based on unique patient factors",
      "Note FDA-approved indication not covered by formulary alternative"
    ]
  },
  missing_documentation: {
    label: "Incomplete Documentation",
    description: "Required clinical documentation was not provided or is insufficient",
    commonRebuttal: "Resubmit with complete documentation package including all required labs, notes, and clinical data",
    appealStrategies: [
      "Compile complete documentation checklist per payer requirements",
      "Include all lab results with dates (within payer-specified timeframe)",
      "Attach specialist office notes documenting disease activity",
      "Include TB/hepatitis/immunization documentation",
      "Add clinical decision-making rationale letter from physician"
    ]
  },
  off_label: {
    label: "Off-Label Use",
    description: "Requested use is not an FDA-approved indication for this drug",
    commonRebuttal: "Provide clinical evidence, compendia support, or peer-reviewed literature supporting off-label use",
    appealStrategies: [
      "Reference established compendia (DrugDex, Clinical Pharmacology)",
      "Include peer-reviewed publications supporting the use",
      "Document lack of approved alternatives for this indication",
      "Note ACR or specialty society guidelines supporting off-label use",
      "Request compassionate use or medical exception review"
    ]
  },
  duplicate_therapy: {
    label: "Duplicate/Combination Therapy",
    description: "Insurer denied due to concurrent biologic or combination therapy concern",
    commonRebuttal: "Document clinical rationale for combination, specialist supervision, and safety monitoring plan",
    appealStrategies: [
      "Provide clinical rationale for combination therapy",
      "Reference published protocols supporting combination",
      "Document risk-benefit discussion with patient",
      "Include safety monitoring plan",
      "Note specialist oversight and monitoring schedule"
    ]
  },
  biosimilar_required: {
    label: "Biosimilar Required",
    description: "Insurer requires biosimilar trial before branded biologic",
    commonRebuttal: "Either document biosimilar trial failure or clinical reason for branded product preference",
    appealStrategies: [
      "Document previous biosimilar trial if applicable (dates, adverse effects, lack of efficacy)",
      "If switching from stable branded product: document 'non-medical switching' exception policy",
      "Note patient-specific factors (injection device, concentration preference)",
      "Reference nocebo effect literature for biosimilar switching",
      "Request exception based on clinical stability on current therapy"
    ]
  },
  prior_auth_expired: {
    label: "Prior Authorization Expired",
    description: "PA was not renewed before expiration causing a gap in coverage",
    commonRebuttal: "Submit renewal with current clinical documentation demonstrating ongoing medical necessity and treatment response",
    appealStrategies: [
      "Document clinical response to current therapy",
      "Show objective improvement in disease activity scores",
      "Include most recent labs demonstrating safety monitoring",
      "Provide continuity of care argument for renewal",
      "Request retroactive coverage for gap period if patient continued therapy"
    ]
  }
};

// ═══════════════════════════════════════════════════════════
// PEER TO PEER FRAMEWORK
// ═══════════════════════════════════════════════════════════

const P2P_FRAMEWORK = {
  opening: {
    script: "Hello, this is Dr. [NAME], calling regarding a prior authorization denial for my patient [PATIENT INITIALS] [DOB]. The reference number is [PA#]. I'm requesting a peer-to-peer review. I have the clinical information ready — do you have a few minutes?",
    tips: ["Always have PA number ready", "Have patient chart open", "Have denial reason letter in front of you", "Be professional but assertive"]
  },
  keyArguments: {
    step_therapy: {
      argument: "My patient has already failed [DRUG1] at therapeutic doses for [X] months, and [DRUG2] was contraindicated due to [REASON]. The clinical evidence and ACR guidelines support this patient moving to biologic therapy. Delaying appropriate therapy risks disease progression, joint damage, and disability.",
      evidence: "ACR 2021 RA Guidelines; ACR 2022 PsA Guidelines; treat-to-target literature"
    },
    not_medically_necessary: {
      argument: "My patient has a DAS28 score of [X], indicating [moderate/severe] active disease. Their HAQ score is [X], demonstrating significant functional impairment. They have failed [DRUGS] and continue to have [SYMPTOMS]. This meets the clinical threshold for biologic therapy per published ACR guidelines.",
      evidence: "ACR treatment guidelines; disease activity score thresholds; functional impairment data"
    },
    disease_progression: {
      argument: "Imaging demonstrates [joint damage/erosions/enthesitis/sacroiliitis]. Delaying appropriate therapy is likely to result in irreversible joint damage. The cost of ongoing disability, surgery, and hospitalization exceeds the cost of the requested biologic.",
      evidence: "Radiograph/MRI reports; published data on irreversible damage without treatment"
    }
  },
  closing: {
    script: "Based on the clinical data I've presented — the documented disease activity, failed prior therapies, and ACR guidelines — I'm requesting that you reconsider and approve this authorization. If you need additional documentation, I can provide it immediately. Can we reach a decision today?",
    escalation: "If this peer-to-peer is unsuccessful, I will be submitting a formal appeal, an external independent review request, and if needed, escalating through the state insurance commissioner's office."
  }
};

// Export for use in main app
if (typeof module !== 'undefined') {
  module.exports = { DRUG_DATABASE, INSURANCE_DATABASE, DENIAL_REASONS, P2P_FRAMEWORK };
}
