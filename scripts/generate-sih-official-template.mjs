import fs from 'fs';
import path from 'path';
import pptxgen from 'pptxgenjs';
import PDFDocument from 'pdfkit';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'artifacts', 'weather-gpt', 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// ---------------------------------------------------------------------------
// CONFIGURATION: TEAM DETAILS & PROBLEM STATEMENT
// ---------------------------------------------------------------------------
const PS_ID = '26068';
const PS_TITLE = 'WeatherGPT: Conversational AI for Weather Forecasting, Alerts, and Climate Information';
const THEME = 'Disaster Management';
const CATEGORY = 'Software';
const ORG = 'Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)';
const TEAM_NAME = 'MEGHDOOT';
const TEAM_ID = 'SIH26068';
const TEAM_MEMBERS = [
  'Harsh Bhanandari',
  'Tushar Sati',
  'Hairn Bisht',
  'Himani Gargoti',
  'Vinay Joshi',
  'Himanshi Devli',
];

// Colors matching official SIH template
const COLOR_BLUE_BANNER = '0D6EFD';
const COLOR_HEADER = '000000';
const COLOR_NAVY = '174A56';
const COLOR_ORANGE = 'EA580C';
const COLOR_GREEN = '15803D';
const COLOR_TEXT = '1E293B';
const COLOR_MUTED = '475569';
const COLOR_CARD = 'FFFFFF';
const COLOR_BORDER = 'CBD5E1';

// ---------------------------------------------------------------------------
// 1. GENERATE OFFICIAL 6-SLIDE PPTX
// ---------------------------------------------------------------------------
console.log('Generating Official SIH 6-Slide PowerPoint (.pptx)...');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = TEAM_MEMBERS.join(', ') + ` (${TEAM_NAME})`;
pptx.company = 'Smart India Hackathon 2026';
pptx.title = `SIH 2026 - ${PS_ID} - ${PS_TITLE}`;
pptx.subject = 'Official SIH Idea Submission Template';

function addOfficialHeaderFooter(slide, slideNum, title, isTitlePage = false) {
  if (isTitlePage) return;

  // Top Left Oval Badge: "Your Team Name"
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 0.6,
    y: 0.35,
    w: 1.6,
    h: 0.8,
    fill: { color: 'FFFFFF' },
    line: { color: '64748B', width: 1 },
  });
  slide.addText(TEAM_NAME, {
    x: 0.65,
    y: 0.45,
    w: 1.5,
    h: 0.6,
    fontSize: 9.5,
    fontFace: 'Arial',
    bold: true,
    color: '1E293B',
    align: 'center',
  });

  // Top Title
  slide.addText(title, {
    x: 2.4,
    y: 0.4,
    w: 8.5,
    h: 0.7,
    fontSize: 22,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_HEADER,
    align: 'center',
  });

  // Top Right: SIH 2026 Badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 11.2,
    y: 0.35,
    w: 1.5,
    h: 0.8,
    fill: { color: 'F8FAFC' },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.08,
  });
  slide.addText('SMART INDIA\nHACKATHON\n2026', {
    x: 11.2,
    y: 0.38,
    w: 1.5,
    h: 0.7,
    fontSize: 8,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
    align: 'center',
  });

  // Bottom Banner across full width
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.0,
    w: 13.33,
    h: 0.5,
    fill: { color: COLOR_BLUE_BANNER },
    line: { color: COLOR_BLUE_BANNER },
  });

  slide.addText(`@SIH Idea submission- Template`, {
    x: 0,
    y: 7.05,
    w: 12.5,
    h: 0.4,
    fontSize: 9,
    fontFace: 'Arial',
    color: 'FFFFFF',
    align: 'center',
  });

  slide.addText(String(slideNum), {
    x: 12.2,
    y: 7.05,
    w: 0.8,
    h: 0.4,
    fontSize: 10,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
    align: 'right',
  });
}

