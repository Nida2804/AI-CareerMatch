import './style.css';
import { JOB_ROLES, getRoleById } from './data/rolesData.js';
import { SAMPLE_RESUMES } from './data/sampleResumes.js';
import { parseResumeFile, detectResumeSections } from './utils/fileParser.js';
import { analyzeResumeAndJob } from './utils/analyzer.js';
import { copyAnalysisToClipboard, downloadTxtReport } from './utils/exporter.js';

// Application State
const state = {
  theme: localStorage.getItem('careermatch_theme') || 'dark',
  resumeFile: null,
  resumeText: '',
  resumeMeta: null,
  selectedRoleId: 'ai_engineer',
  targetJobTitle: '',
  jobDescription: '',
  analysis: null,
  activeSkillTab: 'matched',
  isDirectTextOpen: false,
  isAnalyzing: false
};

// Apply Initial Theme
document.documentElement.setAttribute('data-theme', state.theme);

// Initialize default role
const initialRole = getRoleById(state.selectedRoleId);
state.targetJobTitle = initialRole.defaultJobTitle;
state.jobDescription = initialRole.sampleJobDescription;

/**
 * Toast Notification Dispatcher
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '⚠️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Render Main App Template
 */
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="brand-wrapper">
          <div class="brand-icon-wrapper">⚡</div>
          <div class="brand-text">
            <h1>AI CareerMatch <span class="brand-badge">PRO ANALYZER</span></h1>
            <p class="brand-subtitle">AI-Powered Resume & Job Description Compatibility Engine</p>
          </div>
        </div>

        <div class="header-actions">
          <button class="btn btn-secondary" id="btn-demo-fill" title="Load sample candidate & job description">
            <span>✨</span> Load Sample AI Demo
          </button>
          <button class="btn btn-secondary" id="btn-theme-toggle" title="Toggle theme">
            <span id="theme-icon">${state.theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
          <button class="btn btn-danger-ghost" id="btn-reset-app" title="Reset all inputs">
            <span>🔄</span> Reset
          </button>
        </div>
      </header>

      <!-- Main Layout -->
      <main class="main-layout">
        <!-- Left Panel: Inputs -->
        <div class="panel">
          <!-- Step 1: Upload Resume -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="card-step-badge">1</span>
                <h2 class="card-title">Upload Resume</h2>
              </div>
              <button class="btn-ghost" id="btn-toggle-direct-text" style="font-size: 0.78rem;">
                ${state.isDirectTextOpen ? '✕ Hide Text' : '✍️ Edit / Paste Text'}
              </button>
            </div>
            <p class="card-subtitle">Upload a PDF, DOCX, or TXT resume document.</p>

            <!-- Dropzone -->
            <div class="dropzone-container" id="resume-dropzone">
              <div class="dropzone-icon">📄</div>
              <div class="dropzone-title">Click to browse or drag & drop resume</div>
              <p class="dropzone-desc">Automated text parsing for PDF and Word DOCX</p>
              <div class="dropzone-badges">
                <span class="file-type-badge">PDF</span>
                <span class="file-type-badge">DOCX</span>
                <span class="file-type-badge">TXT</span>
              </div>
              <input type="file" id="resume-file-input" class="file-input-hidden" accept=".pdf,.docx,.txt" />
            </div>

            <!-- Uploaded File Banner -->
            <div id="file-banner" class="uploaded-file-banner" style="display: none;">
              <div class="file-info-group">
                <span class="file-icon-badge" id="file-icon-display">📄</span>
                <div class="file-details">
                  <span class="file-name" id="file-name-display">resume.pdf</span>
                  <span class="file-stats" id="file-stats-display">0 KB</span>
                </div>
              </div>
              <button class="btn-ghost" id="btn-remove-file" style="color: #ef4444;" title="Remove file">✕</button>
            </div>

            <!-- Direct Text Editor (Collapsible) -->
            <div class="resume-textarea-wrapper ${state.isDirectTextOpen ? 'active' : ''}" id="direct-text-wrapper">
              <label class="input-label" for="resume-direct-textarea">Resume Plain Text Content:</label>
              <textarea 
                id="resume-direct-textarea" 
                class="text-input textarea-input" 
                placeholder="Paste your raw resume text here or inspect parsed text..."
              >${state.resumeText}</textarea>
              <div class="textarea-footer">
                <span id="resume-word-count">0 words</span>
                <button class="btn-ghost" id="btn-clear-resume-text" style="font-size: 0.72rem;">Clear Text</button>
              </div>
            </div>

            <!-- Sample Resume Quick Picker -->
            <div class="sample-resumes-container">
              <span class="sample-label">Or load sample candidate:</span>
              <button class="sample-chip" data-sample-id="sample_ai_engineer">🤖 AI Engineer</button>
              <button class="sample-chip" data-sample-id="sample_fullstack_dev">🌐 Web Developer</button>
              <button class="sample-chip" data-sample-id="sample_data_analyst">📊 Data Analyst</button>
              <button class="sample-chip" data-sample-id="sample_tech_support">🛠️ Tech Support</button>
            </div>
          </div>

          <!-- Step 2: Target Job Role -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="card-step-badge">2</span>
                <h2 class="card-title">Select Target Role</h2>
              </div>
              <button class="btn-ghost" id="btn-load-sample-jd" style="font-size: 0.78rem;" title="Fill JD for this role">
                ⚡ Auto-fill Role JD
              </button>
            </div>
            <p class="card-subtitle">Choose one of the 12 specialized technology domains.</p>

            <select id="role-select" class="role-select-box">
              ${JOB_ROLES.map(role => `
                <option value="${role.id}" ${role.id === state.selectedRoleId ? 'selected' : ''}>
                  ${role.icon} ${role.title} (${role.category})
                </option>
              `).join('')}
            </select>

            <div class="role-meta-preview" id="role-meta-preview">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <!-- Step 3: Job Description & Target Title -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="card-step-badge">3</span>
                <h2 class="card-title">Job Description</h2>
              </div>
            </div>
            <p class="card-subtitle">Enter specific position details and requirements.</p>

            <div class="input-group">
              <label class="input-label" for="target-job-title-input">Target Job Title:</label>
              <input 
                type="text" 
                id="target-job-title-input" 
                class="text-input" 
                placeholder="e.g. Senior AI Engineer" 
                value="${state.targetJobTitle}" 
              />
            </div>

            <div class="input-group">
              <label class="input-label" for="job-description-textarea">Job Description Text:</label>
              <textarea 
                id="job-description-textarea" 
                class="text-input textarea-input" 
                placeholder="Paste the full job posting requirements here..."
                style="min-height: 180px;"
              >${state.jobDescription}</textarea>
              <div class="textarea-footer">
                <span id="jd-word-count">0 words</span>
                <button class="btn-ghost" id="btn-clear-jd-text" style="font-size: 0.72rem;">Clear JD</button>
              </div>
            </div>

            <!-- Run Analysis Button -->
            <button class="btn btn-primary run-analysis-btn" id="btn-run-analysis">
              <span>⚡</span> Run AI Match Analysis
            </button>
          </div>
        </div>

        <!-- Right Panel: Analysis Results -->
        <div class="panel" id="results-panel">
          <!-- Rendered dynamically based on state -->
        </div>
      </main>
    </div>

    <!-- Toast Notification Container -->
    <div id="toast-container" class="toast-container"></div>
  `;

  attachEventListeners();
  updateRoleMetaPreview();
  updateWordCounts();
  renderResultsPanel();
}

/**
 * Updates the preview card showing the selected role's core competencies.
 */
function updateRoleMetaPreview() {
  const container = document.getElementById('role-meta-preview');
  if (!container) return;

  const role = getRoleById(state.selectedRoleId);
  container.innerHTML = `
    <p class="role-meta-desc">${role.description}</p>
    <div class="core-pill-label">Core Competencies Weighted in Score:</div>
    <div class="role-core-pills">
      ${role.coreMandatorySkills.map(s => `<span class="mini-pill">${s.replace(/_/g, ' ')}</span>`).join('')}
    </div>
  `;
}

/**
 * Updates text character and word counts.
 */
function updateWordCounts() {
  const resumeCount = document.getElementById('resume-word-count');
  if (resumeCount) {
    const words = state.resumeText.trim().split(/\s+/).filter(Boolean).length;
    resumeCount.textContent = `${words} words`;
  }

  const jdCount = document.getElementById('jd-word-count');
  if (jdCount) {
    const words = state.jobDescription.trim().split(/\s+/).filter(Boolean).length;
    jdCount.textContent = `${words} words`;
  }
}

/**
 * Renders the Right Panel (Empty, Analyzing, or Active Analysis Results)
 */
function renderResultsPanel() {
  const panel = document.getElementById('results-panel');
  if (!panel) return;

  // 1. Loading / Analyzing State
  if (state.isAnalyzing) {
    panel.innerHTML = `
      <div class="glass-card analyzing-container">
        <div class="radar-spinner"></div>
        <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Analyzing Compatibility Matrix...</h2>
        <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 400px;">
          Extracting skills, cross-referencing industry competencies, evaluating keyword density, and synthesizing actionable recommendations.
        </p>
      </div>
    `;
    return;
  }

  // 2. Empty / Ready State
  if (!state.analysis) {
    panel.innerHTML = `
      <div class="glass-card empty-state-card">
        <div class="empty-state-icon">🎯</div>
        <h2 class="empty-state-title">Ready for Match Analysis</h2>
        <p class="empty-state-desc">
          Upload your resume in PDF, DOCX, or text format, select your target role, and click <strong>"Run AI Match Analysis"</strong> to generate your score, missing skills, and optimization report.
        </p>
        <button class="btn btn-primary" id="btn-empty-demo">
          <span>✨</span> Try AI Engineer Demo
        </button>
      </div>
    `;

    document.getElementById('btn-empty-demo')?.addEventListener('click', () => {
      loadSampleResume('sample_ai_engineer');
      executeAnalysis();
    });
    return;
  }

  // 3. Active Results Dashboard
  const { analysis } = state;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (analysis.matchScore / 100) * circumference;

  panel.innerHTML = `
    <!-- Results Top Actions Bar -->
    <div class="results-action-bar">
      <div class="role-switcher-group">
        <span class="role-switcher-label">Switch Role:</span>
        <select id="quick-role-switcher" class="role-switcher-select">
          ${JOB_ROLES.map(role => `
            <option value="${role.id}" ${role.id === state.selectedRoleId ? 'selected' : ''}>
              ${role.icon} ${role.title}
            </option>
          `).join('')}
        </select>
      </div>

      <div class="export-actions-group">
        <button class="btn btn-secondary" id="btn-copy-analysis" title="Copy full report to clipboard">
          <span>📋</span> Copy Report
        </button>
        <button class="btn btn-primary" id="btn-download-txt" title="Download report as .txt file">
          <span>📥</span> Download TXT
        </button>
        <button class="btn btn-ghost" id="btn-reanalyze" title="Re-run analysis">
          <span>🔄</span> Re-Analyze
        </button>
      </div>
    </div>

    <!-- Overall Match Score Hero Card -->
    <div class="glass-card score-hero-card">
      <div class="score-gauge-wrapper">
        <svg class="score-svg-circle" viewBox="0 0 170 170">
          <circle class="score-bg-circle" cx="85" cy="85" r="${radius}" />
          <circle 
            class="score-progress-circle" 
            cx="85" 
            cy="85" 
            r="${radius}" 
            stroke="${analysis.tierColor}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${strokeDashoffset}"
          />
        </svg>
        <div class="score-center-content">
          <div class="score-big-number" style="color: ${analysis.tierColor};">
            ${analysis.matchScore}<span class="score-percent-symbol">%</span>
          </div>
          <span class="score-label">MATCH SCORE</span>
        </div>
      </div>

      <div class="score-meta-content">
        <div class="tier-badge ${analysis.tierClass}">
          <span>●</span> ${analysis.tier} • ${analysis.tierBadge}
        </div>
        <h2 class="score-target-title">${analysis.targetJobTitle}</h2>
        <p class="score-role-subtitle">
          Evaluated against <strong>${analysis.role.title}</strong> standards (${analysis.counts.matched} matched • ${analysis.counts.missing} missing • ${analysis.counts.underrepresented} underrepresented)
        </p>

        <!-- Sub-score Breakdown Bars -->
        <div class="subscores-grid">
          <div class="subscore-item">
            <div class="subscore-header">
              <span>Role Core Competencies</span>
              <span class="subscore-val">${analysis.subScores.roleCoreScore}%</span>
            </div>
            <div class="subscore-bar-bg">
              <div class="subscore-bar-fill" style="width: ${analysis.subScores.roleCoreScore}%; background: #6366f1;"></div>
            </div>
          </div>

          <div class="subscore-item">
            <div class="subscore-header">
              <span>Job Description Overlap</span>
              <span class="subscore-val">${analysis.subScores.jdMatchScore}%</span>
            </div>
            <div class="subscore-bar-bg">
              <div class="subscore-bar-fill" style="width: ${analysis.subScores.jdMatchScore}%; background: #06b6d4;"></div>
            </div>
          </div>

          <div class="subscore-item">
            <div class="subscore-header">
              <span>Skill Depth & Balance</span>
              <span class="subscore-val">${analysis.subScores.depthScore}%</span>
            </div>
            <div class="subscore-bar-bg">
              <div class="subscore-bar-fill" style="width: ${analysis.subScores.depthScore}%; background: #10b981;"></div>
            </div>
          </div>

          <div class="subscore-item">
            <div class="subscore-header">
              <span>ATS Quality & Structure</span>
              <span class="subscore-val">${analysis.subScores.structureScore}%</span>
            </div>
            <div class="subscore-bar-bg">
              <div class="subscore-bar-fill" style="width: ${analysis.subScores.structureScore}%; background: #f59e0b;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Score Explanation Narrative Card -->
    <div class="glass-card explanation-card">
      <div class="card-header">
        <div class="card-title-group">
          <span style="font-size: 1.25rem;">💡</span>
          <h3 class="card-title">Score Explanation & Analysis</h3>
        </div>
      </div>
      <div class="explanation-body">
        ${analysis.explanation.replace(/\n\n/g, '<br/><br/>')}
      </div>
    </div>

    <!-- Skills Intelligence Matrix -->
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title-group">
          <span style="font-size: 1.25rem;">🧩</span>
          <h3 class="card-title">Skills Breakdown</h3>
        </div>
      </div>

      <!-- Skill Tabs -->
      <div class="skills-tab-nav">
        <button class="skill-tab-btn ${state.activeSkillTab === 'matched' ? 'active' : ''}" data-tab="matched">
          <span>✓ Matched Skills</span>
          <span class="tab-count-badge">${analysis.matchedSkills.length}</span>
        </button>
        <button class="skill-tab-btn ${state.activeSkillTab === 'missing' ? 'active' : ''}" data-tab="missing">
          <span>✕ Missing Skills</span>
          <span class="tab-count-badge">${analysis.missingSkills.length}</span>
        </button>
        <button class="skill-tab-btn ${state.activeSkillTab === 'underrepresented' ? 'active' : ''}" data-tab="underrepresented">
          <span>⚠️ Underrepresented</span>
          <span class="tab-count-badge">${analysis.underrepresentedSkills.length}</span>
        </button>
      </div>

      <!-- Skill Pills Container -->
      <div class="skills-pills-flow" id="skills-pills-container">
        ${renderSkillPills(analysis, state.activeSkillTab)}
      </div>
    </div>

    <!-- Actionable AI Recommendations -->
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title-group">
          <span style="font-size: 1.25rem;">🚀</span>
          <h3 class="card-title">Actionable AI Recommendations</h3>
        </div>
      </div>
      <p class="card-subtitle">Strategic revisions to optimize your resume for recruiters and ATS filters.</p>

      <div class="recommendation-list">
        ${analysis.recommendations.map(rec => `
          <div class="recommendation-item">
            <div class="rec-icon">${rec.icon}</div>
            <div class="rec-content">
              <h4 class="rec-title">${rec.title}</h4>
              <p class="rec-desc">${rec.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  attachResultsEventListeners();
}

/**
 * Generates HTML for the skill pills according to active tab.
 */
function renderSkillPills(analysis, tab) {
  if (tab === 'matched') {
    if (analysis.matchedSkills.length === 0) {
      return `<p style="color: var(--text-dim); font-size: 0.85rem;">No skills directly matched.</p>`;
    }
    return analysis.matchedSkills.map(skill => `
      <span class="skill-tag skill-tag-matched">
        <span>✓</span>
        <span>${skill.name}</span>
        <span class="tag-freq-badge">${skill.resumeCount}x in resume</span>
        ${skill.isRoleCore ? `<span class="core-indicator">CORE</span>` : ''}
      </span>
    `).join('');
  }

  if (tab === 'missing') {
    if (analysis.missingSkills.length === 0) {
      return `<p style="color: #34d399; font-size: 0.85rem;">Outstanding! All requested technical skills are matched in your resume.</p>`;
    }
    return analysis.missingSkills.map(skill => {
      const isCritical = skill.priority === 'Critical';
      const className = isCritical ? 'skill-tag-missing-critical' : 'skill-tag-missing-recommended';
      return `
        <span class="skill-tag ${className}">
          <span>✕</span>
          <span>${skill.name}</span>
          <span class="tag-freq-badge">${isCritical ? 'Critical' : 'Recommended'}</span>
          ${skill.jdCount > 0 ? `<span style="font-size: 0.65rem; opacity: 0.8;">(${skill.jdCount}x in JD)</span>` : ''}
        </span>
      `;
    }).join('');
  }

  if (tab === 'underrepresented') {
    if (analysis.underrepresentedSkills.length === 0) {
      return `<p style="color: var(--text-muted); font-size: 0.85rem;">No underrepresented skills detected. All identified skills are appropriately reinforced in your resume.</p>`;
    }
    return analysis.underrepresentedSkills.map(skill => `
      <span class="skill-tag skill-tag-underrepresented" title="${skill.note}">
        <span>⚠️</span>
        <span>${skill.name}</span>
        <span class="tag-freq-badge">Only 1x in resume</span>
      </span>
    `).join('');
  }

  return '';
}

/**
 * Event Listeners for Result Panel Interactions
 */
function attachResultsEventListeners() {
  // Quick Role Switcher
  const quickSwitcher = document.getElementById('quick-role-switcher');
  if (quickSwitcher) {
    quickSwitcher.addEventListener('change', (e) => {
      const newRoleId = e.target.value;
      state.selectedRoleId = newRoleId;

      // Update main select
      const mainSelect = document.getElementById('role-select');
      if (mainSelect) mainSelect.value = newRoleId;

      // Auto-update target title
      const role = getRoleById(newRoleId);
      state.targetJobTitle = role.defaultJobTitle;
      const titleInput = document.getElementById('target-job-title-input');
      if (titleInput) titleInput.value = role.defaultJobTitle;

      updateRoleMetaPreview();
      executeAnalysis();
      showToast(`Switched analysis to ${role.title}`);
    });
  }

  // Copy Analysis Button
  document.getElementById('btn-copy-analysis')?.addEventListener('click', async () => {
    if (!state.analysis) return;
    const success = await copyAnalysisToClipboard(state.analysis);
    if (success) {
      showToast('Analysis report copied to clipboard!');
    } else {
      showToast('Failed to copy to clipboard.', 'error');
    }
  });

  // Download TXT Button
  document.getElementById('btn-download-txt')?.addEventListener('click', () => {
    if (!state.analysis) return;
    downloadTxtReport(state.analysis);
    showToast('CareerMatch TXT report downloaded!');
  });

  // Re-Analyze Button
  document.getElementById('btn-reanalyze')?.addEventListener('click', () => {
    executeAnalysis();
  });

  // Skills Tabs
  document.querySelectorAll('.skill-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeSkillTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.skill-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const container = document.getElementById('skills-pills-container');
      if (container) {
        container.innerHTML = renderSkillPills(state.analysis, state.activeSkillTab);
      }
    });
  });
}

/**
 * Executes the core analysis with validation and animations.
 */
function executeAnalysis() {
  // Read current inputs
  const titleInput = document.getElementById('target-job-title-input');
  if (titleInput) state.targetJobTitle = titleInput.value;

  const jdTextarea = document.getElementById('job-description-textarea');
  if (jdTextarea) state.jobDescription = jdTextarea.value;

  const resumeTextarea = document.getElementById('resume-direct-textarea');
  if (resumeTextarea && (!state.resumeText || state.isDirectTextOpen)) {
    state.resumeText = resumeTextarea.value;
  }

  // Validation
  if (!state.resumeText || state.resumeText.trim().length < 20) {
    showToast('Please upload a resume file or paste resume text first.', 'error');
    // Open the direct text drawer to help user
    state.isDirectTextOpen = true;
    const wrapper = document.getElementById('direct-text-wrapper');
    if (wrapper) wrapper.classList.add('active');
    return;
  }

  if (!state.jobDescription || state.jobDescription.trim().length < 20) {
    showToast('Please provide a job description with at least 20 characters.', 'error');
    return;
  }

  state.isAnalyzing = true;
  renderResultsPanel();

  // Subtle realistic scan delay for smooth user experience
  setTimeout(() => {
    try {
      state.analysis = analyzeResumeAndJob({
        resumeText: state.resumeText,
        jobDescription: state.jobDescription,
        roleId: state.selectedRoleId,
        targetJobTitle: state.targetJobTitle
      });

      state.isAnalyzing = false;
      renderResultsPanel();
      showToast(`Analysis complete: ${state.analysis.matchScore}% Match!`);
    } catch (err) {
      state.isAnalyzing = false;
      renderResultsPanel();
      showToast(err.message || 'Analysis error occurred.', 'error');
    }
  }, 450);
}

/**
 * Loads one of the built-in sample resumes.
 */
function loadSampleResume(sampleId) {
  const sample = SAMPLE_RESUMES.find(s => s.id === sampleId) || SAMPLE_RESUMES[0];
  state.resumeText = sample.text;
  state.selectedRoleId = sample.roleTarget;

  const role = getRoleById(sample.roleTarget);
  state.targetJobTitle = role.defaultJobTitle;
  state.jobDescription = role.sampleJobDescription;

  // Update UI Elements
  const roleSelect = document.getElementById('role-select');
  if (roleSelect) roleSelect.value = sample.roleTarget;

  const titleInput = document.getElementById('target-job-title-input');
  if (titleInput) titleInput.value = role.defaultJobTitle;

  const jdTextarea = document.getElementById('job-description-textarea');
  if (jdTextarea) jdTextarea.value = role.sampleJobDescription;

  const resumeTextarea = document.getElementById('resume-direct-textarea');
  if (resumeTextarea) resumeTextarea.value = sample.text;

  // Show banner
  const fileBanner = document.getElementById('file-banner');
  const fileNameDisplay = document.getElementById('file-name-display');
  const fileStatsDisplay = document.getElementById('file-stats-display');
  if (fileBanner && fileNameDisplay && fileStatsDisplay) {
    fileBanner.style.display = 'flex';
    fileNameDisplay.textContent = `${sample.name}.txt`;
    fileStatsDisplay.textContent = `Sample Candidate • ${sample.text.length} chars`;
  }

  updateRoleMetaPreview();
  updateWordCounts();
  showToast(`Loaded ${sample.name}`);
}

/**
 * Handles File Upload & Text Extraction
 */
async function handleFileUpload(file) {
  if (!file) return;

  const banner = document.getElementById('file-banner');
  const fileNameDisplay = document.getElementById('file-name-display');
  const fileStatsDisplay = document.getElementById('file-stats-display');
  const iconDisplay = document.getElementById('file-icon-display');

  if (banner && fileNameDisplay) {
    banner.style.display = 'flex';
    fileNameDisplay.textContent = file.name;
    fileStatsDisplay.textContent = 'Parsing document text...';
    iconDisplay.textContent = '⏳';
  }

  try {
    const parsed = await parseResumeFile(file);
    state.resumeText = parsed.text;
    state.resumeFile = file;
    state.resumeMeta = parsed.metadata;

    // Update Banner
    if (fileStatsDisplay && iconDisplay) {
      const sizeKb = (file.size / 1024).toFixed(1);
      const pageInfo = parsed.metadata.pageCount ? ` • ${parsed.metadata.pageCount} pages` : '';
      fileStatsDisplay.textContent = `${parsed.metadata.fileType} • ${sizeKb} KB${pageInfo}`;
      iconDisplay.textContent = parsed.metadata.fileType === 'PDF' ? '📕' : (parsed.metadata.fileType === 'DOCX' ? '📘' : '📄');
    }

    // Update Textarea
    const resumeTextarea = document.getElementById('resume-direct-textarea');
    if (resumeTextarea) resumeTextarea.value = parsed.text;

    updateWordCounts();
    showToast(`Successfully extracted text from ${file.name}`);

    // If Job description already exists, prompt user or auto-ready
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Failed to read document.', 'error');
    if (fileStatsDisplay && iconDisplay) {
      fileStatsDisplay.textContent = 'Extraction failed. You can paste text below.';
      iconDisplay.textContent = '⚠️';
    }
  }
}

/**
 * Global Event Listeners Setup
 */
function attachEventListeners() {
  // Theme Toggle
  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('careermatch_theme', state.theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.textContent = state.theme === 'dark' ? '☀️' : '🌙';
  });

  // Demo Fill Button in Header
  document.getElementById('btn-demo-fill')?.addEventListener('click', () => {
    loadSampleResume('sample_ai_engineer');
    executeAnalysis();
  });

  // App Reset
  document.getElementById('btn-reset-app')?.addEventListener('click', () => {
    state.resumeFile = null;
    state.resumeText = '';
    state.resumeMeta = null;
    state.analysis = null;
    state.activeSkillTab = 'matched';

    const defaultRole = getRoleById('ai_engineer');
    state.selectedRoleId = 'ai_engineer';
    state.targetJobTitle = defaultRole.defaultJobTitle;
    state.jobDescription = defaultRole.sampleJobDescription;

    renderApp();
    showToast('Reset completed. Ready for a new analysis.');
  });

  // File Dropzone & Input
  const dropzone = document.getElementById('resume-dropzone');
  const fileInput = document.getElementById('resume-file-input');

  dropzone?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  });

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-over');
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });

  // Remove File Button
  document.getElementById('btn-remove-file')?.addEventListener('click', () => {
    state.resumeFile = null;
    state.resumeText = '';
    const banner = document.getElementById('file-banner');
    if (banner) banner.style.display = 'none';
    const resumeTextarea = document.getElementById('resume-direct-textarea');
    if (resumeTextarea) resumeTextarea.value = '';
    if (fileInput) fileInput.value = '';
    updateWordCounts();
    showToast('File removed.');
  });

  // Toggle Direct Text Editor
  document.getElementById('btn-toggle-direct-text')?.addEventListener('click', () => {
    state.isDirectTextOpen = !state.isDirectTextOpen;
    const wrapper = document.getElementById('direct-text-wrapper');
    const btn = document.getElementById('btn-toggle-direct-text');
    if (wrapper) wrapper.classList.toggle('active', state.isDirectTextOpen);
    if (btn) btn.textContent = state.isDirectTextOpen ? '✕ Hide Text' : '✍️ Edit / Paste Text';
  });

  // Resume Textarea input
  document.getElementById('resume-direct-textarea')?.addEventListener('input', (e) => {
    state.resumeText = e.target.value;
    updateWordCounts();
  });

  document.getElementById('btn-clear-resume-text')?.addEventListener('click', () => {
    state.resumeText = '';
    const textarea = document.getElementById('resume-direct-textarea');
    if (textarea) textarea.value = '';
    updateWordCounts();
  });

  // Sample Resumes Chips
  document.querySelectorAll('.sample-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const sampleId = chip.getAttribute('data-sample-id');
      loadSampleResume(sampleId);
    });
  });

  // Role Select
  const roleSelect = document.getElementById('role-select');
  roleSelect?.addEventListener('change', (e) => {
    const newRoleId = e.target.value;
    state.selectedRoleId = newRoleId;
    const role = getRoleById(newRoleId);

    // Update target job title
    state.targetJobTitle = role.defaultJobTitle;
    const titleInput = document.getElementById('target-job-title-input');
    if (titleInput) titleInput.value = role.defaultJobTitle;

    updateRoleMetaPreview();

    // If analysis was already active, re-analyze with updated role
    if (state.analysis) {
      executeAnalysis();
    }
  });

  // Auto-fill Role JD Button
  document.getElementById('btn-load-sample-jd')?.addEventListener('click', () => {
    const role = getRoleById(state.selectedRoleId);
    state.jobDescription = role.sampleJobDescription;
    state.targetJobTitle = role.defaultJobTitle;

    const jdTextarea = document.getElementById('job-description-textarea');
    if (jdTextarea) jdTextarea.value = role.sampleJobDescription;

    const titleInput = document.getElementById('target-job-title-input');
    if (titleInput) titleInput.value = role.defaultJobTitle;

    updateWordCounts();
    showToast(`Loaded ${role.title} standard job description`);

    if (state.analysis) {
      executeAnalysis();
    }
  });

  // Job Description Textarea input
  document.getElementById('job-description-textarea')?.addEventListener('input', (e) => {
    state.jobDescription = e.target.value;
    updateWordCounts();
  });

  document.getElementById('btn-clear-jd-text')?.addEventListener('click', () => {
    state.jobDescription = '';
    const textarea = document.getElementById('job-description-textarea');
    if (textarea) textarea.value = '';
    updateWordCounts();
  });

  // Target Job Title input
  document.getElementById('target-job-title-input')?.addEventListener('input', (e) => {
    state.targetJobTitle = e.target.value;
  });

  // Run Analysis CTA
  document.getElementById('btn-run-analysis')?.addEventListener('click', () => {
    executeAnalysis();
  });

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter runs analysis
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      executeAnalysis();
    }
  });
}

// Initial App Boot
renderApp();
