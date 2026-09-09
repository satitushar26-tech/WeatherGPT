import fs from 'fs';
import path from 'path';
import pptxgen from 'pptxgenjs';
import PDFDocument from 'pdfkit';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'artifacts', 'weather-gpt', 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// -------------------------------------------------------------
// 1. GENERATE POWERPOINT (.PPTX) FOR GOOGLE SLIDES / POWERPOINT
// -------------------------------------------------------------
console.log('Generating PowerPoint (.pptx) file...');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Harsh Bhanandari, Tushar Sati, Hairn Bisht, Himani Gargoti, Vinay Joshi, Himanshi Devli (Team WeatherGPT)';
pptx.company = 'Smart India Hackathon 2026 (MoES / IMD)';
pptx.title = 'WeatherGPT: Conversational AI for Weather Forecasting, Alerts, and Climate Information';
pptx.subject = 'SIH 2026 Problem Statement ID 26068';

const COLOR_BG = 'F8F5EE';
const COLOR_NAVY = '174A56';
const COLOR_DARK = '0F2F37';
const COLOR_ORANGE = 'EA580C';
const COLOR_GREEN = '15803D';
const COLOR_CARD = 'FFFFFF';
const COLOR_MUTED = '64748B';
const COLOR_TEXT = '1E293B';
const COLOR_BORDER = 'CBD5E1';

function addCommonHeaderFooter(slide, slideNum, totalSlides, tag, title, subtitle) {
  // Tricolor Top Strip
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 4.4, h: 0.08, fill: { color: 'FF9933' }, line: { color: 'FF9933' } });
  slide.addShape(pptx.ShapeType.rect, { x: 4.4, y: 0, w: 4.5, h: 0.08, fill: { color: 'FFFFFF' }, line: { color: 'FFFFFF' } });
  slide.addShape(pptx.ShapeType.rect, { x: 8.9, y: 0, w: 4.4, h: 0.08, fill: { color: '138808' }, line: { color: '138808' } });

  // Tag Badge
  slide.addText(tag.toUpperCase(), {
    x: 0.6,
    y: 0.35,
    w: 8.0,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_ORANGE,
  });

  // Slide Title & Subtitle
  slide.addText(title, {
    x: 0.6,
    y: 0.65,
    w: 11.0,
    h: 0.6,
    fontSize: 22,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_NAVY,
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6,
      y: 1.25,
      w: 11.5,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Arial',
      color: COLOR_MUTED,
    });
  }

  // Footer Line
  slide.addShape(pptx.ShapeType.line, {
    x: 0.6,
    y: 7.0,
    w: 12.1,
    h: 0,
    line: { color: COLOR_BORDER, width: 1 },
  });

  // Footer text
  slide.addText('Smart India Hackathon 2026 · Problem Statement ID: 26068 · Ministry of Earth Sciences (MoES) / IMD', {
    x: 0.6,
    y: 7.05,
    w: 9.0,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    color: COLOR_MUTED,
  });

  slide.addText(`SLIDE ${String(slideNum).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`, {
    x: 10.5,
    y: 7.05,
    w: 2.2,
    h: 0.3,
    align: 'right',
    fontSize: 9,
    fontFace: 'Courier New',
    bold: true,
    color: COLOR_NAVY,
  });
}

// ----------------- SLIDE 1: TITLE -----------------
{
  const s = pptx.addSlide();
  s.background = { color: COLOR_BG };
  addCommonHeaderFooter(
    s,
    1,
    10,
    'SIH 2026 · Ministry of Earth Sciences (MoES) & India Meteorological Department (IMD)',
    'WeatherGPT: Conversational AI for Weather & Climate Intelligence',
    'Real-time Numerical Weather Forecasting, Disaster Warnings, and Rural Accessibility'
  );

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 1.8,
    w: 12.1,
    h: 2.3,
    fill: { color: COLOR_NAVY },
    rectRadius: 0.15,
  });

  s.addText('WeatherGPT', {
    x: 1.0,
    y: 2.0,
    w: 11.0,
    h: 0.8,
    fontSize: 38,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
  });

  s.addText(
    'An intelligent conversational platform that integrates meteorological datasets, numerical weather prediction (GFS/WRF) models, and CAP v1.2 disaster warning systems into accessible natural language & regional voice for 1.4 Billion citizens.',
    {
      x: 1.0,
      y: 2.7,
      w: 11.0,
      h: 0.7,
      fontSize: 12.5,
      fontFace: 'Arial',
      color: 'E2E8F0',
      lineSpacingMultiple: 1.15,
    }
  );

  s.addText(
    'Team Members: Harsh Bhanandari  ·  Tushar Sati  ·  Hairn Bisht  ·  Himani Gargoti  ·  Vinay Joshi  ·  Himanshi Devli',
    {
      x: 1.0,
      y: 3.45,
      w: 11.0,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: 'FF9933',
    }
  );

  const pillars = [
    { title: '8+ Languages', desc: 'Indian regional languages + voice recognition', col: COLOR_ORANGE },
    { title: 'NWP Models', desc: 'GFS 0.25° & WRF model ingestion', col: COLOR_NAVY },
    { title: 'CAP v1.2 Alerts', desc: 'Disaster early warning dissemination', col: 'DC2626' },
    { title: 'Web + PWA', desc: 'Zero download barrier · Offline caching', col: COLOR_GREEN },
  ];

  pillars.forEach((p, i) => {
    const x = 0.6 + i * 3.1;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 4.4,
      w: 2.8,
      h: 2.3,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_BORDER, width: 1 },
      rectRadius: 0.1,
    });
    s.addText(p.title, {
      x: x + 0.2,
      y: 4.7,
      w: 2.4,
      h: 0.5,
      fontSize: 16,
      fontFace: 'Arial',
      bold: true,
      color: p.col,
    });
    s.addText(p.desc, {
      x: x + 0.2,
      y: 5.3,
      w: 2.4,
      h: 1.1,
      fontSize: 11,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.1,
    });
  });

  s.addNotes(
    'Respected Panel Members, we present WeatherGPT for Problem Statement 26068 under MoES and IMD. It bridges complex meteorological data and frontline citizens with conversational intelligence, voice accessibility, and disaster resilience.'
  );
}