// ------------------- SLIDE 1: TITLE PAGE -------------------
{
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };

  // SIH 2026 Top Right Logo Box
  s.addShape(pptx.ShapeType.roundRect, {
    x: 10.8,
    y: 0.4,
    w: 1.9,
    h: 0.95,
    fill: { color: 'F8FAFC' },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.08,
  });
  s.addText('SMART INDIA\nHACKATHON\n2026', {
    x: 10.8,
    y: 0.45,
    w: 1.9,
    h: 0.8,
    fontSize: 9,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
    align: 'center',
  });

  // Main Header
  s.addText('SMART INDIA HACKATHON 2026', {
    x: 0.6,
    y: 0.7,
    w: 10.0,
    h: 0.6,
    fontSize: 26,
    fontFace: 'Georgia',
    bold: true,
    color: '1E3A8A',
  });

  s.addText('TITLE PAGE', {
    x: 0.6,
    y: 1.35,
    w: 10.0,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Georgia',
    bold: true,
    color: '1E293B',
  });

  // Left Details Box matching SIH template layout
  const titleDetails = [
    { label: '• Problem Statement ID –', val: PS_ID },
    { label: '• Problem Statement Title –', val: PS_TITLE },
    { label: '• Theme –', val: THEME },
    { label: '• PS Category –', val: CATEGORY },
    { label: '• Organization –', val: ORG },
    { label: '• Team ID –', val: TEAM_ID },
    { label: '• Team Name (Registered on portal) –', val: TEAM_NAME },
    { label: '• Team Members –', val: TEAM_MEMBERS.join(', ') },
  ];

  let yPos = 2.1;
  titleDetails.forEach((item) => {
    s.addText(item.label, {
      x: 0.6,
      y: yPos,
      w: 4.6,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      bold: true,
      color: '0F172A',
    });
    s.addText(item.val, {
      x: 4.8,
      y: yPos,
      w: 4.2,
      h: 0.55,
      fontSize: 11.5,
      fontFace: 'Arial',
      color: '1E293B',
      lineSpacingMultiple: 1.1,
    });
    yPos += item.label.includes('Title') || item.label.includes('Members') ? 0.65 : 0.48;
  });

  // Right Side Decorative Graphic Box (SIH Innovation Emblem)
  s.addShape(pptx.ShapeType.roundRect, {
    x: 9.3,
    y: 2.1,
    w: 3.4,
    h: 4.5,
    fill: { color: 'F1F5F9' },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.15,
  });

  s.addShape(pptx.ShapeType.ellipse, {
    x: 10.1,
    y: 2.5,
    w: 1.8,
    h: 1.8,
    fill: { color: 'EA580C' },
    line: { color: 'EA580C' },
  });

  s.addText('WeatherGPT', {
    x: 9.5,
    y: 4.5,
    w: 3.0,
    h: 0.5,
    fontSize: 18,
    fontFace: 'Arial',
    bold: true,
    color: '174A56',
    align: 'center',
  });

  s.addText('Conversational AI for Weather Forecasting, Alerts & Climate Information', {
    x: 9.5,
    y: 5.0,
    w: 3.0,
    h: 1.2,
    fontSize: 10,
    fontFace: 'Arial',
    color: '64748B',
    align: 'center',
    lineSpacingMultiple: 1.15,
  });
}

// ------------------- SLIDE 2: PROPOSED SOLUTION -------------------
{
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  addOfficialHeaderFooter(s, 2, 'IDEA TITLE: WeatherGPT');

  s.addText('❖ Proposed Solution (Describe your Idea/Solution/Prototype)', {
    x: 0.6,
    y: 1.25,
    w: 12.1,
    h: 0.45,
    fontSize: 15,
    fontFace: 'Arial',
    bold: true,
    color: '1E3A8A',
  });

  // 1. Detailed explanation
  s.addText('• Detailed explanation of the proposed solution:', {
    x: 0.6,
    y: 1.75,
    w: 12.1,
    h: 0.35,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
  });
  s.addText(
    'WeatherGPT is an intelligent, conversational meteorological intelligence platform that ingests real-time observation telemetry (AWS), Numerical Weather Prediction models (GFS 0.25° & WRF), and disaster feeds (CAP v1.2). It translates dense atmospheric physics into actionable, contextual natural language decisions with full voice input/output support in 8+ Indian regional languages.',
    {
      x: 0.9,
      y: 2.1,
      w: 11.8,
      h: 0.85,
      fontSize: 11,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.15,
    }
  );

  // 2. How it addresses the problem
  s.addText('• How it addresses the problem:', {
    x: 0.6,
    y: 3.0,
    w: 12.1,
    h: 0.35,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
  });
  s.addText(
    '1. Eliminates Portal Fragmentation: Consolidates separate IMD bulletins, radar layers, and PDF advisories into one conversational interface.\n2. Overcomes Jargon: Rather than reporting cryptic millibar pressure or synoptic maps, answers direct citizen questions (e.g., "Can I spray my cotton crop today?").\n3. Bridges Rural & Language Divide: Speech-to-text (STT) and text-to-speech (TTS) in native Indian tongues empower non-literate farmers.\n4. Accelerates Early Warning: Common Alerting Protocol (CAP) delivers instantaneous Red/Orange/Yellow disaster bulletins to frontline responders.',
    {
      x: 0.9,
      y: 3.35,
      w: 11.8,
      h: 1.45,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.15,
    }
  );

  // 3. Innovation and uniqueness
  s.addText('• Innovation and uniqueness of the solution:', {
    x: 0.6,
    y: 4.85,
    w: 12.1,
    h: 0.35,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
  });
  s.addText(
    '• Web App with PWA Capability: Chosen over closed native apps to cover a broader space across all devices (Android, iOS, PC, kiosks) with <2MB footprint, zero app-store download hurdle, and offline caching during disaster network blackouts.\n• Grounded AI Engine (Zero Hallucinations): Combines conversational LLMs with deterministic meteorological tool calling and atmospheric physics validation.\n• Voice-First Rural Access: Built-in regional speech recognition and audio synthesis enabling hands-free use in the field.',
    {
      x: 0.9,
      y: 5.2,
      w: 11.8,
      h: 1.55,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.15,
    }
  );
}

