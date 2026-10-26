/**
 * Generates a clean, professionally formatted plain-text report from the analysis results.
 * @param {object} analysis
 * @returns {string} Formatted text report
 */
export function formatReportText(analysis) {
  const dateStr = new Date(analysis.timestamp || Date.now()).toLocaleString();
  const divider = '='.repeat(70);
  const subDivider = '-'.repeat(70);

  let text = '';
  text += `${divider}\n`;
  text += `AI CAREERMATCH — RESUME & JOB MATCH ANALYSIS REPORT\n`;
  text += `${divider}\n\n`;

  text += `Date & Time       : ${dateStr}\n`;
  text += `Target Job Title  : ${analysis.targetJobTitle}\n`;
  text += `Evaluated Role    : ${analysis.role.title} (${analysis.role.category})\n`;
  text += `Overall Match     : ${analysis.matchScore}% [${analysis.tier.toUpperCase()}]\n`;
  text += `Candidate Tier    : ${analysis.tierBadge}\n\n`;

  text += `${subDivider}\n`;
  text += `1. SCORING BREAKDOWN\n`;
  text += `${subDivider}\n`;
  text += `• Role Core Technical Competency  : ${analysis.subScores.roleCoreScore}%\n`;
  text += `• Job Description Skill Alignment : ${analysis.subScores.jdMatchScore}%\n`;
  text += `• Skill Depth & Representation    : ${analysis.subScores.depthScore}%\n`;
  text += `• ATS Formatting & Structure      : ${analysis.subScores.structureScore}%\n\n`;

  text += `${subDivider}\n`;
  text += `2. SCORE EXPLANATION & SUMMARY\n`;
  text += `${subDivider}\n`;
  // Clean markdown bolding for plain text
  const cleanExplanation = analysis.explanation.replace(/\*\*/g, '');
  text += `${cleanExplanation}\n\n`;

  text += `${subDivider}\n`;
  text += `3. MATCHED SKILLS (${analysis.matchedSkills.length})\n`;
  text += `${subDivider}\n`;
  if (analysis.matchedSkills.length === 0) {
    text += `None detected.\n`;
  } else {
    analysis.matchedSkills.forEach((skill, idx) => {
      const coreFlag = skill.isRoleCore ? ' [CORE MANDATORY]' : '';
      text += `${idx + 1}. ${skill.name} (${skill.category}) — Mentioned ${skill.resumeCount}x in Resume${coreFlag}\n`;
    });
  }
  text += `\n`;

  text += `${subDivider}\n`;
  text += `4. MISSING SKILLS (${analysis.missingSkills.length})\n`;
  text += `${subDivider}\n`;
  if (analysis.missingSkills.length === 0) {
    text += `None! All identified requirements matched in resume.\n`;
  } else {
    const critical = analysis.missingSkills.filter(s => s.priority === 'Critical');
    const recommended = analysis.missingSkills.filter(s => s.priority !== 'Critical');

    if (critical.length > 0) {
      text += `[CRITICAL / HIGH PRIORITY]:\n`;
      critical.forEach((skill, idx) => {
        const jdMention = skill.jdCount > 0 ? ` (Requested ${skill.jdCount}x in Job Description)` : ' (Core Role Skill)';
        text += `  • ${skill.name} [${skill.category}]${jdMention}\n`;
      });
      text += `\n`;
    }

    if (recommended.length > 0) {
      text += `[RECOMMENDED / SECONDARY]:\n`;
      recommended.forEach((skill, idx) => {
        text += `  • ${skill.name} [${skill.category}]\n`;
      });
      text += `\n`;
    }
  }

  text += `${subDivider}\n`;
  text += `5. UNDERREPRESENTED SKILLS (${analysis.underrepresentedSkills.length})\n`;
  text += `${subDivider}\n`;
  if (analysis.underrepresentedSkills.length === 0) {
    text += `None. Identified skills are adequately emphasized.\n`;
  } else {
    analysis.underrepresentedSkills.forEach((skill, idx) => {
      text += `${idx + 1}. ${skill.name} — ${skill.note}\n`;
    });
  }
  text += `\n`;

  text += `${subDivider}\n`;
  text += `6. ACTIONABLE RECOMMENDATIONS\n`;
  text += `${subDivider}\n`;
  analysis.recommendations.forEach((rec, idx) => {
    const cleanDesc = rec.description.replace(/\*\*/g, '');
    text += `${idx + 1}. ${rec.title}\n`;
    text += `   ${cleanDesc}\n\n`;
  });

  text += `${divider}\n`;
  text += `End of AI CareerMatch Report. Generated locally and securely.\n`;
  text += `${divider}\n`;

  return text;
}

/**
 * Copies analysis text to the user's clipboard.
 * @param {object} analysis
 * @returns {Promise<boolean>}
 */
export async function copyAnalysisToClipboard(analysis) {
  try {
    const report = formatReportText(analysis);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(report);
      return true;
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = report;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Generates and downloads a .txt report file.
 * @param {object} analysis
 */
export function downloadTxtReport(analysis) {
  const reportText = formatReportText(analysis);
  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const cleanRoleName = (analysis.role.title || 'Role').replace(/[^a-zA-Z0-9]/g, '_');
  const dateSlug = new Date().toISOString().slice(0, 10);
  const fileName = `CareerMatch_Report_${cleanRoleName}_${dateSlug}.txt`;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
