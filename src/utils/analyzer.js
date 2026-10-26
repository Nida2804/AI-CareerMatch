import { SKILLS_DICTIONARY, SKILLS_BY_ID } from '../data/skillsDictionary.js';
import { getRoleById } from '../data/rolesData.js';
import { detectResumeSections } from './fileParser.js';

/**
 * Escapes regex special characters.
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a regex pattern for a skill alias that respects boundaries and symbols like C++, C#, .NET.
 */
function buildSkillRegex(term) {
  const escaped = escapeRegex(term);
  // If term starts/ends with special char like +, #, or /, standard \b boundary won't work on that end
  const startBoundary = /^[a-zA-Z0-9]/.test(term) ? '(?:^|[^a-zA-Z0-9])' : '';
  const endBoundary = /[a-zA-Z0-9]$/.test(term) ? '(?=$|[^a-zA-Z0-9])' : '';
  return new RegExp(`${startBoundary}(${escaped})${endBoundary}`, 'gi');
}

/**
 * Extracts skills and their occurrences from given text.
 * @param {string} text
 * @returns {Map<string, { skill: object, count: number, matchedTerms: Set<string> }>}
 */
export function extractSkillsFromText(text) {
  if (!text) return new Map();
  const normalizedText = text.toLowerCase();
  const results = new Map();

  for (const skill of SKILLS_DICTIONARY) {
    const searchTerms = [skill.name, skill.id, ...(skill.aliases || [])];
    let totalCount = 0;
    const matchedTerms = new Set();

    for (const term of searchTerms) {
      if (!term || term.length < 2) continue;
      const regex = buildSkillRegex(term);
      const matches = normalizedText.match(regex);
      if (matches && matches.length > 0) {
        totalCount += matches.length;
        matchedTerms.add(term);
      }
    }

    if (totalCount > 0) {
      results.set(skill.id, {
        skill,
        count: totalCount,
        matchedTerms: Array.from(matchedTerms)
      });
    }
  }

  return results;
}

/**
 * Core analysis engine that compares a resume against a target role and job description.
 * @param {object} params
 * @param {string} params.resumeText
 * @param {string} params.jobDescription
 * @param {string} params.roleId
 * @param {string} params.targetJobTitle
 * @returns {object} Analysis Results
 */