// ------------------- SLIDE 3: TECHNICAL APPROACH -------------------
{
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  addOfficialHeaderFooter(s, 3, 'TECHNICAL APPROACH');

  // 1. Technologies to be used
  s.addText('• Technologies to be used (programming languages, frameworks, hardware):', {
    x: 0.6,
    y: 1.25,
    w: 12.1,
    h: 0.35,
    fontSize: 12.5,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
  });

  const techBoxes = [
    { title: 'Frontend & PWA', items: 'React 19, TypeScript, Vite, Tailwind CSS, Leaflet GIS Map, Recharts, Web Speech API' },
    { title: 'Backend & APIs', items: 'Node.js, FastAPI, Express, OpenAPI, Zod validation, PostgreSQL + Drizzle ORM' },
    { title: 'AI & Ingestion', items: 'LLM Function Calling, Domain RAG, WIS 2.0 / MQTT, GFS 0.25°, WRF, CAP v1.2' },
    { title: 'DevOps & Scale', items: 'Docker containers, Kubernetes cluster auto-scaling, Edge CDN, Service Worker cache' },
  ];

  techBoxes.forEach((b, idx) => {
    const x = 0.6 + idx * 3.05;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.65,
      w: 2.85,
      h: 1.5,
      fill: { color: 'F8FAFC' },
      line: { color: 'CBD5E1', width: 1 },
      rectRadius: 0.08,
    });
    s.addText(b.title, {
      x: x + 0.15,
      y: 1.75,
      w: 2.55,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: '1E3A8A',
    });
    s.addText(b.items, {
      x: x + 0.15,
      y: 2.1,
      w: 2.55,
      h: 0.95,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: '334155',
      lineSpacingMultiple: 1.15,
    });
  });

  // 2. Methodology and process for implementation
  s.addText('• Methodology and process for implementation (Flow Charts / Architecture / Working Prototype):', {
    x: 0.6,
    y: 3.3,
    w: 12.1,
    h: 0.35,
    fontSize: 12.5,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
  });

  // Flowchart Steps
  const flowSteps = [
    { step: 'STEP 1', title: 'Telemetry Ingestion', desc: 'IMD AWS + GFS 0.25° NWP + CAP v1.2 feeds ingested via WIS 2.0 MQTT & APIs' },
    { step: 'STEP 2', title: 'Semantic Processing', desc: 'Geospatial indexing, cache layer, and agro-meteorological vector normalization' },
    { step: 'STEP 3', title: 'Grounded AI Engine', desc: 'Intent classification + deterministic weather tool calling + hallucination guardrails' },
    { step: 'STEP 4', title: 'PWA Multi-Channel', desc: 'Instant web delivery, offline service worker, Leaflet GIS map & spoken regional voice' },
  ];

  flowSteps.forEach((st, idx) => {
    const x = 0.6 + idx * 3.05;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 3.75,
      w: 2.85,
      h: 2.0,
      fill: { color: idx === 2 ? 'EFF6FF' : 'FFFFFF' },
      line: { color: idx === 2 ? '2563EB' : 'CBD5E1', width: idx === 2 ? 1.5 : 1 },
      rectRadius: 0.08,
    });
    s.addText(st.step, {
      x: x + 0.15,
      y: 3.85,
      w: 2.55,
      h: 0.25,
      fontSize: 8.5,
      fontFace: 'Arial',
      bold: true,
      color: 'EA580C',
    });
    s.addText(st.title, {
      x: x + 0.15,
      y: 4.15,
      w: 2.55,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: '0F172A',
    });
    s.addText(st.desc, {
      x: x + 0.15,
      y: 4.55,
      w: 2.55,
      h: 1.1,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: '475569',
      lineSpacingMultiple: 1.15,
    });
  });

  // Prototype Note
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 5.9,
    w: 12.1,
    h: 0.85,
    fill: { color: 'F0FDF4' },
    line: { color: '86EFAC', width: 1 },
    rectRadius: 0.08,
  });
  s.addText(
    '✔ Operational Working Prototype: Currently deployed with 6 active modules — Weather Desk, Ask WeatherGPT, Alert Center, Signal Map, Climate Lens, and Field Advisory at https://github.com/satitushar26-tech/WeatherGPT',
    {
      x: 0.8,
      y: 6.0,
      w: 11.7,
      h: 0.65,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: '166534',
      lineSpacingMultiple: 1.1,
    }
  );
}

