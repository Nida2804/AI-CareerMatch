import * as pdfjsLib from 'pdfjs-dist';

// Point to the local static worker in /libs/
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/libs/pdf.worker.min.mjs';
}

/**
 * Extracts plain text from a File object (.pdf, .docx, or .txt).
 * @param {File} file
 * @returns {Promise<{ text: string, metadata: { pageCount?: number, fileName: string, fileSize: number, fileType: string } }>}
 */
export async function parseResumeFile(file) {
  if (!file) {
    throw new Error('No file provided.');
  }

  const fileName = file.name;
  const fileSize = file.size;
  const fileExt = fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();

  if (fileExt === 'pdf') {
    return await parsePdfFile(file);
  } else if (fileExt === 'docx') {
    return await parseDocxFile(file);
  } else if (fileExt === 'txt') {
    return await parseTxtFile(file);
  } else {
    throw new Error(`Unsupported file format (.${fileExt}). Please upload a PDF, DOCX, or TXT file.`);
  }
}

/**
 * Parses PDF file into raw text using pdfjs-dist.
 */
async function parsePdfFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY, text = '';
      for (let item of textContent.items) {
        if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 5) {
          text += '\n';
        } else if (text.length > 0 && !text.endsWith(' ') && !text.endsWith('\n')) {
          text += ' ';
        }
        text += item.str;
        lastY = item.transform[5];
      }

      fullText += text + '\n\n';
    }

    const cleanedText = cleanExtractedText(fullText);
    if (!cleanedText || cleanedText.trim().length < 20) {
      throw new Error('The PDF appears to be empty or contains only scanned images without selectable text.');
    }

    return {
      text: cleanedText,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: 'PDF',
        pageCount: numPages
      }
    };
  } catch (err) {
    console.error('PDF parsing error:', err);
    throw new Error(`Failed to read PDF file: ${err.message || 'Unknown error'}`);
  }
}

/**
 * Parses DOCX file using mammoth.
 */
async function parseDocxFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Check if mammoth is available on window or dynamically imported
    let mammothLib = window.mammoth;
    if (!mammothLib) {
      const mod = await import('mammoth');
      mammothLib = mod.default || mod;
    }

    if (!mammothLib || !mammothLib.extractRawText) {
      throw new Error('DOCX parser engine not loaded.');
    }

    const result = await mammothLib.extractRawText({ arrayBuffer });
    const cleanedText = cleanExtractedText(result.value);

    if (!cleanedText || cleanedText.trim().length < 20) {
      throw new Error('The DOCX file appears to be empty or could not be read.');
    }

    return {
      text: cleanedText,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: 'DOCX'
      }
    };
  } catch (err) {
    console.error('DOCX parsing error:', err);
    throw new Error(`Failed to read DOCX file: ${err.message || 'Unknown error'}`);
  }
}

/**
 * Parses plain text file.
 */
function parseTxtFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = cleanExtractedText(e.target.result);
      resolve({
        text,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: 'TXT'
        }
      });
    };
    reader.onerror = () => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}

/**
 * Cleans extracted text: normalizes line endings, multiple spaces, and special bullet characters.
 */
export function cleanExtractedText(raw) {
  if (!raw) return '';
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, ' • ')
    .replace(/\t/g, '  ')
    .replace(/ +/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Inspects text to detect key resume sections.
 */
export function detectResumeSections(text) {
  const sections = {
    summary: /(summary|objective|profile|about me)/i.test(text),
    skills: /(skills|technical skills|competencies|technologies|tools|proficiencies)/i.test(text),
    experience: /(experience|employment|work history|professional experience|career)/i.test(text),
    education: /(education|academic|degrees|university|college)/i.test(text),
    projects: /(projects|personal projects|key achievements)/i.test(text),
    certifications: /(certifications|certificates|licenses|credentials)/i.test(text)
  };

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;

  return {
    sections,
    wordCount: words,
    charCount: chars,
    sectionCount: Object.values(sections).filter(Boolean).length
  };
}
