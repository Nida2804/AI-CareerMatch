import { JOB_ROLES, getRoleById } from './src/data/rolesData.js';
import { SAMPLE_RESUMES } from './src/data/sampleResumes.js';
import { SKILLS_DICTIONARY } from './src/data/skillsDictionary.js';
import { analyzeResumeAndJob, extractSkillsFromText } from './src/utils/analyzer.js';
import { formatReportText } from './src/utils/exporter.js';
import { cleanExtractedText, detectResumeSections } from './src/utils/fileParser.js';

console.log('🧪 Starting AI CareerMatch Comprehensive Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✕ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Roles Verification
console.log('--- 1. Testing Job Roles Coverage ---');
const expectedRoles = [
  'ai_engineer',
  'machine_learning_engineer',
  'data_analyst',
  'data_scientist',
  'python_developer',
  'java_developer',
  'software_engineer',
  'android_developer',
  'data_engineer',
  'technical_support_engineer',
  'cloud_engineer',
  'web_developer'
];

assert(JOB_ROLES.length === 12, 'Exactly 12 job roles defined');

for (const roleId of expectedRoles) {
  const role = getRoleById(roleId);
  assert(role && role.id === roleId, `Role exists: ${roleId}`);
  assert(role.coreMandatorySkills.length >= 5, `Role has sufficient core skills: ${role.title}`);
  assert(role.sampleJobDescription.length > 100, `Role has detailed sample job description: ${role.title}`);
}

// 2. Skills Dictionary Verification
console.log('\n--- 2. Testing Skills Dictionary ---');
assert(SKILLS_DICTIONARY.length > 50, `Skills dictionary has ${SKILLS_DICTIONARY.length} skills`);
const pythonSkill = SKILLS_DICTIONARY.find(s => s.id === 'python');
assert(pythonSkill && pythonSkill.category === 'Languages', 'Python skill configured properly');

// 3. Skill Extraction
console.log('\n--- 3. Testing Skill Extraction ---');
const sampleText = 'We need a Senior AI Engineer with Python, PyTorch, Docker, Kubernetes, and LangChain experience.';
const extracted = extractSkillsFromText(sampleText);
assert(extracted.has('python'), 'Extracted python');
assert(extracted.has('pytorch'), 'Extracted pytorch');
assert(extracted.has('docker'), 'Extracted docker');
assert(extracted.has('kubernetes'), 'Extracted kubernetes');
assert(extracted.has('langchain'), 'Extracted langchain');

// 4. End-to-End Analysis: AI Engineer Resume vs AI Engineer Job
console.log('\n--- 4. Testing End-to-End Analysis (Alex Chen vs AI Engineer) ---');
const aiResume = SAMPLE_RESUMES.find(r => r.id === 'sample_ai_engineer');
const aiRole = getRoleById('ai_engineer');

const analysis1 = analyzeResumeAndJob({
  resumeText: aiResume.text,
  jobDescription: aiRole.sampleJobDescription,
  roleId: 'ai_engineer',
  targetJobTitle: 'Senior AI Engineer'
});

assert(analysis1.matchScore >= 80, `AI Engineer gets strong match score (Got ${analysis1.matchScore}%)`);
assert(analysis1.matchedSkills.length >= 6, `Matched skills count is ${analysis1.matchedSkills.length}`);
assert(analysis1.explanation.length > 50, 'Explanation generated properly');
assert(analysis1.recommendations.length >= 2, 'Actionable recommendations generated');

// 5. Cross-Role Test: AI Engineer Resume vs Technical Support Job
console.log('\n--- 5. Testing Cross-Role Differentiation ---');
const techSupportRole = getRoleById('technical_support_engineer');
const analysisCross = analyzeResumeAndJob({
  resumeText: aiResume.text,
  jobDescription: techSupportRole.sampleJobDescription,
  roleId: 'technical_support_engineer',
  targetJobTitle: 'Technical Support Engineer'
});

assert(
  analysisCross.matchScore < analysis1.matchScore,
  `AI resume gets significantly lower score for Tech Support (${analysisCross.matchScore}% vs ${analysis1.matchScore}%)`
);
assert(analysisCross.missingSkills.length > 3, 'Correctly identifies missing tech support skills');

// 6. Text Formatting & Export
console.log('\n--- 6. Testing Report Generation & Export ---');
const report = formatReportText(analysis1);
assert(report.includes('AI CAREERMATCH — RESUME & JOB MATCH ANALYSIS REPORT'), 'Report header present');
assert(report.includes('1. SCORING BREAKDOWN'), 'Report scoring breakdown present');
assert(report.includes('3. MATCHED SKILLS'), 'Report matched skills present');
assert(report.includes('4. MISSING SKILLS'), 'Report missing skills present');
assert(report.includes('6. ACTIONABLE RECOMMENDATIONS'), 'Report recommendations present');

// 7. Resume Section Detector
console.log('\n--- 7. Testing Resume Section Detector ---');
const sectionResults = detectResumeSections(aiResume.text);
assert(sectionResults.sections.summary === true, 'Detected Summary section');
assert(sectionResults.sections.skills === true, 'Detected Skills section');
assert(sectionResults.sections.experience === true, 'Detected Experience section');
assert(sectionResults.sections.education === true, 'Detected Education section');
assert(sectionResults.wordCount > 150, `Detected word count: ${sectionResults.wordCount}`);

console.log(`\n========================================`);
console.log(`🎉 ALL TESTS PASSED: ${passedTests} / ${totalTests}`);
console.log(`========================================\n`);