// ------------------- SLIDE 4: FEASIBILITY AND VIABILITY -------------------
{
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  addOfficialHeaderFooter(s, 4, 'FEASIBILITY AND VIABILITY');

  // 1. Analysis of feasibility
  s.addText('• Analysis of the feasibility of the idea:', {
    x: 0.6,
    y: 1.25,
    w: 12.1,
    h: 0.35,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
  });
  s.addText(
    '• Technical Feasibility: Built on mature, production-grade stacks (React 19, FastAPI/Node.js, PostgreSQL) with working prototype already running.\n• Operational Feasibility: Conforms to WMO WIS 2.0 & IMD standard open data formats; integrates seamlessly with government disaster protocols.\n• Economic Feasibility: Open-source stack minimizes software licensing; stateless microservices enable low cloud server costs.\n• Adoption Feasibility: PWA architecture eliminates the 50MB app-store download hurdle — accessible immediately via a simple URL link.',
    {
      x: 0.9,
      y: 1.6,
      w: 11.8,
      h: 1.4,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.15,
    }
  );

  // 2. Potential challenges and risks
  s.addText('• Potential challenges and risks:', {
    x: 0.6,
    y: 3.05,
    w: 12.1,
    h: 0.35,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
  });

  const risksTable = [
    [
      { text: 'Challenge / Risk Area', options: { bold: true, fill: { color: 'F1F5F9' }, color: '0F172A' } },
      { text: 'Potential Vulnerability', options: { bold: true, fill: { color: 'F1F5F9' }, color: '0F172A' } },
      { text: 'Strategy for Overcoming Challenges', options: { bold: true, fill: { color: 'F1F5F9' }, color: '15803D' } },
    ],
    [
      { text: '1. AI Hallucination' },
      { text: 'LLMs hallucinating weather values could endanger public safety.' },
      { text: 'Strict deterministic tool calling; temperature=0; physical parameter boundary validation against IMD observations.' },
    ],
    [
      { text: '2. Network Collapse' },
      { text: 'Cyclones & floods destroy mobile towers, severing connectivity.' },
      { text: 'PWA Service Worker caches disaster survival guides and last forecast; planned LoRaWAN emergency broadcast mesh.' },
    ],
    [
      { text: '3. Linguistic Diversity' },
      { text: 'Complex rural dialects with high voice accent variability.' },
      { text: 'Web Speech API with regional dialect acoustic models; multi-turn prompt normalization into standardized weather intents.' },
    ],
    [
      { text: '4. Concurrency Spikes' },
      { text: 'Millions of concurrent queries hitting servers during cyclones.' },
      { text: 'Stateless FastAPI/Node.js microservices auto-scaled on Kubernetes; Edge CDN caching on district weather data tiles.' },
    ],
  ];

  s.addTable(risksTable, {
    x: 0.6,
    y: 3.45,
    w: 12.1,
    h: 3.2,
    fontSize: 9.5,
    fontFace: 'Arial',
    border: { pt: 1, color: COLOR_BORDER },
    align: 'left',
    valign: 'middle',
  });
}

// ------------------- SLIDE 5: IMPACT AND BENEFITS -------------------
{
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  addOfficialHeaderFooter(s, 5, 'IMPACT AND BENEFITS');

  // 1. Potential impact on target audience
  s.addText('• Potential impact on the target audience:', {
    x: 0.6,
    y: 1.25,
    w: 12.1,
    h: 0.35,
    fontSize: 12.5,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
  });

  const audienceCards = [
    { aud: '🌾 Farmers (700M+ Indians)', impact: 'Crop-weather advisories in regional voice; optimal pesticide spraying, sowing, and irrigation windows reducing crop losses.' },
    { aud: '🚨 Disaster Teams (NDRF/SDMA)', impact: 'Early dissemination of CAP disaster bulletins with rapid evacuation checklists and hourly inundation forecasts.' },
    { aud: '✈️ Aviation & Logistics', impact: 'Automated METAR/TAF translation into plain language briefings, crosswind components, and highway visibility warnings.' },
    { aud: '🏙️ Smart Cities & Researchers', impact: 'Urban heat island mapping, stormwater drainage warnings, and decadal climate anomaly trend analytics.' },
  ];

  audienceCards.forEach((c, idx) => {
    const x = 0.6 + idx * 3.05;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.65,
      w: 2.85,
      h: 1.9,
      fill: { color: 'F8FAFC' },
      line: { color: 'CBD5E1', width: 1 },
      rectRadius: 0.08,
    });
    s.addText(c.aud, {
      x: x + 0.15,
      y: 1.75,
      w: 2.55,
      h: 0.35,
      fontSize: 10.5,
      fontFace: 'Arial',
      bold: true,
      color: '1E3A8A',
    });
    s.addText(c.impact, {
      x: x + 0.15,
      y: 2.15,
      w: 2.55,
      h: 1.3,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: '334155',
      lineSpacingMultiple: 1.15,
    });
  });

  // 2. Benefits of the solution
  s.addText('• Benefits of the solution (social, economic, environmental, etc.):', {
    x: 0.6,
    y: 3.75,
    w: 12.1,
    h: 0.35,
    fontSize: 12.5,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
  });

  const benefits = [
    {
      type: 'Social Benefits',
      col: '15803D',
      desc: '• Saves lives and prevents injuries through timely early warnings.\n• Empowers non-literate and rural citizens through voice accessibility.\n• Reduces panic with clear, actionable evacuation guidance.',
    },
    {
      type: 'Economic Benefits',
      col: '0D6EFD',
      desc: '• Protects agricultural yields (mitigates ₹50,000+ Cr annual weather crop damage).\n• Reduces commercial aviation flight diversions and fuel burn.\n• Minimizes municipal property damage from localized urban flash flooding.',
    },
    {
      type: 'Environmental Benefits',
      col: 'EA580C',
      desc: '• Enables sustainable groundwater and irrigation resource management.\n• Tracks decadal temperature & monsoon onset shifts for climate adaptation.\n• Facilitates science-driven disaster resilience policies.',
    },
  ];

  benefits.forEach((b, idx) => {
    const x = 0.6 + idx * 4.1;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 4.15,
      w: 3.9,
      h: 2.5,
      fill: { color: 'FFFFFF' },
      line: { color: 'CBD5E1', width: 1 },
      rectRadius: 0.08,
    });
    s.addText(b.type, {
      x: x + 0.2,
      y: 4.3,
      w: 3.5,
      h: 0.35,
      fontSize: 12,
      fontFace: 'Arial',
      bold: true,
      color: b.col,
    });
    s.addText(b.desc, {
      x: x + 0.2,
      y: 4.75,
      w: 3.5,
      h: 1.8,
      fontSize: 10,
      fontFace: 'Arial',
      color: '334155',
      lineSpacingMultiple: 1.2,
    });
  });
}