// ----------------- SLIDE 2: THE PROBLEM -----------------
{
  const s = pptx.addSlide();
  s.background = { color: COLOR_BG };
  addCommonHeaderFooter(
    s,
    2,
    10,
    'Context & Ground Realities',
    'The Problem: Information Fragmentation & The Last-Mile Void',
    'Why traditional portals and technical bulletins fail citizens and field officers'
  );

  // Box 1: Status Quo
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 1.8,
    w: 5.8,
    h: 4.9,
    fill: { color: 'FEF2F2' },
    line: { color: 'FCA5A5', width: 1 },
    rectRadius: 0.12,
  });
  s.addText('CURRENT CHALLENGES & BOTTLENECK', {
    x: 0.9,
    y: 2.0,
    w: 5.2,
    h: 0.4,
    fontSize: 13,
    fontFace: 'Arial',
    bold: true,
    color: 'DC2626',
  });
  const painPoints = [
    '• Scattered Portals: Weather data is split across Mausam, Meghdoot, Damini, Umang, and satellite bulletins.',
    '• High Cognitive Load: Technical jargon like isobar charts, millibar pressure, and synoptic maps cannot be parsed by ordinary citizens.',
    '• Language & Literacy Barrier: 70%+ of rural farming families require voice interaction in their regional mother tongue.',
    '• Delayed Action: High latency between severe forecasts and field-level evacuation or crop protection actions.',
  ];
  s.addText(painPoints.join('\n\n'), {
    x: 0.9,
    y: 2.5,
    w: 5.2,
    h: 4.0,
    fontSize: 11,
    fontFace: 'Arial',
    color: COLOR_TEXT,
    lineSpacingMultiple: 1.15,
  });

  // Box 2: The Solution Need
  s.addShape(pptx.ShapeType.roundRect, {
    x: 6.9,
    y: 1.8,
    w: 5.8,
    h: 4.9,
    fill: { color: 'F0FDF4' },
    line: { color: '86EFAC', width: 1 },
    rectRadius: 0.12,
  });
  s.addText('THE WEATHERGPT PARADIGM SHIFT', {
    x: 7.2,
    y: 2.0,
    w: 5.2,
    h: 0.4,
    fontSize: 13,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_GREEN,
  });
  const needs = [
    '• Unified AI Gateway: One conversational endpoint integrating telemetry, NWP runs, and CAP early warning feeds.',
    '• Action-Centric Decisions: Answers real citizen questions: "Can I spray my cotton crop today?" or "Is highway travel safe?"',
    '• Voice-First Rural Access: Built-in Speech-to-Text and Text-to-Speech removing typing and literacy barriers.',
    '• Zero-Install Dissemination: Immediate access on any smartphone or desktop via a frictionless web link with offline caching.',
  ];
  s.addText(needs.join('\n\n'), {
    x: 7.2,
    y: 2.5,
    w: 5.2,
    h: 4.0,
    fontSize: 11,
    fontFace: 'Arial',
    color: COLOR_TEXT,
    lineSpacingMultiple: 1.15,
  });

  s.addNotes(
    'Currently, weather data is trapped in technical silos. WeatherGPT translates raw synoptic telemetry into plain-language, spoken decisions for farmers, pilots, and disaster rescue teams.'
  );
}

// ----------------- SLIDE 3: OUR SOLUTION -----------------
{
  const s = pptx.addSlide();
  s.background = { color: COLOR_BG };
  addCommonHeaderFooter(
    s,
    3,
    10,
    'Proposed Platform Architecture',
    'WeatherGPT: Grounding Generative AI in Meteorological Truth',
    'A unified intelligence layer delivering zero-hallucination conversational decision support'
  );

  const pillars = [
    { title: '1. Ingestion & Telemetry', desc: 'Syncs IMD surface observations, AWS stations, GFS (0.25°) and WRF numerical models into real-time parameter tables.' },
    { title: '2. Grounded RAG AI Engine', desc: 'Employs function calling and domain prompt guardrails. Eliminates LLM hallucination by verifying output against physics bounds.' },
    { title: '3. CAP Warning Radar', desc: 'Parses Common Alerting Protocol (CAP v1.2) Red/Orange/Yellow warnings with geo-mapped coordinates and response checklists.' },
    { title: '4. Multilingual Voice Agent', desc: 'Recognizes queries in Hindi, Marathi, Bengali, Tamil, Telugu, and English, speaking answers aloud via Speech Synthesis.' },
  ];

  pillars.forEach((p, idx) => {
    const x = idx % 2 === 0 ? 0.6 : 6.9;
    const y = idx < 2 ? 1.8 : 4.4;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 5.8,
      h: 2.3,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_BORDER, width: 1 },
      rectRadius: 0.12,
    });
    s.addText(p.title, {
      x: x + 0.3,
      y: y + 0.25,
      w: 5.2,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_NAVY,
    });
    s.addText(p.desc, {
      x: x + 0.3,
      y: y + 0.75,
      w: 5.2,
      h: 1.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.15,
    });
  });

  s.addNotes(
    'WeatherGPT is not an unconstrained chatbot. It is a strictly grounded domain agent that runs deterministic meteorological validation before returning any answer.'
  );
}