export function analyzeResumeAndJob({ resumeText, jobDescription, roleId, targetJobTitle }) {
  if (!resumeText || resumeText.trim().length < 20) {
    throw new Error('Please provide a valid resume text or upload a document with at least 20 characters.');
  }

  if (!jobDescription || jobDescription.trim().length < 20) {
    throw new Error('Please provide a valid job description with at least 20 characters.');
  }

  const role = getRoleById(roleId);
  const effectiveTitle = targetJobTitle && targetJobTitle.trim() ? targetJobTitle.trim() : role.defaultJobTitle;

  // 1. Extract skills from both texts
  const resumeExtracted = extractSkillsFromText(resumeText);
  const jdExtracted = extractSkillsFromText(jobDescription);
  const sectionStats = detectResumeSections(resumeText);

  // 2. Identify skills pool from Job Description + Target Role
  const roleCoreSkillIds = new Set(role.coreMandatorySkills);
  const roleSecondarySkillIds = new Set(role.secondarySkills || []);

  // Union of JD skills + role core skills that should be considered
  const expectedSkillIds = new Set([
    ...Array.from(jdExtracted.keys()),
    ...role.coreMandatorySkills
  ]);

  // 3. Classify Skills: Matched, Missing, Underrepresented
  const matchedSkills = [];
  const missingSkills = [];
  const underrepresentedSkills = [];

  for (const skillId of expectedSkillIds) {
    const skill = SKILLS_BY_ID[skillId] || { id: skillId, name: skillId, category: 'General' };
    const resumeInfo = resumeExtracted.get(skillId);
    const jdInfo = jdExtracted.get(skillId);

    const inResume = Boolean(resumeInfo && resumeInfo.count > 0);
    const inJd = Boolean(jdInfo && jdInfo.count > 0);
    const isRoleCore = roleCoreSkillIds.has(skillId);
    const isRoleSecondary = roleSecondarySkillIds.has(skillId);

    const resumeCount = resumeInfo ? resumeInfo.count : 0;
    const jdCount = jdInfo ? jdInfo.count : 0;

    if (inResume) {
      // It's in the resume!
      const skillEntry = {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        resumeCount,
        jdCount,
        isRoleCore,
        status: 'matched'
      };

      matchedSkills.push(skillEntry);

      // Check if it's UNDERREPRESENTED:
      // Condition: present in resume only 1 time (or weak), but heavily stressed in JD (2+ times or is role core)
      if (resumeCount === 1 && (jdCount >= 2 || (isRoleCore && jdCount >= 1))) {
        underrepresentedSkills.push({
          ...skillEntry,
          status: 'underrepresented',
          note: `Mentioned only once in resume, while heavily emphasized (${jdCount > 0 ? jdCount + ' times in JD' : 'Role Core Requirement'}).`
        });
      }
    } else {
      // NOT in the resume -> Missing Skill
      const priority = (isRoleCore || jdCount >= 2) ? 'Critical' : 'Recommended';
      missingSkills.push({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        priority,
        jdCount,
        isRoleCore,
        isRoleSecondary,
        status: 'missing'
      });
    }
  }

  // Sort matched skills: core first, then by frequency
  matchedSkills.sort((a, b) => {
    if (a.isRoleCore !== b.isRoleCore) return a.isRoleCore ? -1 : 1;
    return b.resumeCount - a.resumeCount;
  });

  // Sort missing skills: Critical first
  missingSkills.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === 'Critical' ? -1 : 1;
    return b.jdCount - a.jdCount;
  });

  // 4. Calculate Scores
  // A. Core Role Skills Match (40% weight)
  let matchedCoreCount = 0;
  for (const coreId of role.coreMandatorySkills) {
    if (resumeExtracted.has(coreId)) {
      matchedCoreCount++;
    }
  }
  const roleCoreScore = Math.round((matchedCoreCount / (role.coreMandatorySkills.length || 1)) * 100);

  // B. Job Description Skills Match (35% weight)
  const jdSkillIds = Array.from(jdExtracted.keys());
  let matchedJdCount = 0;
  for (const jId of jdSkillIds) {
    if (resumeExtracted.has(jId)) {
      matchedJdCount++;
    }
  }
  const jdMatchScore = jdSkillIds.length > 0 
    ? Math.round((matchedJdCount / jdSkillIds.length) * 100)
    : roleCoreScore;

  // C. Skill Depth & Frequency Balance (15% weight)
  // Penalize high ratio of underrepresented skills
  const depthPenalty = matchedSkills.length > 0 
    ? Math.min(30, Math.round((underrepresentedSkills.length / matchedSkills.length) * 40))
    : 0;
  const depthScore = Math.max(10, 100 - depthPenalty);

  // D. Structure & ATS Quality Score (10% weight)
  let structureScore = 50;
  if (sectionStats.sections.experience) structureScore += 15;
  if (sectionStats.sections.skills) structureScore += 15;
  if (sectionStats.sections.education) structureScore += 10;
  if (sectionStats.sections.summary) structureScore += 10;
  if (sectionStats.wordCount >= 250 && sectionStats.wordCount <= 1800) {
    structureScore = Math.min(100, structureScore + 10);
  } else if (sectionStats.wordCount < 150) {
    structureScore = Math.max(20, structureScore - 20);
  }

  // Final Weighted Match Score
  const rawScore = (
    0.40 * roleCoreScore +
    0.35 * jdMatchScore +
    0.15 * depthScore +
    0.10 * structureScore
  );

  const matchScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Tier Classification
  let tier = 'Needs Optimization';
  let tierClass = 'tier-low';
  let tierColor = '#ef4444';
  let tierBadge = 'Needs Revision';

  if (matchScore >= 85) {
    tier = 'Exceptional Match';
    tierClass = 'tier-exceptional';
    tierColor = '#10b981';
    tierBadge = 'Top 5% Candidate';
  } else if (matchScore >= 70) {
    tier = 'Strong Match';
    tierClass = 'tier-strong';
    tierColor = '#6366f1';
    tierBadge = 'Interview Ready';
  } else if (matchScore >= 50) {
    tier = 'Moderate Match';
    tierClass = 'tier-moderate';
    tierColor = '#f59e0b';
    tierBadge = 'Competitive with Edits';
  }

  // 5. Generate Clear Explanation of the Score
  const explanation = generateScoreExplanation({
    matchScore,
    tier,
    roleTitle: role.title,
    effectiveTitle,
    matchedSkills,
    missingSkills,
    underrepresentedSkills,
    roleCoreScore,
    jdMatchScore
  });

  // 6. Generate Actionable AI Recommendations
  const recommendations = generateRecommendations({
    role,
    effectiveTitle,
    matchedSkills,
    missingSkills,
    underrepresentedSkills,
    sectionStats,
    matchScore
  });

  return {
    timestamp: new Date().toISOString(),
    matchScore,
    tier,
    tierClass,
    tierColor,
    tierBadge,
    role: {
      id: role.id,
      title: role.title,
      icon: role.icon,
      category: role.category
    },
    targetJobTitle: effectiveTitle,
    subScores: {
      roleCoreScore,
      jdMatchScore,
      depthScore,
      structureScore
    },
    counts: {
      matched: matchedSkills.length,
      missing: missingSkills.length,
      underrepresented: underrepresentedSkills.length,
      criticalMissing: missingSkills.filter(s => s.priority === 'Critical').length,
      totalJdSkills: jdSkillIds.length
    },
    matchedSkills,
    missingSkills,
    underrepresentedSkills,
    explanation,
    recommendations,
    sectionStats
  };
}