// ------------------- SLIDE 6: RESEARCH AND REFERENCES -------------------
{
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  addOfficialHeaderFooter(s, 6, 'RESEARCH AND REFERENCES');

  s.addText('• Details / Links of the reference and research work:', {
    x: 0.6,
    y: 1.25,
    w: 12.1,
    h: 0.35,
    fontSize: 12.5,
    fontFace: 'Arial',
    bold: true,
    color: '0F172A',
  });

  const references = [
    {
      title: 'India Meteorological Department (IMD) - Numerical Weather Prediction (NWP)',
      desc: 'Documentation and operational runs of Global Forecast System (GFS 0.25°) & Weather Research and Forecasting (WRF) model mesoscale telemetry.',
      link: 'Reference: https://mausam.imd.gov.in',
    },
    {
      title: 'World Meteorological Organization (WMO) - WIS 2.0 Standards',
      desc: 'WMO Information System 2.0 framework and MQTT pub/sub data discovery and real-time dissemination standards.',
      link: 'Reference: https://wmo.int',
    },
    {
      title: 'OASIS Common Alerting Protocol (CAP v1.2 Standard)',
      desc: 'International standard for exchanging all-hazard emergency warnings and public safety bulletins across warning networks.',
      link: 'Reference: https://docs.oasis-open.org/emergency/cap/v1.2',
    },
    {
      title: 'Ministry of Earth Sciences (MoES) - National Monsoon Mission',
      desc: 'High-Performance Computing weather intelligence frameworks & observational telemetry benchmarks (Pratyush & Mihir supercomputing clusters).',
      link: 'Reference: https://moes.gov.in',
    },
    {
      title: 'National Disaster Management Authority (NDMA) Guidelines',
      desc: 'Standard Operating Procedures for Cyclone, Flood, and Extreme Weather disaster preparedness & evacuation checklists.',
      link: 'Reference: https://ndma.gov.in',
    },
    {
      title: 'WeatherGPT Working Prototype & Project Repository',
      desc: 'Live functional software prototype repository including PWA service worker, conversational RAG, GIS maps, and voice integration.',
      link: 'Project GitHub: https://github.com/satitushar26-tech/WeatherGPT',
    },
  ];

  references.forEach((r, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.6 + col * 6.2;
    const y = 1.7 + row * 1.65;

    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 5.9,
      h: 1.45,
      fill: { color: 'F8FAFC' },
      line: { color: 'CBD5E1', width: 1 },
      rectRadius: 0.08,
    });
    s.addText(r.title, {
      x: x + 0.2,
      y: y + 0.15,
      w: 5.5,
      h: 0.35,
      fontSize: 10.5,
      fontFace: 'Arial',
      bold: true,
      color: '1E3A8A',
    });
    s.addText(r.desc, {
      x: x + 0.2,
      y: y + 0.5,
      w: 5.5,
      h: 0.55,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: '475569',
      lineSpacingMultiple: 1.1,
    });
    s.addText(r.link, {
      x: x + 0.2,
      y: y + 1.05,
      w: 5.5,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      bold: true,
      color: '0D6EFD',
    });
  });
}

// Write the PPTX
const officialPptxRoot = path.join(rootDir, 'WeatherGPT_SIH2026_Official_Submission.pptx');
const officialPptxPublic = path.join(publicDir, 'WeatherGPT_SIH2026_Official_Submission.pptx');

await pptx.writeFile({ fileName: officialPptxRoot });
fs.copyFileSync(officialPptxRoot, officialPptxPublic);
console.log(`✔ Official 6-Slide PowerPoint created: ${officialPptxRoot}`);
console.log(`✔ Copied to public: ${officialPptxPublic}`);


// ---------------------------------------------------------------------------
// 2. GENERATE OFFICIAL 6-PAGE PDF (PORTAL SUBMISSION READY)
// ---------------------------------------------------------------------------
console.log('Generating Official SIH 6-Page PDF (Portal Upload Ready)...');

const pdfDoc = new PDFDocument({
  size: [960, 540], // 16:9 widescreen presentation
  margins: { top: 25, bottom: 35, left: 35, right: 35 },
  autoFirstPage: false,
});

const officialPdfRoot = path.join(rootDir, 'WeatherGPT_SIH2026_Official_Submission.pdf');
const officialPdfPublic = path.join(publicDir, 'WeatherGPT_SIH2026_Official_Submission.pdf');
const pdfStream = fs.createWriteStream(officialPdfRoot);
pdfDoc.pipe(pdfStream);