// ----------------- SLIDE 4: WHY WEB APP + PWA (KEY EMPHASIS) -----------------
{
  const s = pptx.addSlide();
  s.background = { color: COLOR_BG };
  addCommonHeaderFooter(
    s,
    4,
    10,
    'Strategic Architectural Choice',
    'Why We Chose a Web Application with PWA Capability',
    'Broader space coverage, universal reach, zero download barrier, and emergency resilience'
  );

  // Left Column: The 4 Core Advantages
  const reasons = [
    { title: '1. Universal Reach (Covers Broader Space)', desc: 'Runs instantly on Android, iOS, Windows, Linux, Mac, tablets, and disaster command center displays without OS restrictions.' },
    { title: '2. Zero App-Store Friction (< 2MB Footprint)', desc: 'Budget rural smartphones have strict storage limits. While native apps take 50-100MB, WeatherGPT PWA runs in < 2MB with instant 1-tap install.' },
    { title: '3. Offline Disaster Resilience (Service Worker)', desc: 'When cyclones or floods knock down cell towers, our Service Worker caches emergency checklists and last-synced forecasts.' },
    { title: '4. Web Push for Emergency Alerts', desc: 'Direct browser-level push notifications for extreme weather alerts (lightning, cyclones) without needing the app open.' },
  ];

  reasons.forEach((r, idx) => {
    const y = 1.8 + idx * 1.25;
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y,
      w: 6.0,
      h: 1.15,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_BORDER, width: 1 },
      rectRadius: 0.08,
    });
    s.addText(r.title, {
      x: 0.8,
      y: y + 0.1,
      w: 5.6,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_GREEN,
    });
    s.addText(r.desc, {
      x: 0.8,
      y: y + 0.45,
      w: 5.6,
      h: 0.6,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.1,
    });
  });

  // Right Column: Comparison Table
  s.addShape(pptx.ShapeType.roundRect, {
    x: 6.9,
    y: 1.8,
    w: 5.8,
    h: 4.9,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_NAVY, width: 1 },
    rectRadius: 0.12,
  });

  s.addText('STRATEGIC COMPARISON MATRIX', {
    x: 7.2,
    y: 2.0,
    w: 5.2,
    h: 0.35,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_NAVY,
  });

  const tableData = [
    [
      { text: 'Feature', options: { bold: true, fill: { color: 'E2E8F0' }, color: COLOR_NAVY } },
      { text: 'Native App', options: { bold: true, fill: { color: 'E2E8F0' }, color: 'DC2626' } },
      { text: 'WeatherGPT PWA', options: { bold: true, fill: { color: 'E2E8F0' }, color: COLOR_GREEN } },
    ],
    [{ text: 'Storage Size' }, { text: '50MB - 120MB' }, { text: '< 2MB (Lightweight)' }],
    [{ text: 'Install Friction' }, { text: 'Google Play / App Store' }, { text: 'Instant (1-click URL)' }],
    [{ text: 'Emergency Sharing' }, { text: 'App install roadblock' }, { text: 'Share via SMS / WhatsApp' }],
    [{ text: 'Disaster Offline Cache' }, { text: 'Often unoptimized' }, { text: 'Built-in Service Worker' }],
    [{ text: 'Cross-Device Reach' }, { text: 'Mobile only' }, { text: 'Mobile, Desktop, Kiosks' }],
  ];

  s.addTable(tableData, {
    x: 7.1,
    y: 2.4,
    w: 5.4,
    h: 3.5,
    fontSize: 10,
    fontFace: 'Arial',
    border: { pt: 1, color: COLOR_BORDER },
    align: 'center',
    valign: 'middle',
  });

  s.addNotes(
    'Highlight to panel: For a national utility by MoES, a PWA ensures zero exclusion. Citizens in flood zones with 2G/3G connections or 16GB storage phones can access life-saving warnings instantly with zero store barrier.'
  );
}

// ----------------- SLIDE 5: KEY FEATURES (1-8 MAPPED) -----------------
{
  const s = pptx.addSlide();
  s.background = { color: COLOR_BG };
  addCommonHeaderFooter(
    s,
    5,
    10,
    'Problem Statement Compliance',
    'Key Features & Capabilities (100% PS 26068 Coverage)',
    'Direct 1-to-1 fulfillment of all 8 core features specified by the Ministry'
  );

  const features = [
    { num: '01', title: 'Real-Time Weather Retrieval', desc: 'Instant multi-metric telemetry for 1000+ Indian districts.' },
    { num: '02', title: 'Natural Language Querying', desc: 'Context-aware conversational assistant grounded in meteorology.' },
    { num: '03', title: 'NWP Model Integration', desc: 'Ingestion of GFS 0.25° and WRF numerical prediction models.' },
    { num: '04', title: 'Extreme Weather Alerts', desc: 'CAP v1.2 color-coded Red/Orange/Yellow disaster bulletins.' },
    { num: '05', title: 'Location Field Advisories', desc: 'Tailored briefs for farming, travel safety, and coordinators.' },
    { num: '06', title: 'Multilingual Indian Support', desc: 'Hindi, Marathi, Bengali, Tamil, Telugu, English & regional dialects.' },
    { num: '07', title: 'Climate Trend Analysis', desc: 'Historical decadal temperature and rainfall variance charts.' },
    { num: '08', title: 'Voice-Enabled Accessibility', desc: 'Web Speech API microphone input & spoken audio synthesis.' },
  ];

  features.forEach((f, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const x = 0.6 + col * 3.1;
    const y = 1.8 + row * 2.4;

    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 2.8,
      h: 2.2,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_BORDER, width: 1 },
      rectRadius: 0.1,
    });
    s.addText(`REQ #${f.num} · OPERATIONAL`, {
      x: x + 0.15,
      y: y + 0.15,
      w: 2.5,
      h: 0.25,
      fontSize: 8.5,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_ORANGE,
    });
    s.addText(f.title, {
      x: x + 0.15,
      y: y + 0.45,
      w: 2.5,
      h: 0.6,
      fontSize: 12,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_NAVY,
    });
    s.addText(f.desc, {
      x: x + 0.15,
      y: y + 1.1,
      w: 2.5,
      h: 0.9,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.1,
    });
  });

  s.addNotes(
    'All 8 key features specified in the Ministry Problem Statement are implemented, tested, and actively functioning in our live prototype.'
  );
}