/**
 * Builds clear narrative explanation for the match score.
 */
function generateScoreExplanation({
  matchScore,
  tier,
  roleTitle,
  effectiveTitle,
  matchedSkills,
  missingSkills,
  underrepresentedSkills,
  roleCoreScore,
  jdMatchScore
}) {
  const topMatched = matchedSkills.slice(0, 4).map(s => s.name);
  const criticalMissing = missingSkills.filter(s => s.priority === 'Critical').slice(0, 3).map(s => s.name);
  const underrepList = underrepresentedSkills.slice(0, 3).map(s => s.name);

  let narrative = `Your resume achieved a **${matchScore}% Match Score (${tier})** when evaluated against the target position of **${effectiveTitle}** (${roleTitle}).\n\n`;

  if (topMatched.length > 0) {
    narrative += `**Key Strengths:** You demonstrate solid alignment with several key requirements, notably **${topMatched.join(', ')}**. These skills appear actively across your profile with strong keyword alignment (${jdMatchScore}% JD overlap).\n\n`;
  }

  if (criticalMissing.length > 0) {
    narrative += `**Critical Skill Gaps:** The primary reason your score is capped at ${matchScore}% is the absence of high-priority qualifications requested by this position: **${criticalMissing.join(', ')}**. Because these tools are foundational for this role (${roleCoreScore}% core role coverage), applicant tracking systems (ATS) may downrank your application.\n\n`;
  } else if (missingSkills.length > 0) {
    narrative += `**Secondary Gaps:** While you have matched all core competencies, there are secondary tools in the posting (**${missingSkills.slice(0, 3).map(s => s.name).join(', ')}**) that would further strengthen your positioning.\n\n`;
  }

  if (underrepList.length > 0) {
    narrative += `**Underrepresented Skills:** Skills like **${underrepList.join(', ')}** are mentioned only in passing. The job description places significant emphasis on these areas, so expanding on them in your project bullet points will boost your ranking.`;
  }

  return narrative;
}

/**
 * Builds actionable recommendations.
 */
function generateRecommendations({
  role,
  effectiveTitle,
  matchedSkills,
  missingSkills,
  underrepresentedSkills,
  sectionStats,
  matchScore
}) {
  const recs = [];
  const criticalMissing = missingSkills.filter(s => s.priority === 'Critical');

  // Recommendation 1: High Priority Skills to add
  if (criticalMissing.length > 0) {
    const names = criticalMissing.slice(0, 4).map(s => s.name).join(', ');
    recs.push({
      type: 'critical',
      icon: '🎯',
      title: 'Incorporate High-Priority Missing Skills',
      description: `Add projects or coursework highlighting **${names}**. ATS parsers actively filter candidates based on these exact terms.`
    });
  }

  // Recommendation 2: Address underrepresented skills
  if (underrepresentedSkills.length > 0) {
    const names = underrepresentedSkills.slice(0, 3).map(s => s.name).join(', ');
    recs.push({
      type: 'warning',
      icon: '📈',
      title: 'Deepen Context for Underrepresented Skills',
      description: `You mentioned **${names}** only once. Expand these into bullet points detailing specific outcomes, architecture, or performance results.`
    });
  }

  // Recommendation 3: Resume Title & Headline Alignment
  recs.push({
    type: 'info',
    icon: '✨',
    title: 'Align Your Professional Summary & Title',
    description: `Ensure your resume title or objective explicitly matches "${effectiveTitle}". Mirroring the job title in your summary increases ATS relevance scoring.`
  });

  // Recommendation 4: Quantify Accomplishments
  recs.push({
    type: 'success',
    icon: '📊',
    title: 'Quantify Impact with Measurable Metrics',
    description: 'Use the formula: "Accomplished [X], measured by [Y]%, by implementing [Z]". Citing latency reductions, cost savings, user scale, or pipeline speeds immediately elevates your candidacy.'
  });

  // Recommendation 5: Section Completeness
  if (!sectionStats.sections.summary) {
    recs.push({
      type: 'warning',
      icon: '📝',
      title: 'Add a Targeted Summary Section',
      description: 'Your resume lacks a clear Professional Summary section. Adding a 3-sentence summary directly addressing this role gives recruiters an immediate value proposition.'
    });
  }

  if (sectionStats.wordCount < 300) {
    recs.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Expand Resume Content Depth',
      description: `Your resume is concise (${sectionStats.wordCount} words). Elaborating on system architecture, challenges overcome, and stack details will provide stronger signal.`
    });
  }

  return recs;
}
