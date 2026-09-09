import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CloudRain,
  CloudSun,
  Compass,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Globe,
  Grid,
  HelpCircle,
  Layers,
  Leaf,
  Map as MapIcon,
  MapPin,
  Maximize2,
  MessageCircle,
  Mic,
  Minimize2,
  Navigation,
  Printer,
  Radio,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Target,
  Thermometer,
  Tv,
  Users,
  Volume2,
  WifiOff,
  Wind,
  Zap,
} from 'lucide-react';
import { BrandMark } from '@/components/weather-ui';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  speakerNotes: string;
  content: React.ReactNode;
}

const TEAM_NAME = 'Team WeatherGPT';
const TEAM_ID = '[Team ID]';
const TEAM_MEMBERS = [
  'Harsh Bhanandari',
  'Tushar Sati',
  'Hairn Bisht',
  'Himani Gargoti',
  'Vinay Joshi',
  'Himanshi Devli',
];

export function PresentationPage() {
  const [deckType, setDeckType] = useState<'official' | 'extended'>('official');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // -------------------------------------------------------------
  // DECK 1: OFFICIAL SIH 2026 6-SLIDE TEMPLATE (STRICT COMPLIANCE)
  // -------------------------------------------------------------
  const officialSlides: Slide[] = [
    // ----------------- SLIDE 1: TITLE PAGE -----------------
    {
      id: 1,
      tag: 'SMART INDIA HACKATHON 2026 · TITLE PAGE',
      title: 'SMART INDIA HACKATHON 2026',
      subtitle: 'TITLE PAGE · Problem Statement ID: 26068',
      speakerNotes:
        'Respected Panel Members, we are presenting our idea for Problem Statement 26068: WeatherGPT under the Ministry of Earth Sciences and India Meteorological Department. Our team has developed a conversational AI platform integrating meteorological datasets, forecasting models, and disaster alerts.',
      content: (
        <div className="h-full flex flex-col justify-between">
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 items-start">
            <div className="space-y-4">
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--foreground))] min-w-[200px] shrink-0">• Problem Statement ID –</span>
                  <span className="mono font-bold text-[hsl(var(--accent))]">26068</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--foreground))] min-w-[200px] shrink-0">• Problem Statement Title –</span>
                  <span className="font-medium text-[hsl(var(--foreground))]">WeatherGPT: Conversational AI for Weather Forecasting, Alerts, and Climate Information</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--foreground))] min-w-[200px] shrink-0">• Theme –</span>
                  <span className="font-semibold text-emerald-600">Disaster Management</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--foreground))] min-w-[200px] shrink-0">• PS Category –</span>
                  <span className="font-semibold text-blue-600">Software</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--foreground))] min-w-[200px] shrink-0">• Organization –</span>
                  <span className="text-[hsl(var(--muted-foreground))]">Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--foreground))] min-w-[200px] shrink-0">• Team ID –</span>
                  <span className="mono font-semibold text-[hsl(var(--primary))]">{TEAM_ID}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--foreground))] min-w-[200px] shrink-0">• Team Name (Registered) –</span>
                  <span className="font-bold text-[hsl(var(--accent))]">{TEAM_NAME}</span>
                </div>
              </div>

              {/* Team Members */}
              <div className="pt-2">
                <p className="font-bold text-xs text-[hsl(var(--foreground))] mb-2">• Team Members –</p>
                <div className="flex flex-wrap gap-1.5">
                  {TEAM_MEMBERS.map((member) => (
                    <span
                      key={member}
                      className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.5)] px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--foreground))]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side emblem / summary */}
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--secondary)/.4)] to-[hsl(var(--card))] p-6 text-center flex flex-col items-center justify-center min-h-[280px]">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md mb-3">
                <CloudSun className="h-9 w-9 text-[hsl(var(--accent))]" />
              </div>
              <h3 className="display text-2xl font-bold text-[hsl(var(--foreground))]">WeatherGPT</h3>
              <p className="mono text-[11px] uppercase tracking-wider text-[hsl(var(--accent))] mt-0.5 font-bold">
                SIH 2026 Submission
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-3 max-w-xs leading-relaxed">
                Conversational AI platform integrating real-time NWP models, CAP disaster warning systems, and multilingual voice for 1.4 Billion citizens.
              </p>
              <div className="mt-4 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                ✔ Operational Prototype Ready
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // ----------------- SLIDE 2: PROPOSED SOLUTION -----------------
    {
      id: 2,
      tag: 'SIH Template Slide 2',
      title: 'IDEA TITLE: WeatherGPT',
      subtitle: '❖ Proposed Solution (Describe your Idea/Solution/Prototype)',
      speakerNotes:
        'Slide 2 covers the 3 mandatory pointers from the SIH template: Detailed explanation of WeatherGPT, how it addresses data fragmentation and language barriers, and its unique innovation including our Web App + PWA approach for universal accessibility.',
      content: (
        <div className="h-full flex flex-col justify-between space-y-4 text-xs sm:text-sm">
          {/* Section 1 */}
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
            <h4 className="font-bold text-xs text-[hsl(var(--primary))] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
              1. Detailed explanation of the proposed solution:
            </h4>
            <p className="mt-1.5 text-xs text-[hsl(var(--foreground)/.85)] leading-relaxed">
              <strong>WeatherGPT</strong> is an intelligent conversational meteorological platform that ingests real-time observation telemetry (AWS stations), Numerical Weather Prediction (NWP GFS 0.25° & WRF) models, and disaster feeds (CAP v1.2). It translates dense atmospheric physics into contextual, plain-language decisions with full voice input/output in 8+ Indian regional languages.
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
            <h4 className="font-bold text-xs text-[hsl(var(--primary))] flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              2. How it addresses the problem:
            </h4>
            <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs text-[hsl(var(--foreground)/.85)]">
              <div className="rounded-lg bg-[hsl(var(--secondary)/.4)] p-2.5">
                <strong>• Eliminates Fragmentation:</strong> Unifies separate IMD portals, radar images, and synoptic charts into a single conversational desk.
              </div>
              <div className="rounded-lg bg-[hsl(var(--secondary)/.4)] p-2.5">
                <strong>• Removes Technical Jargon:</strong> Answers citizen questions directly (e.g. "Can I spray my cotton crop today?") rather than reporting isobar millibars.
              </div>
              <div className="rounded-lg bg-[hsl(var(--secondary)/.4)] p-2.5">
                <strong>• Bridges Literacy Divide:</strong> Speech-to-text (STT) and voice audio readouts empower rural farmers who cannot read text bulletins.
              </div>
              <div className="rounded-lg bg-[hsl(var(--secondary)/.4)] p-2.5">
                <strong>• Accelerates Early Warning:</strong> Common Alerting Protocol (CAP) delivers instantaneous Red/Orange/Yellow disaster bulletins.
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
            <h4 className="font-bold text-xs text-[hsl(var(--primary))] flex items-center gap-2">
              <Award className="h-4 w-4 text-[hsl(var(--accent))]" />
              3. Innovation and uniqueness of the solution:
            </h4>
            <div className="mt-2 grid sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5">
                <strong className="text-emerald-800 dark:text-emerald-300 block">Web App + PWA Architecture:</strong>
                <span className="text-[11px] text-[hsl(var(--foreground)/.8)]">Covers broader device space with &lt;2MB footprint, zero app-store download hurdle, and offline caching during disaster blackouts.</span>
              </div>
              <div className="rounded-lg border border-[hsl(var(--accent)/.3)] bg-[hsl(var(--accent)/.08)] p-2.5">
                <strong className="text-[hsl(var(--accent))] block">Grounded AI (Zero Hallucinations):</strong>
                <span className="text-[11px] text-[hsl(var(--foreground)/.8)]">Combines conversational LLMs with deterministic weather function calling and meteorological boundary checks.</span>
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2.5">
                <strong className="text-blue-700 dark:text-blue-300 block">Multilingual Voice-First:</strong>
                <span className="text-[11px] text-[hsl(var(--foreground)/.8)]">Built-in regional speech recognition and audio synthesis enabling hands-free use in rural agricultural fields.</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // ----------------- SLIDE 3: TECHNICAL APPROACH -----------------
    {
      id: 3,
      tag: 'SIH Template Slide 3',
      title: 'TECHNICAL APPROACH',
      subtitle: 'Technologies & Implementation Methodology',
      speakerNotes:
        'Slide 3 specifies our technical stack and implementation methodology. We demonstrate our 4-tier pipeline from ingestion to PWA client and highlight that the prototype is currently operational.',
      content: (
        <div className="h-full flex flex-col justify-between space-y-4">
          {/* Technologies Box */}
          <div>
            <h4 className="font-bold text-xs text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[hsl(var(--primary))]" />
              • Technologies to be used (programming languages, frameworks, hardware):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="mono text-[10px] font-bold text-[hsl(var(--accent))] uppercase block">Frontend / Client</span>
                <p className="font-semibold text-xs mt-1 text-[hsl(var(--foreground))]">React 19 & Tailwind</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Vite, Leaflet GIS Map, Recharts, Web Speech API (Voice STT/TTS)</p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="mono text-[10px] font-bold text-[hsl(var(--primary))] uppercase block">Backend / APIs</span>
                <p className="font-semibold text-xs mt-1 text-[hsl(var(--foreground))]">FastAPI / Node.js</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Express, OpenAPI codegen, Zod validation, PostgreSQL + Drizzle ORM</p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="mono text-[10px] font-bold text-emerald-600 uppercase block">AI & Telemetry</span>
                <p className="font-semibold text-xs mt-1 text-[hsl(var(--foreground))]">Grounded LLM RAG</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Tool calling, WIS 2.0 / MQTT standard, GFS 0.25° NWP, WRF, CAP v1.2</p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="mono text-[10px] font-bold text-blue-600 uppercase block">Scale & PWA</span>
                <p className="font-semibold text-xs mt-1 text-[hsl(var(--foreground))]">Docker & K8s Ready</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Stateless microservices, Service Worker cache, Edge CDN optimized</p>
              </div>
            </div>
          </div>

          {/* Methodology & Flowchart */}
          <div>
            <h4 className="font-bold text-xs text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[hsl(var(--primary))]" />
              • Methodology and process for implementation (Flow Charts / Images / Working Prototype):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="mono text-[10px] font-bold text-[hsl(var(--accent))]">STEP 1</span>
                <p className="font-bold text-xs mt-1 text-[hsl(var(--foreground))]">Telemetry Ingestion</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">IMD AWS, GFS 0.25° grids, and CAP warning feeds ingested via MQTT & APIs.</p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="mono text-[10px] font-bold text-[hsl(var(--primary))]">STEP 2</span>
                <p className="font-bold text-xs mt-1 text-[hsl(var(--foreground))]">Semantic Processing</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Geospatial indexing, cache normalization, and agro-bulletin vector search.</p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="mono text-[10px] font-bold text-emerald-600">STEP 3</span>
                <p className="font-bold text-xs mt-1 text-[hsl(var(--foreground))]">Grounded AI Engine</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Query intent classifier + deterministic weather tool calling + guardrails.</p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="mono text-[10px] font-bold text-blue-600">STEP 4</span>
                <p className="font-bold text-xs mt-1 text-[hsl(var(--foreground))]">PWA Multi-Channel</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Web link delivery, offline disaster caching, Leaflet GIS map, and voice synthesis.</p>
              </div>
            </div>
          </div>

          {/* Prototype Badge */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center justify-between text-xs">
            <span className="text-emerald-800 dark:text-emerald-200 font-semibold">
              ✔ <strong>Working Prototype Operational Today:</strong> 6 live modules running at http://localhost:3000/
            </span>
            <Link href="/" className="font-bold text-emerald-700 dark:text-emerald-300 underline flex items-center gap-1">
              Test Live App <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ),
    },

    // ----------------- SLIDE 4: FEASIBILITY AND VIABILITY -----------------
    {
      id: 4,
      tag: 'SIH Template Slide 4',
      title: 'FEASIBILITY AND VIABILITY',
      subtitle: 'Analysis, Potential Challenges, Risks, and Mitigation Strategies',
      speakerNotes:
        'Slide 4 covers Feasibility, Risks, and Mitigation Strategies. We highlight how our zero-temperature tool calling prevents AI hallucination, and how PWA offline caching ensures survival during network blackouts.',
      content: (
        <div className="h-full flex flex-col justify-between space-y-3.5 text-xs sm:text-sm">
          {/* 1. Feasibility Analysis */}
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3.5">
            <h4 className="font-bold text-xs text-[hsl(var(--foreground))] mb-1.5 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              • Analysis of the feasibility of the idea:
            </h4>
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-[hsl(var(--foreground)/.85)]">
              <div><strong>• Technical Feasibility:</strong> Battle-tested modern stack (React 19, FastAPI, PostgreSQL) with working prototype operational.</div>
              <div><strong>• Operational Feasibility:</strong> Fully complies with WMO WIS 2.0 & IMD standard open data formats.</div>
              <div><strong>• Economic Feasibility:</strong> Open-source components eliminate licensing costs; low cloud footprint.</div>
              <div><strong>• Adoption Feasibility:</strong> PWA format eliminates the 50MB app-store barrier — accessible via 1-click web link.</div>
            </div>
          </div>

          {/* 2 & 3. Challenges & Mitigation Table */}
          <div>
            <h4 className="font-bold text-xs text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[hsl(var(--accent))]" />
              • Potential challenges and risks & Strategies for overcoming them:
            </h4>
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.5)] text-[hsl(var(--foreground))]">
                    <th className="p-2 font-bold w-1/4">Challenge / Risk Area</th>
                    <th className="p-2 font-bold w-1/3 text-destructive">Potential Vulnerability</th>
                    <th className="p-2 font-bold text-emerald-600">Strategy for Overcoming Challenges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))] text-[11px] text-[hsl(var(--foreground)/.85)]">
                  <tr>
                    <td className="p-2 font-semibold">1. AI Hallucination</td>
                    <td className="p-2 text-destructive">LLMs inventing weather data could endanger public safety.</td>
                    <td className="p-2 text-emerald-700 dark:text-emerald-300 font-medium">Strict deterministic tool-calling; temperature=0; physical parameter boundary checks.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">2. Network Collapse</td>
                    <td className="p-2 text-destructive">Cyclones destroy mobile towers, cutting connectivity.</td>
                    <td className="p-2 text-emerald-700 dark:text-emerald-300 font-medium">PWA Service Worker caches survival guides & last forecasts; planned LoRaWAN mesh fallback.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">3. Linguistic Diversity</td>
                    <td className="p-2 text-destructive">Complex rural dialects with high accent variability.</td>
                    <td className="p-2 text-emerald-700 dark:text-emerald-300 font-medium">Web Speech API with regional dialect acoustic models; prompt normalization into weather intents.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">4. Concurrency Spikes</td>
                    <td className="p-2 text-destructive">Millions of queries during impending cyclones.</td>
                    <td className="p-2 text-emerald-700 dark:text-emerald-300 font-medium">Stateless microservices auto-scaled on Kubernetes; Edge CDN caching on district tiles.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },

    // ----------------- SLIDE 5: IMPACT AND BENEFITS -----------------
    {
      id: 5,
      tag: 'SIH Template Slide 5',
      title: 'IMPACT AND BENEFITS',
      subtitle: 'Target Audience Impact and Socio-Economic-Environmental Returns',
      speakerNotes:
        'Slide 5 demonstrates our multidimensional impact: safeguarding over 700 million rural citizens, empowering disaster rescue teams, and generating massive economic and environmental returns.',
      content: (
        <div className="h-full flex flex-col justify-between space-y-4">
          {/* Target Audience */}
          <div>
            <h4 className="font-bold text-xs text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-[hsl(var(--primary))]" />
              • Potential impact on the target audience:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="font-bold text-emerald-600 block">🌾 Farmers (700M+)</span>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Crop advisories in regional voice; optimal pesticide, sowing, and harvest timing protecting farm income.</p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="font-bold text-red-600 block">🚨 Disaster NDRF/SDMA</span>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Early dissemination of CAP bulletins with rapid evacuation checklists and hourly inundation alerts.</p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="font-bold text-blue-600 block">✈️ Aviation & Logistics</span>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Plain-language METAR/TAF translation, crosswind hazard alerts, and highway visibility warnings.</p>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                <span className="font-bold text-amber-600 block">🏙️ Smart Cities</span>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Urban heat island monitoring, stormwater drainage warnings, and decadal anomaly climate research.</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-bold text-xs text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-[hsl(var(--accent))]" />
              • Benefits of the solution (social, economic, environmental, etc.):
            </h4>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm block mb-1">Social Benefits</span>
                <ul className="space-y-1 text-[11px] text-[hsl(var(--foreground)/.85)]">
                  <li>• Saves lives through timely, location-based early warnings.</li>
                  <li>• Empowers non-literate citizens through voice interaction.</li>
                  <li>• Reduces panic with clear, actionable safety instructions.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5">
                <span className="font-bold text-blue-800 dark:text-blue-300 text-sm block mb-1">Economic Benefits</span>
                <ul className="space-y-1 text-[11px] text-[hsl(var(--foreground)/.85)]">
                  <li>• Mitigates ₹50,000+ Cr annual agricultural weather damage.</li>
                  <li>• Reduces commercial aviation flight diversions and fuel burn.</li>
                  <li>• Minimizes civic municipal damage from localized flash flooding.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                <span className="font-bold text-amber-800 dark:text-amber-300 text-sm block mb-1">Environmental Benefits</span>
                <ul className="space-y-1 text-[11px] text-[hsl(var(--foreground)/.85)]">
                  <li>• Enables sustainable groundwater and irrigation management.</li>
                  <li>• Tracks decadal temperature & monsoon onset shifts.</li>
                  <li>• Facilitates science-driven national disaster resilience policy.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // ----------------- SLIDE 6: RESEARCH AND REFERENCES -----------------
    {
      id: 6,
      tag: 'SIH Template Slide 6',
      title: 'RESEARCH AND REFERENCES',
      subtitle: 'Technical Standards, Meteorological Frameworks & Repository Links',
      speakerNotes:
        'Slide 6 concludes our official presentation with standard references from IMD, WMO, OASIS, and MoES, along with our working prototype repository link.',
      content: (
        <div className="h-full flex flex-col justify-between space-y-3.5">
          <h4 className="font-bold text-xs text-[hsl(var(--foreground))] flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[hsl(var(--primary))]" />
            • Details / Links of the reference and research work:
          </h4>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
              <span className="font-bold text-xs text-[hsl(var(--primary))] block">India Meteorological Department (IMD) - NWP Models</span>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Operational runs of Global Forecast System (GFS 0.25°) and WRF mesoscale forecasting.</p>
              <span className="mono text-[10px] text-[hsl(var(--accent))] mt-1 block">Reference: https://mausam.imd.gov.in</span>
            </div>

            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
              <span className="font-bold text-xs text-[hsl(var(--primary))] block">World Meteorological Organization (WMO) - WIS 2.0</span>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">WMO Information System 2.0 architecture and MQTT pub/sub data exchange standards.</p>
              <span className="mono text-[10px] text-[hsl(var(--accent))] mt-1 block">Reference: https://wmo.int</span>
            </div>

            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
              <span className="font-bold text-xs text-[hsl(var(--primary))] block">OASIS Common Alerting Protocol (CAP v1.2)</span>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">International standard for exchanging public emergency warnings across multi-hazard systems.</p>
              <span className="mono text-[10px] text-[hsl(var(--accent))] mt-1 block">Reference: https://docs.oasis-open.org/emergency/cap/v1.2</span>
            </div>

            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
              <span className="font-bold text-xs text-[hsl(var(--primary))] block">Ministry of Earth Sciences (MoES) & NDMA</span>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">National Monsoon Mission frameworks, HPC clusters, and disaster evacuation SOPs.</p>
              <span className="mono text-[10px] text-[hsl(var(--accent))] mt-1 block">Reference: https://moes.gov.in · https://ndma.gov.in</span>
            </div>
          </div>

          {/* Prototype Link Card */}
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> WeatherGPT Operational Prototype Repository
              </span>
              <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/90 mt-1">
                Full source code, PWA service worker, Leaflet GIS mapping, conversational RAG, and Web Speech integration.
              </p>
            </div>
            <a
              href="https://github.com/satitushar26-tech/WeatherGPT"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ),
    },
  ];

  const activeDeck = officialSlides;
  const totalSlides = activeDeck.length;

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'deck') return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(totalSlides - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, totalSlides, viewMode]);

  const activeSlide = activeDeck[currentSlide];

  return (
    <div
      className={`min-h-[calc(100vh-65px)] bg-[hsl(var(--background))] transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-[hsl(var(--background))] p-4 sm:p-6' : 'p-3 sm:p-6 lg:p-8'
      }`}
    >
      {/* Top Presentation Bar */}
      <div className="mx-auto max-w-7xl mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BrandMark compact />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-[hsl(var(--foreground))]">
                  WeatherGPT · SIH 2026 Official Idea PPT
                </span>
                <span className="rounded bg-[hsl(var(--accent)/.18)] px-1.5 py-0.5 text-[10px] font-bold text-[hsl(var(--accent))] uppercase">
                  Template Compliant (6 Slides)
                </span>
              </div>
              <p className="mono text-[10px] text-[hsl(var(--muted-foreground))]">
                Problem Statement ID: 26068 · Ministry of Earth Sciences (MoES) / IMD
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Official SIH Submission PDF Button */}
          <a
            href="/WeatherGPT_SIH2026_Official_Submission.pdf"
            download="WeatherGPT_SIH2026_Official_Submission.pdf"
            className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-700 dark:text-red-300 hover:bg-red-500/25 transition-colors shadow-xs"
            title="Download Official 6-Slide PDF (Portal Submission Ready)"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Official SIH PDF</span>
          </a>

          {/* Official SIH PPTX Button */}
          <a
            href="/WeatherGPT_SIH2026_Official_Submission.pptx"
            download="WeatherGPT_SIH2026_Official_Submission.pptx"
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-200 hover:bg-amber-500/25 transition-colors shadow-xs"
            title="Download Official 6-Slide PPTX (Open in Google Slides & PowerPoint)"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Official PPTX / Slides</span>
            <span className="sm:hidden">PPTX</span>
          </a>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1">
            <button
              onClick={() => setViewMode('deck')}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                viewMode === 'deck'
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
              title="Slide Deck Mode"
            >
              <Tv className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Deck</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
              title="All 6 Slides Grid View"
            >
              <Grid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">All 6 Slides</span>
            </button>
          </div>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-semibold transition-colors ${
              showNotes
                ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]'
                : 'bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]'
            }`}
            title="Toggle Presenter Pitch Notes"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Pitch Notes</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Print/Export */}
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]"
            title="Print Slide Deck"
          >
            <Printer className="h-4 w-4" />
          </button>

          {/* Direct Live App Link */}
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-bold text-[hsl(var(--primary-foreground))] hover:opacity-90"
          >
            <span>Live Prototype</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {viewMode === 'deck' ? (
        /* ------------------ DECK VIEW (1 SLIDE AT A TIME) ------------------ */
        <div className="mx-auto max-w-7xl flex flex-col items-center">
          {/* Main Slide Card matching SIH Layout */}
          <div className="relative w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl overflow-hidden transition-all min-h-[560px] lg:min-h-[620px] flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            {/* Top Bar with Team Name oval & SIH Logo */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-4 border-b border-[hsl(var(--border))] pb-3">
                {activeSlide.id > 1 ? (
                  <div className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-1 text-xs font-bold text-[hsl(var(--foreground))] shadow-xs">
                    {TEAM_NAME}
                  </div>
                ) : (
                  <span className="mono rounded bg-[hsl(var(--secondary))] px-2.5 py-1 text-[11px] font-bold tracking-wider text-[hsl(var(--primary))] uppercase">
                    {activeSlide.tag}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <span className="mono text-xs font-bold text-[hsl(var(--muted-foreground))]">
                    SLIDE {activeSlide.id} OF 6
                  </span>
                  <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.5)] px-2.5 py-1 text-[10px] font-bold text-[hsl(var(--foreground))]">
                    SIH 2026
                  </div>
                </div>
              </div>

              <div className="mb-5 text-center">
                <h2 className="display text-2xl sm:text-3xl font-black tracking-tight text-[hsl(var(--foreground))]">
                  {activeSlide.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-[hsl(var(--primary))]">
                  {activeSlide.subtitle}
                </p>
              </div>
            </div>

            {/* Slide Body Content */}
            <div className="flex-1 py-1">{activeSlide.content}</div>

            {/* Official SIH Template Bottom Banner */}
            <div className="mt-6 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 lg:-mx-10 lg:-mb-10 bg-[#0d6efd] text-white px-6 py-2.5 flex items-center justify-between text-xs">
              <span className="font-medium">@SIH Idea submission- Template</span>
              <span className="font-bold">{activeSlide.id}</span>
            </div>
          </div>

          {/* Slide Navigation Bar */}
          <div className="mt-5 w-full flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                data-testid="button-slide-prev"
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="flex items-center gap-1.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--foreground))] disabled:opacity-30 hover:bg-[hsl(var(--secondary))] transition-colors shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              <button
                data-testid="button-slide-next"
                onClick={handleNext}
                disabled={currentSlide === totalSlides - 1}
                className="flex items-center gap-1.5 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-30 hover:opacity-90 transition-opacity shadow-sm"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Slide Dots Selector */}
            <div className="flex items-center gap-2">
              {activeDeck.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(index)}
                  title={`Slide ${s.id}: ${s.title}`}
                  className={`h-2.5 rounded-full transition-all ${
                    currentSlide === index
                      ? 'w-8 bg-[#0d6efd]'
                      : 'w-2.5 bg-[hsl(var(--border))] hover:bg-[hsl(var(--muted-foreground))]'
                  }`}
                />
              ))}
            </div>

            <div className="mono text-xs text-[hsl(var(--muted-foreground))]">
              Use <kbd className="px-1.5 py-0.5 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))]">←</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))]">→</kbd> or{' '}
              <kbd className="px-1.5 py-0.5 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))]">Space</kbd>{' '}
              to present
            </div>
          </div>

          {/* Speaker / Pitch Notes Drawer */}
          {showNotes && (
            <div className="mt-5 w-full animate-rise rounded-2xl border border-[hsl(var(--accent)/.4)] bg-[hsl(var(--card))] p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-[hsl(var(--border))]">
                <div className="flex items-center gap-2 text-[hsl(var(--accent))] font-bold text-xs">
                  <BookOpen className="h-4 w-4" />
                  <span>PRESENTER PITCH NOTES (SLIDE {activeSlide.id} OF 6)</span>
                </div>
                <span className="mono text-[10px] text-[hsl(var(--muted-foreground))]">Template pointer guidance for tomorrow</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--foreground)/.9)]">
                {activeSlide.speakerNotes}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* ------------------ GRID VIEW (ALL 6 SLIDES VISIBLE FOR REVIEW) ------------------ */
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="display text-xl font-bold text-[hsl(var(--foreground))]">
                Official SIH 2026 Submission (All 6 Slides)
              </h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                Strictly adheres to maximum 6-slide limit and template pointers for portal upload
              </p>
            </div>
            <a
              href="/WeatherGPT_SIH2026_Official_Submission.pdf"
              download="WeatherGPT_SIH2026_Official_Submission.pdf"
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Official PDF</span>
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {activeDeck.map((s, index) => (
              <div
                key={s.id}
                onClick={() => {
                  setCurrentSlide(index);
                  setViewMode('deck');
                }}
                className="group cursor-pointer rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm hover:border-[#0d6efd] hover:shadow-lg transition-all flex flex-col justify-between min-h-[380px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono rounded bg-[#0d6efd]/10 px-2 py-0.5 text-[10px] font-bold text-[#0d6efd] uppercase">
                      Slide {s.id} of 6 · {s.tag}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] group-hover:text-[#0d6efd] transition-colors" />
                  </div>
                  <h4 className="display text-lg font-bold text-[hsl(var(--foreground))] group-hover:text-[#0d6efd] transition-colors">
                    {s.title}
                  </h4>
                  <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))] mb-4">{s.subtitle}</p>
                </div>

                <div className="pointer-events-none opacity-90 scale-[0.92] origin-top border-t border-[hsl(var(--border))] pt-4">
                  {s.content}
                </div>

                <div className="mt-4 pt-3 border-t border-[hsl(var(--border))] flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))]">
                  <span>Click to view in deck mode</span>
                  <span className="font-bold text-[#0d6efd]">Slide {s.id} of 6</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