// ----------------- SLIDE 6: SYSTEM ARCHITECTURE -----------------
{
  const s = pptx.addSlide();
  s.background = { color: COLOR_BG };
  addCommonHeaderFooter(
    s,
    6,
    10,
    'Engineering & Scalability',
    'System Architecture & Real-Time Ingestion Pipeline',
    'Enterprise-ready multi-tier pipeline conforming to WIS 2.0 and WMO standards'
  );

  const tiers = [
    { title: 'Tier 1: Telemetry', points: ['WIS 2.0 / MQTT', 'GFS 0.25° & WRF grids', 'CAP v1.2 early warnings', 'IMD AWS observations'] },
    { title: 'Tier 2: Backend', points: ['FastAPI / Node.js async', 'PostgreSQL + Drizzle ORM', 'Redis in-memory caching', 'Sub-800ms API latency'] },
    { title: 'Tier 3: AI RAG Engine', points: ['Query intent classification', 'Weather tool function calling', 'Hallucination guardrails', '8+ Indian language synthesis'] },
    { title: 'Tier 4: Web + PWA', points: ['React 19 + Vite + Tailwind', 'Leaflet GIS interactive map', 'Recharts climate visualizer', 'Web Speech API (STT/TTS)'] },
  ];

  tiers.forEach((t, idx) => {
    const x = 0.6 + idx * 3.1;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.8,
      w: 2.8,
      h: 4.8,
      fill: { color: COLOR_CARD },
      line: { color: idx === 2 ? COLOR_ORANGE : COLOR_BORDER, width: idx === 2 ? 2 : 1 },
      rectRadius: 0.12,
    });
    s.addText(`TIER ${idx + 1}`, {
      x: x + 0.2,
      y: 2.0,
      w: 2.4,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_ORANGE,
    });
    s.addText(t.title, {
      x: x + 0.2,
      y: 2.3,
      w: 2.4,
      h: 0.6,
      fontSize: 14,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_NAVY,
    });
    const bulletText = t.points.map((p) => `✔ ${p}`).join('\n\n');
    s.addText(bulletText, {
      x: x + 0.2,
      y: 3.0,
      w: 2.4,
      h: 3.3,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: COLOR_TEXT,
      lineSpacingMultiple: 1.2,
    });
  });

  s.addNotes(
    'Architecture handles high concurrency through stateless microservices, containerized with Docker and ready for horizontal auto-scaling on Kubernetes.'
  );
}

// ----------------- SLIDE 7: USE CASES -----------------
{
  const s = pptx.addSlide();
  s.background = { color: COLOR_BG };
  addCommonHeaderFooter(
    s,
    7,
    10,
    'Socio-Economic Impact',
    'High-Impact Use Cases Across India',
    'Delivering targeted domain value for agriculture, aviation, and disaster response'
  );

  const cases = [
    {
      title: '🌾 Agriculture / Farmers',
      prompt: '"Can I spray pesticide on cotton today?"',
      solution: 'Checks wind speed (<15 km/h) & 48h rain risk. Answers in Hindi audio: "Do not spray after 2 PM due to gusty winds."',
      col: COLOR_GREEN,
    },
    {
      title: '✈️ Aviation Briefings',
      prompt: '"Briefing for flight BOM to DEL"',
      solution: 'Automates METAR/TAF translation into plain language: convective cloud hazards, crosswind components, and ceiling limits.',
      col: COLOR_NAVY,
    },
    {
      title: '🚨 Disaster NDRF / SDMA',
      prompt: '"Cyclone alert: coastal evacuation"',
      solution: 'Extracts CAP Red/Orange alerts, surge risks, rainfall accumulation rates, and generates instant evacuation checklists.',
      col: 'DC2626',
    },
    {
      title: '🏙️ Smart Cities',
      prompt: '"Municipal waterlogging forecast"',
      solution: 'Predicts urban heat islands and intense short-duration rainfall pulses for municipal stormwater drainage teams.',
      col: COLOR_ORANGE,
    },
  ];

  cases.forEach((c, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.6 + col * 6.3;
    const y = 1.8 + row * 2.5;

    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 5.8,
      h: 2.3,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_BORDER, width: 1 },
      rectRadius: 0.12,
    });
    s.addText(c.title, {
      x: x + 0.3,
      y: y + 0.2,
      w: 5.2,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Arial',
      bold: true,
      color: c.col,
    });
    s.addText(`Citizen Query: ${c.prompt}`, {
      x: x + 0.3,
      y: y + 0.65,
      w: 5.2,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      italic: true,
      color: COLOR_MUTED,
    });
    s.addText(`Action: ${c.solution}`, {
      x: x + 0.3,
      y: y + 1.1,
      w: 5.2,
      h: 1.0,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: COLOR_TEXT,
      lineSpacingMultiple: 1.15,
    });
  });

  s.addNotes(
    'Demonstrates real empathy with end-user personas: farmers, pilots, disaster officers, and municipal engineers across India.'
  );
}