function drawPdfHeaderFooter(doc, slideNum, title, isTitle = false) {
  if (!isTitle) {
    // Top Left Oval Badge
    doc.ellipse(80, 45, 45, 20).strokeColor('#64748b').lineWidth(1).stroke();
    doc.fillColor('#1e293b').fontSize(8.5).font('Helvetica-Bold').text(TEAM_NAME, 40, 40, { width: 80, align: 'center' });

    // Top Title
    doc.fillColor('#000000').fontSize(18).font('Helvetica-Bold').text(title, 140, 35, { width: 680, align: 'center' });

    // Top Right SIH Box
    doc.rect(840, 25, 80, 40).strokeColor('#cbd5e1').stroke();
    doc.fillColor('#0f172a').fontSize(7.5).font('Helvetica-Bold').text('SMART INDIA\nHACKATHON\n2026', 840, 30, { width: 80, align: 'center' });

    // Bottom Banner
    doc.rect(0, 505, 960, 35).fill('#0d6efd');
    doc.fillColor('#ffffff').fontSize(9).font('Helvetica').text('@SIH Idea submission- Template', 0, 517, { width: 960, align: 'center' });
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text(String(slideNum), 900, 517);
  }
}

// PDF SLIDE 1
{
  pdfDoc.addPage();
  pdfDoc.fillColor('#1e3a8a').fontSize(22).font('Helvetica-Bold').text('SMART INDIA HACKATHON 2026', 50, 45);
  pdfDoc.fillColor('#1e293b').fontSize(18).font('Helvetica-Bold').text('TITLE PAGE', 50, 75);

  pdfDoc.rect(840, 30, 80, 40).strokeColor('#cbd5e1').stroke();
  pdfDoc.fillColor('#0f172a').fontSize(7.5).font('Helvetica-Bold').text('SMART INDIA\nHACKATHON\n2026', 840, 35, { width: 80, align: 'center' });

  const titleRows = [
    ['• Problem Statement ID –', PS_ID],
    ['• Problem Statement Title –', PS_TITLE],
    ['• Theme –', THEME],
    ['• PS Category –', CATEGORY],
    ['• Organization –', ORG],
    ['• Team ID –', TEAM_ID],
    ['• Team Name (Registered on portal) –', TEAM_NAME],
    ['• Team Members –', TEAM_MEMBERS.join(', ')],
  ];

  let curY = 125;
  titleRows.forEach(([lbl, val]) => {
    pdfDoc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text(lbl, 50, curY, { width: 280 });
    pdfDoc.fillColor('#1e293b').fontSize(11).font('Helvetica').text(val, 330, curY, { width: 580 });
    curY += lbl.includes('Title') || lbl.includes('Members') ? 45 : 32;
  });
}

// PDF SLIDE 2
{
  pdfDoc.addPage();
  drawPdfHeaderFooter(pdfDoc, 2, 'IDEA TITLE: WeatherGPT');

  pdfDoc.fillColor('#1e3a8a').fontSize(13).font('Helvetica-Bold').text('❖ Proposed Solution (Describe your Idea/Solution/Prototype)', 50, 85);

  pdfDoc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('• Detailed explanation of the proposed solution:', 50, 110);
  pdfDoc.fillColor('#475569').fontSize(9.5).font('Helvetica').text(
    'WeatherGPT is an intelligent conversational meteorological intelligence platform that ingests real-time observation telemetry (AWS), Numerical Weather Prediction models (GFS 0.25° & WRF), and disaster feeds (CAP v1.2). It translates dense atmospheric physics into actionable, contextual natural language decisions with full voice input/output support in 8+ Indian regional languages.',
    50, 128, { width: 860, lineGap: 3 }
  );

  pdfDoc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('• How it addresses the problem:', 50, 185);
  pdfDoc.fillColor('#475569').fontSize(9.5).font('Helvetica').text(
    '1. Eliminates Portal Fragmentation: Consolidates separate IMD bulletins, radar layers, and PDF advisories into one conversational interface.\n2. Overcomes Jargon: Rather than reporting cryptic millibar pressure or synoptic maps, answers direct citizen questions (e.g. "Can I spray my cotton crop today?").\n3. Bridges Rural & Language Divide: Speech-to-text (STT) and text-to-speech (TTS) in native Indian tongues empower non-literate farmers.\n4. Accelerates Early Warning: Common Alerting Protocol (CAP) delivers instantaneous Red/Orange/Yellow disaster bulletins to frontline responders.',
    50, 203, { width: 860, lineGap: 3 }
  );

  pdfDoc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('• Innovation and uniqueness of the solution:', 50, 310);
  pdfDoc.fillColor('#475569').fontSize(9.5).font('Helvetica').text(
    '• Web App with PWA Capability: Chosen over closed native apps to cover a broader space across all devices (Android, iOS, PC, kiosks) with <2MB footprint, zero app-store download hurdle, and offline caching during disaster network blackouts.\n• Grounded AI Engine (Zero Hallucinations): Combines conversational LLMs with deterministic meteorological tool calling and atmospheric physics validation.\n• Voice-First Rural Access: Built-in regional speech recognition and audio synthesis enabling hands-free use in the field.',
    50, 328, { width: 860, lineGap: 3 }
  );
}

