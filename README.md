# AI CareerMatch — Resume & Job Match Analyzer

A modern, responsive web application that evaluates candidate resumes against specialized tech job descriptions, calculates ATS-aligned match scores, flags matched, missing, and underrepresented skills, and generates actionable recommendations and downloadable reports.

![Tech Stack](https://img.shields.io/badge/Tech-HTML5%20%7C%20Vanilla%20CSS%20%7C%20JavaScript%20%7C%20Vite-blue)
![Status](https://img.shields.io/badge/Status-Complete-success)

---

## ✨ Features

1. **Multi-Format Resume Ingestion**:
   - In-browser parsing of **PDF** documents (via Mozilla's `pdfjs-dist`).
   - In-browser extraction of **Word DOCX** files (via `mammoth`).
   - Plain text (`.txt`) file reading and direct text paste/edit drawer.
   - Real-time word, character, and section detection (Summary, Experience, Skills, Education).

2. **12 Curated Technical Job Roles**:
   - 🤖 **AI Engineer**
   - 🧠 **Machine Learning Engineer**
   - 📊 **Data Analyst**
   - 🔬 **Data Scientist**
   - 🐍 **Python Developer**
   - ☕ **Java Developer**
   - 💻 **Software Engineer**
   - 📱 **Android Developer**
   - ⚡ **Data Engineer**
   - 🛠️ **Technical Support Engineer**
   - ☁️ **Cloud Engineer**
   - 🌐 **Web Developer**
   - Each role includes core mandatory competencies, secondary skills, and realistic industry job descriptions.

3. **Intelligent Scoring & Skill Matrix**:
   - **Overall Match Score (0 - 100%)**: Visualized with an animated SVG circular gauge with tier coloring (Exceptional, Strong, Moderate, Needs Optimization).
   - **Sub-Score Breakdown**:
     - *Role Core Competency Coverage* (40%)
     - *Job Description Keyword Overlap* (35%)
     - *Skill Depth & Representation Balance* (15%)
     - *ATS Formatting & Section Completeness* (10%)
   - **Matched Skills**: Categorized skills present in both resume and job requirements with occurrence frequencies.
   - **Missing Skills**: Prioritized into *Critical / High Priority* (core competencies) and *Recommended*.
   - **Underrepresented Skills**: Identifies skills mentioned only once in the resume but heavily demanded in the job posting.

4. **Actionable AI Recommendations**:
   - Specific suggestions on what tools/libraries to add to the resume.
   - Guidance on quantifying bullet points with impact metrics.
   - ATS headline and section formatting advice.

5. **Dynamic Role Switching & Re-Analysis**:
   - Switch between different roles directly from the results header or input selector to evaluate how the same resume ranks across multiple career tracks.

6. **Export & Sharing**:
   - 📋 **Copy Report**: 1-click clipboard copy of clean, structured analysis text.
   - 📥 **Download TXT**: Generates a timestamped, professional text report file (`CareerMatch_Report_[Role]_[Date].txt`).
   - 🔄 **Reset**: Clean reset to evaluate new resumes and job postings.

7. **Design & Aesthetics**:
   - Glassmorphic translucent cards (`backdrop-filter: blur(16px)`).
   - Rich dark mode with radiant indigo/cyan ambient lighting.
   - Built-in light mode toggle.
   - Typography powered by Google Fonts (Outfit, Inter, JetBrains Mono).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone or navigate to the project directory
cd AI-CareerMatch

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

The application will be running locally at `http://localhost:5173/`.

### Running Tests

```bash
# Execute the comprehensive test suite (60 test cases)
npm test
```

### Production Build

```bash
# Build production bundle
npm run build
```

---

## 📁 Project Architecture

```
AI-CareerMatch/
├── index.html                   # HTML entry point with Google Fonts and Mammoth script
├── package.json                 # Project dependencies and npm scripts
├── test_suite.js                # 60 automated unit & integration test cases
├── public/
│   ├── libs/                    # Standalone client libraries
│   │   ├── mammoth.browser.min.js
│   │   ├── pdf.min.mjs
│   │   └── pdf.worker.min.mjs
├── src/
│   ├── main.js                  # App controller, event handlers, and DOM rendering
│   ├── style.css                # Vanilla CSS design system & micro-animations
│   ├── data/
│   │   ├── rolesData.js         # 12 Job roles, competencies, and sample job descriptions
│   │   ├── sampleResumes.js     # Pre-loaded candidate resumes for instant testing
│   │   └── skillsDictionary.js  # 130+ technical skills categorized with aliases
│   └── utils/
│       ├── analyzer.js          # Core semantic matching engine, scoring & recommendations
│       ├── exporter.js          # Clipboard copy and TXT report generation
│       └── fileParser.js        # PDF, DOCX, and TXT parsing with section detection
```