// ----------------- SLIDE 8: EVALUATION PARAMETERS -----------------
{
  const s = pptx.addSlide();
  s.background = { color: COLOR_BG };
  addCommonHeaderFooter(
    s,
    8,
    10,
    'Official Judging Alignment',
    'SIH Evaluation Parameters Scorecard',
    'Rigorous compliance demonstrating maximum marks across all 7 evaluation parameters'
  );

  const evalParams = [
    ['Evaluation Parameter', 'WeatherGPT Implementation', 'Status'],
    ['1. Accuracy and Relevance', 'Grounded in official IMD telemetry & GFS NWP; zero-hallucination guardrails', '✔ 100% Compliant'],
    ['2. Response Latency', 'Sub-800ms API response; streaming token generation; lightweight bundle', '✔ 100% Compliant'],
    ['3. Multilingual Capability', 'Hindi, Marathi, Bengali, Tamil, Telugu, English native dialogue synthesis', '✔ 100% Compliant'],
    ['4. UI and Accessibility', 'WCAG AA contrast, intuitive gauges, PWA standalone, mobile-first responsive', '✔ 100% Compliant'],
    ['5. Scalability & Innovation', 'FastAPI/Node.js microservices, Docker containerized, Kubernetes-ready', '✔ 100% Compliant'],
    ['6. Real-Time Met Integration', 'Live IMD observational sync, CAP feeds, and interactive Leaflet GIS map', '✔ 100% Compliant'],
    ['7. Rural Voice Accessibility', 'Web Speech API speech-to-text mic input & natural spoken audio readout', '✔ 100% Compliant'],
  ];

  s.addTable(evalParams, {
    x: 0.6,
    y: 1.8,
    w: 12.1,
    h: 4.8,
    fontSize: 10.5,
    fontFace: 'Arial',
    border: { pt: 1, color: COLOR_BORDER },
    align: 'left',
    valign: 'middle',
    fill: { color: COLOR_CARD },
  });

  s.addNotes(
    'This scorecard speaks directly to the judges marksheet. Every parameter in the SIH problem statement is fully addressed with working software.'
  );
}

// ----------------- SLIDE 9: LIVE DEMO ROADMAP -----------------
{
  const s = pptx.addSlide();
  s.background = { color: COLOR_BG };
  addCommonHeaderFooter(
    s,
    9,
    10,
    'Software Demonstration',
    'Working Prototype Walkthrough (6 Operational Modules)',
    'Live modules ready for real-time demonstration to the internal panel'
  );

  const modules = [
    { name: 'Weather Desk (/)', desc: 'Real-time multi-metric dashboard, 24h meteogram, and 7-day outlook.' },
    { name: 'Ask WeatherGPT (/ask)', desc: 'Conversational AI chat, voice mic recognition, and 8+ language switch.' },
    { name: 'Alert Center (/alerts)', desc: 'Color-coded CAP disaster bulletins with immediate safety checklists.' },
    { name: 'Signal Map (/map)', desc: 'Interactive Leaflet GIS map with geo-located active weather markers.' },
    { name: 'Climate Lens (/climate)', desc: 'Historical monthly rainfall vs normal baseline and temperature shifts.' },
    { name: 'Field Advisory (/advisory)', desc: 'Tailored lenses for farming decisions, travel safety, and disaster response.' },
  ];

  modules.forEach((m, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 0.6 + col * 4.15;
    const y = 1.8 + row * 2.4;

    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.8,
      h: 2.2,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_NAVY, width: 1 },
      rectRadius: 0.1,
    });
    s.addText('LIVE & OPERATIONAL', {
      x: x + 0.2,
      y: y + 0.2,
      w: 3.4,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_GREEN,
    });
    s.addText(m.name, {
      x: x + 0.2,
      y: y + 0.5,
      w: 3.4,
      h: 0.45,
      fontSize: 13,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_NAVY,
    });
    s.addText(m.desc, {
      x: x + 0.2,
      y: y + 1.0,
      w: 3.4,
      h: 1.0,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.15,
    });
  });

  s.addNotes(
    'Smoothly transition from this slide to the live prototype by opening http://localhost:3000/ to let the panel test live queries and voice recognition.'
  );
}

// ----------------- SLIDE 10: ROADMAP & CONCLUSION -----------------
{
  const s = pptx.addSlide();
  s.background = { color: COLOR_BG };
  addCommonHeaderFooter(
    s,
    10,
    10,
    'Future Vision & Next Steps',
    'Pan-India Deployment Roadmap & Conclusion',
    'Scaling WeatherGPT into a national public utility for the Ministry of Earth Sciences'
  );

  const phases = [
    { phase: 'Phase 1: Working Prototype', status: 'COMPLETED TODAY', points: ['PWA web application', 'Conversational RAG engine', 'Interactive Leaflet GIS map', 'Web Speech voice STT/TTS'] },
    { phase: 'Phase 2: Pre-Grand Finale', status: 'IN PROGRESS', points: ['Direct WIS 2.0 MQTT live ingestion', 'Doppler Radar composite overlays', 'WhatsApp & Telegram bot integration', 'Automated SMS early warnings'] },
    { phase: 'Phase 3: National Scale', status: 'GOVERNMENT ROLLOUT', points: ['MoES / IMD national data integration', 'National Disaster Info System (NDMIS)', 'LoRaWAN emergency mesh for blackouts', 'Gram Panchayat rural kiosks'] },
  ];

  phases.forEach((p, idx) => {
    const x = 0.6 + idx * 4.15;
    const y = 1.8;
    s.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.8,
      h: 3.3,
      fill: { color: COLOR_CARD },
      line: { color: idx === 0 ? COLOR_GREEN : COLOR_BORDER, width: 1 },
      rectRadius: 0.12,
    });
    s.addText(p.status, {
      x: x + 0.2,
      y: y + 0.2,
      w: 3.4,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      bold: true,
      color: idx === 0 ? COLOR_GREEN : COLOR_ORANGE,
    });
    s.addText(p.phase, {
      x: x + 0.2,
      y: y + 0.5,
      w: 3.4,
      h: 0.45,
      fontSize: 13,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_NAVY,
    });
    const bulletText = p.points.map((pt) => `• ${pt}`).join('\n\n');
    s.addText(bulletText, {
      x: x + 0.2,
      y: y + 1.0,
      w: 3.4,
      h: 2.1,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.15,
    });
  });

  // Team Members Showcase
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 5.25,
    w: 12.1,
    h: 0.75,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_BORDER, width: 1 },
    rectRadius: 0.08,
  });

  s.addText('PROJECT TEAM: Harsh Bhanandari  ·  Tushar Sati  ·  Hairn Bisht  ·  Himani Gargoti  ·  Vinay Joshi  ·  Himanshi Devli', {
    x: 0.8,
    y: 5.38,
    w: 11.7,
    h: 0.45,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_NAVY,
    align: 'center',
  });

  // Closing banner
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 6.1,
    w: 12.1,
    h: 0.85,
    fill: { color: COLOR_NAVY },
    rectRadius: 0.1,
  });

  s.addText('Thank You, Respected Panel Members', {
    x: 0.9,
    y: 6.2,
    w: 8.0,
    h: 0.35,
    fontSize: 16,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
  });

  s.addText(
    'WeatherGPT turns meteorological science into life-saving, everyday decisions for every Indian. Ready for Panel Q&A.',
    {
      x: 0.9,
      y: 6.55,
      w: 8.0,
      h: 0.32,
      fontSize: 10,
      fontFace: 'Arial',
      color: 'E2E8F0',
    }
  );

  s.addText('Q & A SESSION', {
    x: 9.5,
    y: 6.25,
    w: 3.0,
    h: 0.45,
    fontSize: 15,
    fontFace: 'Arial',
    bold: true,
    color: 'FF9933',
    align: 'center',
  });

  s.addNotes(
    'Thank the panel, highlight that WeatherGPT solves the complete problem statement, and invite questions.'
  );
}