// PDF SLIDE 3
{
  pdfDoc.addPage();
  drawPdfHeaderFooter(pdfDoc, 3, 'TECHNICAL APPROACH');

  pdfDoc.fillColor('#0f172a').fontSize(11.5).font('Helvetica-Bold').text('• Technologies to be used (programming languages, frameworks, hardware):', 50, 85);
  pdfDoc.fillColor('#475569').fontSize(9.5).font('Helvetica').text(
    '• Frontend & Client: React 19, TypeScript, Vite, Tailwind CSS, Leaflet GIS Interactive Map, Recharts Climate Visualizer, Web Speech API (Voice STT/TTS).\n• Backend & APIs: Node.js, FastAPI, Express, OpenAPI, Zod validation, PostgreSQL with Drizzle ORM, in-memory caching layer.\n• AI & Ingestion: LLM Function Calling, Domain Prompt Guardrails, WIS 2.0 / MQTT, GFS 0.25° NWP, WRF models, CAP v1.2 disaster feeds.\n• DevOps & Scale: Docker containerization, Kubernetes cluster auto-scaling ready, Edge CDN caching, Progressive Web App (Service Worker).',
    50, 105, { width: 860, lineGap: 3 }
  );

  pdfDoc.fillColor('#0f172a').fontSize(11.5).font('Helvetica-Bold').text('• Methodology and process for implementation (Flow Charts / Images / Working Prototype):', 50, 210);

  const flowBoxes = [
    { title: 'STEP 1: Ingestion', desc: 'IMD AWS + GFS 0.25° NWP + CAP v1.2 feeds ingested via WIS 2.0 MQTT and REST APIs.' },
    { title: 'STEP 2: Processing', desc: 'Geospatial indexing, parameter normalization, and Redis in-memory telemetry cache.' },
    { title: 'STEP 3: AI Engine', desc: 'Query intent classifier + deterministic weather tool calling + hallucination guardrails.' },
    { title: 'STEP 4: PWA Delivery', desc: 'Instant web access, offline disaster service worker, Leaflet GIS map, and voice STT/TTS.' },
  ];

  flowBoxes.forEach((fb, idx) => {
    const x = 50 + idx * 218;
    pdfDoc.rect(x, 235, 210, 110).strokeColor('#cbd5e1').fill('#f8fafc');
    pdfDoc.fillColor('#ea580c').fontSize(9).font('Helvetica-Bold').text(`PHASE ${idx + 1}`, x + 10, 245);
    pdfDoc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text(fb.title, x + 10, 260);
    pdfDoc.fillColor('#475569').fontSize(8.5).font('Helvetica').text(fb.desc, x + 10, 280, { width: 190, lineGap: 2 });
  });

  pdfDoc.rect(50, 380, 860, 75).strokeColor('#86efac').fill('#f0fdf4');
  pdfDoc.fillColor('#166534').fontSize(10).font('Helvetica-Bold').text(
    '✔ Operational Working Prototype Deployed Today:', 65, 395
  );
  pdfDoc.fillColor('#166534').fontSize(9).font('Helvetica').text(
    'Weather Desk (/), Ask WeatherGPT (/ask), Alert Center (/alerts), Signal Map (/map), Climate Lens (/climate), Field Advisory (/advisory).\nRepository: https://github.com/satitushar26-tech/WeatherGPT',
    65, 412, { width: 830, lineGap: 2 }
  );
}

// PDF SLIDE 4
{
  pdfDoc.addPage();
  drawPdfHeaderFooter(pdfDoc, 4, 'FEASIBILITY AND VIABILITY');

  pdfDoc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('• Analysis of the feasibility of the idea:', 50, 85);
  pdfDoc.fillColor('#475569').fontSize(9).font('Helvetica').text(
    '• Technical Feasibility: Built on production-ready modern stacks (React 19, FastAPI/Node.js, PostgreSQL) with operational prototype.\n• Operational Feasibility: Conforms to WMO WIS 2.0 & IMD standard open data formats; integrates seamlessly with government disaster networks.\n• Economic Feasibility: Open-source stack eliminates licensing costs; stateless microservices ensure low cloud computing expenditure.\n• Adoption Feasibility: PWA architecture eliminates the 50MB app-store download hurdle — accessible immediately via a simple URL link.',
    50, 102, { width: 860, lineGap: 2 }
  );

  pdfDoc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('• Potential challenges and risks & Strategies for overcoming them:', 50, 195);

  const pdfRiskRows = [
    ['1. AI Hallucination', 'LLMs hallucinating weather values could endanger public safety.', 'Strict deterministic tool calling; temperature=0; physical parameter boundary validation against IMD observations.'],
    ['2. Network Collapse', 'Cyclones & floods destroy mobile towers, severing connectivity.', 'PWA Service Worker caches disaster survival guides and last forecast; planned LoRaWAN emergency broadcast mesh.'],
    ['3. Linguistic Diversity', 'Complex rural dialects with high voice accent variability.', 'Web Speech API with regional dialect acoustic models; multi-turn prompt normalization into standardized weather intents.'],
    ['4. Concurrency Spikes', 'Millions of concurrent queries hitting servers during cyclones.', 'Stateless FastAPI/Node.js microservices auto-scaled on Kubernetes; Edge CDN caching on district weather data tiles.'],
  ];

  let ry = 220;
  pdfRiskRows.forEach(([c, r, s]) => {
    pdfDoc.rect(50, ry, 860, 55).strokeColor('#cbd5e1').fill('#ffffff');
    pdfDoc.fillColor('#0f172a').fontSize(9.5).font('Helvetica-Bold').text(c, 60, ry + 8, { width: 140 });
    pdfDoc.fillColor('#dc2626').fontSize(8.5).font('Helvetica').text(r, 210, ry + 8, { width: 280, lineGap: 2 });
    pdfDoc.fillColor('#15803d').fontSize(8.5).font('Helvetica').text(s, 500, ry + 8, { width: 390, lineGap: 2 });
    ry += 65;
  });
}

