# RheumAuth — Rheumatology Prior Authorization Platform

A comprehensive, AI-powered prior authorization management platform for rheumatology practices.

## Features

### 1. PA Submission Tool (4-Step Wizard)
- Drug database with 20+ rheumatology medications
- Insurance-specific requirements for UHC, BCBS, Aetna, Cigna, Humana, Medicare, Medicaid
- Step therapy documentation checklist
- AI-generated, insurer-specific PA letters
- ICD-10 codes, J-codes, lab requirements per drug

### 2. Insurance Requirements Database
- Detailed PA requirements by insurer
- Contact numbers, fax numbers, portal links
- Turnaround times (standard + urgent)
- Step therapy policy by plan
- Biosimilar requirements
- Drug-specific criteria per insurer

### 3. Denial Appeal Generator
- Denial type analysis with AI
- Targeted appeal letter generation
- Appeal strategy recommendations
- Step-by-step appeal process timeline
- Insurer-specific appeal pathways

### 4. Peer-to-Peer Preparation Tool
- AI-generated P2P call scripts
- Opening, arguments, objection handling, closing
- Insurer-specific intelligence
- Pre-call checklist
- Quick reference facts during the call

## Drugs Covered
TNF Inhibitors (Humira, Enbrel, Remicade, Cimzia, Simponi), JAK Inhibitors (Xeljanz, Olumiant, Rinvoq), IL-6 Inhibitors (Actemra, Kevzara), IL-17 Inhibitors (Cosentyx, Taltz, Bimzelx), IL-23 Inhibitors (Tremfya, Skyrizi), IL-12/23 (Stelara), B-Cell agents (Rituxan, Benlysta, Saphnelo), T-Cell (Orencia), IL-1 (Kineret, Ilaris), Bone (Prolia, Evenity), Vasculitis (Tavneos), Lupus Nephritis (Lupkynis)

## Setup

### Option 1: Use Existing RheumAuth.com Site
1. Replace current site files with these files
2. Push to GitHub — GitHub Pages will serve automatically

### Option 2: Fresh GitHub Pages Setup
1. Create repo named `yourusername.github.io` or any repo with GitHub Pages enabled
2. Upload all files maintaining folder structure
3. Enable GitHub Pages in Settings → Pages → Source: main branch

### File Structure
```
index.html          ← Main application (single page)
css/
  styles.css        ← All styles
js/
  database.js       ← Drug & insurance database (expand this!)
  app.js            ← Application logic & AI integration
README.md
```

### Adding Your API Key
1. Open the app → Settings
2. Enter your Anthropic API key (sk-ant-...)
3. Key is saved in browser localStorage — never leaves your device

OR hardcode it: In `js/app.js`, line 4:
```javascript
const ANTHROPIC_API_KEY = "sk-ant-your-key-here";
```

## Expanding the Database

### Add a New Drug
In `js/database.js`, add to `DRUG_DATABASE`:
```javascript
newDrugKey: {
  name: "Drug Name",
  brand: "Brand Name",
  class: "Drug Class",
  route: "SC / IV / Oral",
  indications: ["RA", "PsA"],
  stepTherapy: ["methotrexate", "TNF-inhibitor"],
  commonCriteria: [
    "Requirement 1",
    "Requirement 2"
  ],
  labsRequired: ["CBC", "CMP", "TB test"],
  icd10: { "RA": "M05.79" },
  jcode: "J0000",
  notes: "Any important notes"
}
```

### Add Insurance-Specific Drug Requirements
In `INSURANCE_DATABASE`, under any insurer's `drugSpecific` object:
```javascript
drugSpecific: {
  newDrugKey: {
    requirements: ["Requirement 1", "Requirement 2"],
    paDuration: "12 months",
    biosimilarRequired: false,
    specialNotes: "Any special notes for this insurer"
  }
}
```

## Technology
- Pure HTML/CSS/JavaScript — no framework dependencies
- GitHub Pages compatible (static files only)
- Anthropic Claude API for AI features
- All data stored in browser localStorage

## Roadmap
- [ ] Patient tracker / PA status management
- [ ] PDF export of letters
- [ ] Fax integration
- [ ] Calendar alerts for PA renewals
- [ ] More insurers (Centene, Molina, Anthem, Kaiser)
- [ ] State Medicaid plans
- [ ] Prior auth appeal tracker

## Legal Disclaimer
RheumAuth is a clinical decision support tool. All AI-generated content should be reviewed by a licensed physician before submission. Insurance requirements change frequently — always verify with the payer. This tool does not constitute legal or medical advice.