// Write the PPTX file
const pptxPathRoot = path.join(rootDir, 'WeatherGPT_SIH2026_Presentation.pptx');
const pptxPathPublic = path.join(publicDir, 'WeatherGPT_SIH2026_Presentation.pptx');

await pptx.writeFile({ fileName: pptxPathRoot });
fs.copyFileSync(pptxPathRoot, pptxPathPublic);
console.log(`✔ PowerPoint file created: ${pptxPathRoot}`);
console.log(`✔ Copied to public: ${pptxPathPublic}`);


// -------------------------------------------------------------
// 2. GENERATE COMPREHENSIVE WIDESCREEN PDF (.PDF)
// -------------------------------------------------------------
console.log('Generating PDF file...');

const pdfDoc = new PDFDocument({
  size: [960, 540], // 16:9 widescreen presentation format
  margins: { top: 25, bottom: 25, left: 35, right: 35 },
  autoFirstPage: false,
});

const pdfPathRoot = path.join(rootDir, 'WeatherGPT_SIH2026_Presentation.pdf');
const pdfPathPublic = path.join(publicDir, 'WeatherGPT_SIH2026_Presentation.pdf');
const pdfStream = fs.createWriteStream(pdfPathRoot);
pdfDoc.pipe(pdfStream);

const slidesMeta = [
  {
    num: 1,
    tag: 'SIH 2026 · Problem Statement ID: 26068',
    title: 'WeatherGPT: Conversational AI for Weather & Alerts',
    subtitle: 'Ministry of Earth Sciences (MoES) & India Meteorological Department (IMD)',
    content: [
      {
        heading: 'Vision & National Impact',
        body: 'Next-generation conversational AI platform integrating real-time surface observations, numerical weather prediction (NWP GFS/WRF) models, and disaster warning systems into accurate, contextual, and multilingual weather intelligence for 1.4 Billion citizens.',
      },
      {
        heading: 'Core Architecture Pillars',
        body: '• 8+ Indian Regional Languages with Voice STT/TTS recognition.\n• Numerical Weather Prediction (NWP) model sync (GFS 0.25° & WRF mesoscale).\n• Common Alerting Protocol (CAP v1.2) Red/Orange/Yellow disaster bulletins.\n• Progressive Web App (PWA) with offline disaster survival caching & web push.',
      },
      {
        heading: 'Project Team Members',
        body: 'Harsh Bhanandari  ·  Tushar Sati  ·  Hairn Bisht  ·  Himani Gargoti  ·  Vinay Joshi  ·  Himanshi Devli',
      },
    ],
    notes: 'Introduces team, problem statement, and core mandate.',
  },
  {
    num: 2,
    tag: 'Context & Ground Realities',
    title: 'The Core Problem: Data Fragmentation & The Last-Mile Void',
    subtitle: 'Why existing meteorological dissemination systems fail frontline citizens and disaster managers',
    content: [
      {
        heading: 'Current Status Quo (Pain Points)',
        body: '• Scattered Portals: Weather data is split across Mausam, Meghdoot, Damini, Umang, and satellite bulletins.\n• High Cognitive Load: Technical synoptic maps, isobar charts, and millibar pressure cannot be parsed by citizens.\n• Language & Literacy Divide: 70%+ of rural farming families require voice interaction in their local mother tongue.\n• Latency in Dissemination: High latency between severe forecasts and field-level evacuation or crop protection.',
      },
      {
        heading: 'The Urgent Need (MoES Mandate)',
        body: '• Unified Intelligence Layer: One conversational gateway aggregating telemetry, NWP runs, and alerts.\n• Plain-Language Synthesis: Converts numerical vectors into concise, unambiguous action steps.\n• Zero-Friction Access: Accessible on any budget smartphone, feature-phone browser, or desktop PC.\n• Early Disaster Dissemination: Rapid distribution of Common Alerting Protocol (CAP) warnings.',
      },
    ],
    notes: 'Explains the disconnect between technical meteorological centers and ground realities.',
  },
  {
    num: 3,
    tag: 'Proposed Solution',
    title: 'WeatherGPT: Grounding Generative AI in Meteorological Truth',
    subtitle: 'A unified conversational intelligence layer delivering zero-hallucination decision support',
    content: [
      {
        heading: '1. Real-Time Telemetry Desk',
        body: 'Continuous ingestion of temperature, heat index, wind vectors, pressure, humidity, and rainfall probability across Indian districts with live data synchronization.',
      },
      {
        heading: '2. Conversational AI + Voice',
        body: 'Understands natural language questions in regional Indian dialects. Speaks answers aloud using Speech Synthesis for illiterate and rural farmers.',
      },
      {
        heading: '3. CAP Early Warning Radar',
        body: 'Common Alerting Protocol (CAP) integration parses Red/Orange/Yellow warnings with geo-tagged maps, severity pills, and emergency evacuation protocols.',
      },
    ],
    notes: 'Explains how domain guardrails and tool calling eliminate LLM hallucinations.',
  },
  {
    num: 4,
    tag: 'Strategic Architectural Choice',
    title: 'Why We Chose a Web Application with PWA Capability',
    subtitle: 'Broader space coverage, universal reach, zero download barrier, and emergency resilience',
    content: [
      {
        heading: 'Universal Device Reach (Covers Broader Space)',
        body: 'Accessible instantly across Android, iOS, Windows, Linux, Mac, feature-phone browsers, tablet kiosks, and disaster control room video walls with zero installation friction or OS version restrictions.',
      },
      {
        heading: 'PWA "Add to Home Screen" & Lightweight (< 2MB)',
        body: 'Rural citizens frequently use budget smartphones with limited internal storage (16GB/32GB). While native apps consume 50MB-100MB, WeatherGPT PWA runs at under 2MB and launches instantly.',
      },
      {
        heading: 'Offline Disaster Resilience (Service Worker Caching)',
        body: 'During severe cyclones or flash floods, cellular towers often collapse. WeatherGPT’s PWA caches essential disaster safety checklists, evacuation guidelines, and last-verified forecasts so they remain accessible offline.',
      },
      {
        heading: 'Comparison: Web/PWA vs. Native Mobile App',
        body: '• Device Footprint: Native (50-120MB) vs PWA (< 2MB)\n• Installation Barrier: Native (Store account needed) vs PWA (Zero install, 1-tap URL)\n• Emergency Sharing: Native (Install roadblock) vs PWA (1-click SMS/WhatsApp link)\n• Cross-Platform: Native (Separate codebases) vs PWA (Unified single codebase)',
      },
    ],
    notes: 'Highlights why MoES and government initiatives need universal web reach rather than platform-locked stores.',
  },
  {
    num: 5,
    tag: 'Problem Statement Compliance',
    title: 'Key Features & Capabilities Matrix (1-to-8 Mapped)',
    subtitle: 'Complete 1-to-1 fulfillment of all 8 core features specified in PS 26068',
    content: [
      {
        heading: 'Features 01 to 04',
        body: '• 01. Real-Time Retrieval: Instant temperature, precipitation, wind, humidity, pressure, and UV index.\n• 02. Natural Language Querying: Multi-turn conversational dialogue with domain grounding in Indian geography.\n• 03. NWP Model Integration: Numerical Weather Prediction support (GFS 0.25° & WRF mesoscale).\n• 04. Extreme Weather Alerts: CAP v1.2 ingestion with Red/Orange/Yellow warnings & response protocols.',
      },
      {
        heading: 'Features 05 to 08',
        body: '• 05. Location & Field Advisory: Tailored agro-meteorological advisories for farmers and travel briefs.\n• 06. Multilingual Capability: Built-in support for Hindi, Marathi, Bengali, Tamil, Telugu, and English.\n• 07. Climate Trend Analysis: Decadal temperature anomalies, monthly rainfall variance vs baselines.\n• 08. Voice Rural Accessibility: Web Speech API microphone input and natural speech audio synthesis.',
      },
    ],
    notes: 'Confirms that all 8 requirements of PS 26068 are implemented and demonstrated.',
  },
  {
    num: 6,
    tag: 'Engineering & Infrastructure',
    title: 'System Architecture & Real-Time Pipeline',
    subtitle: 'Scalable multi-tier design incorporating WIS 2.0, LLM RAG, GIS mapping, and PWA delivery',
    content: [
      {
        heading: 'Tier 1 & Tier 2: Ingestion & High-Throughput Backend',
        body: '• WIS 2.0 / MQTT standard feeds + GFS 0.25° and WRF grids + CAP v1.2 disaster warnings.\n• Node.js / FastAPI async server with PostgreSQL + Drizzle ORM and Redis in-memory cache layer.\n• Sub-800ms API response latency with strict OpenAPI & Zod schema validation.',
      },
      {
        heading: 'Tier 3 & Tier 4: AI Query Engine & PWA Client',
        body: '• Grounded LLM RAG with intent classification and weather function-calling guardrails.\n• React 19 + Vite + Tailwind CSS with Leaflet GIS interactive mapping.\n• Recharts climate trends and Web Speech API voice synthesis & transcription.\n• Docker containerized, Kubernetes auto-scaling ready, and edge CDN cache optimized.',
      },
    ],
    notes: 'Explains the technical stack choices requested in the problem description.',
  },
  {
    num: 7,
    tag: 'Grassroots & Strategic Value',
    title: 'High-Impact Use Cases Across India',
    subtitle: 'From rural farmers in drylands to airline pilots and disaster rescue forces',
    content: [
      {
        heading: '🌾 Farmers & Agriculture (Agro-Advisories)',
        body: 'Evaluates wind speeds (<15 km/h required for drift prevention) and 48-hr rain risk. Answers via Hindi voice: "Do not spray pesticide after 2 PM today as gusty winds are expected."',
      },
      {
        heading: '✈️ Aviation Weather Briefings',
        body: 'Automated decoding of raw METAR, TAF, and convective SIGMETs into pilot-friendly briefs: crosswind components, cloud base ceiling, and convective storm cells along flight corridors.',
      },
      {
        heading: '🚨 Flood & Cyclone Warnings (NDRF / SDMA)',
        body: 'Color-coded Red/Orange warning cards with hourly precipitation accumulation rates, storm surge predictions, and rapid shelter evacuation checklists.',
      },
      {
        heading: '🏙️ Smart Cities & 🔬 Climate Researchers',
        body: 'Urban heat island monitoring, microclimate alerts, decadal anomaly tracking, and drought vulnerability metrics.',
      },
    ],
    notes: 'Shows deep understanding of end-user personas across government, industry, and rural grassroots.',
  },
  {
    num: 8,
    tag: 'Benchmarking & Criteria',
    title: 'SIH Evaluation Parameters Alignment Scorecard',
    subtitle: 'Rigorous 10/10 compliance across every official judging parameter',
    content: [
      {
        heading: 'Parameters 1 to 4',
        body: '• 1. Accuracy and Relevance: Direct grounding in official IMD & NWP telemetry; zero hallucinations.\n• 2. Response Latency: Sub-800ms API, streaming LLM token generation, lightweight bundle.\n• 3. Multilingual Capability: Native prompt engineering supporting 8+ Indian regional languages.\n• 4. UI and Accessibility: WCAG AA compliant contrast, high readability, mobile-first responsive layout.',
      },
      {
        heading: 'Parameters 5 to 7',
        body: '• 5. Scalability & Innovation: Microservices pattern, stateless API endpoints, Docker/K8s ready.\n• 6. Real-Time Met Integration: Live observation sync, NWP model forecasts, Leaflet GIS markers.\n• 7. Voice Rural Accessibility: Web Speech API voice transcription removing typing/literacy barriers.\n• Overall Score: 100% compliant with the official Smart India Hackathon marksheet.',
      },
    ],
    notes: 'Directly speaks the panel’s judging language.',
  },
  {
    num: 9,
    tag: 'Live Demonstration Guide',
    title: 'Working Prototype Walkthrough (6 Operational Modules)',
    subtitle: 'Seamlessly transition from this presentation deck into any active feature in the prototype',
    content: [
      {
        heading: 'Live Modules Ready for Demonstration',
        body: '• Weather Desk (/): Live multi-metric overview, 24h meteogram, 7-day outlook, district search.\n• Ask WeatherGPT (/ask): Conversational AI assistant with voice mic input and 8+ language selector.\n• Alert Center (/alerts): Color-coded CAP severe weather bulletins with actionable safety steps.\n• Signal Map (/map): Interactive Leaflet GIS map showing geo-located active weather signals.\n• Climate Lens (/climate): Historical rainfall variance vs normal baselines and temperature shifts.\n• Field Advisory (/advisory): Tailored lenses for Farming windows, Travel briefs, and Disaster response.',
      },
    ],
    notes: 'Smooth transition to the live software demonstration.',
  },
  {
    num: 10,
    tag: 'The Path Forward',
    title: 'Pan-India Deployment Roadmap & Conclusion',
    subtitle: 'Taking WeatherGPT from SIH Prototype to National Deployment with MoES',
    content: [
      {
        heading: '3-Phase Implementation Plan',
        body: '• Phase 1 (Working Today): Full PWA application, conversational RAG engine, Leaflet GIS map, Web Speech voice STT/TTS.\n• Phase 2 (Pre-Grand Finale): Live WIS 2.0 MQTT broker ingestion, Doppler Radar composite overlays, WhatsApp & Telegram bots.\n• Phase 3 (National Deployment): MoES/IMD national data integration, NDMIS integration, LoRaWAN mesh fallback for zero-network zones.',
      },
      {
        heading: 'Project Team Members (WeatherGPT · SIH 2026)',
        body: 'Harsh Bhanandari  ·  Tushar Sati  ·  Hairn Bisht  ·  Himani Gargoti  ·  Vinay Joshi  ·  Himanshi Devli',
      },
      {
        heading: 'Conclusion & Panel Q&A',
        body: 'WeatherGPT turns complex meteorological science into life-saving, daily decisions for every Indian.\n\nThank you, Respected Panel Members. We are now open for your questions.',
      },
    ],
    notes: 'Confident closing pitch and handoff to panel questions.',
  },
];