// PDF SLIDE 5
{
  pdfDoc.addPage();
  drawPdfHeaderFooter(pdfDoc, 5, 'IMPACT AND BENEFITS');

  pdfDoc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('• Potential impact on the target audience:', 50, 85);
  pdfDoc.fillColor('#475569').fontSize(9).font('Helvetica').text(
    '• 🌾 Farmers & Rural Communities (700M+ Indians): Crop-weather advisories in regional voice; optimal pesticide spraying, sowing, and irrigation windows reducing crop losses.\n• 🚨 Disaster Teams (NDRF / SDMA / DDMA): Early dissemination of CAP disaster bulletins with rapid evacuation checklists and hourly inundation forecasts.\n• ✈️ Aviation & Transport Logistics: Automated METAR/TAF translation into plain language briefings, crosswind components, and highway visibility warnings.\n• 🏙️ Smart Cities & Policy Researchers: Urban heat island mapping, stormwater drainage warnings, and decadal climate anomaly trend analytics.',
    50, 105, { width: 860, lineGap: 3 }
  );

  pdfDoc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('• Benefits of the solution (social, economic, environmental, etc.):', 50, 225);

  const pdfBenefits = [
    { title: 'Social Benefits', col: '#15803d', desc: '• Saves lives and prevents injuries through timely early warnings.\n• Empowers non-literate and rural citizens through voice accessibility.\n• Reduces panic with clear, actionable evacuation guidance.' },
    { title: 'Economic Benefits', col: '#0d6efd', desc: '• Protects agricultural yields (mitigates ₹50,000+ Cr annual weather crop damage).\n• Reduces commercial aviation flight diversions and fuel burn.\n• Minimizes municipal property damage from localized urban flash flooding.' },
    { title: 'Environmental Benefits', col: '#ea580c', desc: '• Enables sustainable groundwater and irrigation resource management.\n• Tracks decadal temperature & monsoon onset shifts for climate adaptation.\n• Facilitates science-driven disaster resilience policies.' },
  ];

  pdfBenefits.forEach((b, idx) => {
    const x = 50 + idx * 295;
    pdfDoc.rect(x, 250, 275, 200).strokeColor('#cbd5e1').fill('#ffffff');
    pdfDoc.fillColor(b.col).fontSize(12).font('Helvetica-Bold').text(b.title, x + 15, 265);
    pdfDoc.fillColor('#334155').fontSize(9).font('Helvetica').text(b.desc, x + 15, 295, { width: 245, lineGap: 4 });
  });
}

// PDF SLIDE 6
{
  pdfDoc.addPage();
  drawPdfHeaderFooter(pdfDoc, 6, 'RESEARCH AND REFERENCES');

  pdfDoc.fillColor('#0f172a').fontSize(11.5).font('Helvetica-Bold').text('• Details / Links of the reference and research work:', 50, 85);

  const pdfRefs = [
    ['India Meteorological Department (IMD) - NWP Modeling', 'Documentation and operational runs of GFS (0.25°) and WRF mesoscale numerical weather forecasting.\nURL: https://mausam.imd.gov.in'],
    ['World Meteorological Organization (WMO) - WIS 2.0 Standard', 'WMO Information System 2.0 architecture and MQTT pub/sub data exchange telemetry standards.\nURL: https://wmo.int'],
    ['OASIS Common Alerting Protocol (CAP v1.2)', 'International public emergency warning format for multi-hazard disaster dissemination.\nURL: https://docs.oasis-open.org/emergency/cap/v1.2'],
    ['Ministry of Earth Sciences (MoES) - National Monsoon Mission', 'High Performance Computing (HPC) Pratyush & Mihir climate modeling frameworks.\nURL: https://moes.gov.in'],
    ['National Disaster Management Authority (NDMA) Guidelines', 'Standard Operating Procedures for Cyclone, Flood, and Disaster Evacuation Planning.\nURL: https://ndma.gov.in'],
    ['WeatherGPT Operational Prototype Repository', 'Source code, PWA service worker, conversational RAG engine, Leaflet GIS map, and voice STT/TTS.\nURL: https://github.com/satitushar26-tech/WeatherGPT'],
  ];

  let refY = 115;
  pdfRefs.forEach(([title, desc]) => {
    pdfDoc.rect(50, refY, 860, 52).strokeColor('#cbd5e1').fill('#f8fafc');
    pdfDoc.fillColor('#1e3a8a').fontSize(10).font('Helvetica-Bold').text(title, 65, refY + 8);
    pdfDoc.fillColor('#475569').fontSize(8.5).font('Helvetica').text(desc, 65, refY + 24, { width: 830, lineGap: 2 });
    refY += 60;
  });
}

pdfDoc.end();

pdfStream.on('finish', () => {
  fs.copyFileSync(officialPdfRoot, officialPdfPublic);
  console.log(`✔ Official 6-Page PDF created: ${officialPdfRoot}`);
  console.log(`✔ Copied to public: ${officialPdfPublic}`);
  console.log('\nAll official SIH submission files generated successfully!');
});