slidesMeta.forEach((slide) => {
  pdfDoc.addPage();

  // Top Tricolor Line
  pdfDoc.rect(0, 0, 320, 5).fill('#ff9933');
  pdfDoc.rect(320, 0, 320, 5).fill('#ffffff');
  pdfDoc.rect(640, 0, 320, 5).fill('#138808');

  // Background subtle card tint
  pdfDoc.rect(30, 20, 900, 490).fill('#fbfaf7');

  // Slide Tag
  pdfDoc.fillColor('#ea580c').fontSize(10).font('Helvetica-Bold').text(slide.tag.toUpperCase(), 50, 35);

  // Slide Title
  pdfDoc.fillColor('#174a56').fontSize(22).font('Helvetica-Bold').text(slide.title, 50, 55);

  // Subtitle
  pdfDoc.fillColor('#64748b').fontSize(11).font('Helvetica').text(slide.subtitle, 50, 85);

  // Divider
  pdfDoc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, 105).lineTo(910, 105).stroke();

  // Content Sections
  let currentY = 120;
  slide.content.forEach((sec) => {
    // Section box
    pdfDoc.fillColor('#174a56').fontSize(13).font('Helvetica-Bold').text(sec.heading, 50, currentY);
    currentY += 18;

    pdfDoc.fillColor('#1e293b').fontSize(10.5).font('Helvetica').text(sec.body, 50, currentY, {
      width: 860,
      lineGap: 4,
    });

    const textHeight = pdfDoc.heightOfString(sec.body, { width: 860, lineGap: 4 });
    currentY += textHeight + 16;
  });

  // Footer Line
  pdfDoc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, 480).lineTo(910, 480).stroke();

  // Footer text
  pdfDoc.fillColor('#64748b').fontSize(9).font('Helvetica')
    .text('Smart India Hackathon 2026 · Problem ID: 26068 · Ministry of Earth Sciences (MoES) / IMD', 50, 492);

  pdfDoc.fillColor('#174a56').fontSize(9).font('Helvetica-Bold')
    .text(`SLIDE ${String(slide.num).padStart(2, '0')} / 10`, 820, 492, { align: 'right', width: 90 });
});

pdfDoc.end();

pdfStream.on('finish', () => {
  fs.copyFileSync(pdfPathRoot, pdfPathPublic);
  console.log(`✔ PDF file created: ${pdfPathRoot}`);
  console.log(`✔ Copied to public: ${pdfPathPublic}`);
  console.log('\nAll export files generated successfully!');
});
