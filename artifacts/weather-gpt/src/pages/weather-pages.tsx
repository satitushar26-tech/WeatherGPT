import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BadgeInfo,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CloudRain,
  Crosshair,
  Droplets,
  ExternalLink,
  Globe,
  Mic,
  MapPin,
  Map as MapIcon,
  MessageCircle,
  MoreHorizontal,
  Mountain,
  Navigation,
  Send,
  ShieldCheck,
  Siren,
  Sprout,
  SunMedium,
  Thermometer,
  TrendingUp,
  Wind,
} from 'lucide-react';
import { useLanguage, type LanguageCode } from '@/lib/i18n';
import {
  getGetClimateTrendsQueryKey,
  getGetWeatherAlertsQueryKey,
  getGetWeatherOverviewQueryKey,
  useAskWeatherAssistant,
  useGetClimateTrends,
  useGetWeatherAlerts,
  useGetWeatherOverview,
} from '@workspace/api-client-react';
import {
  AlertPill,
  EmptyState,
  ErrorState,
  MetricCard,
  SectionHeading,
  SkeletonBlock,
  WeatherGlyph,
  formatUpdated,
} from '@/components/weather-ui';
import { InteractiveWeatherMap } from '@/components/interactive-weather-map';

type VoiceRecognitionEvent = {
  results: ArrayLike<{
    isFinal: boolean;
    [index: number]: { transcript: string };
  }>;
};

type VoiceRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: VoiceRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type VoiceRecognitionConstructor = new () => VoiceRecognition;

const fallbackOverview = {
  location: 'New Delhi',
  region: 'National Capital Region',
  updatedAt: new Date().toISOString(),
  temperature: 31,
  feelsLike: 34,
  condition: 'Partly Cloudy',
  conditionIcon: 'partly-cloudy-day',
  high: 36,
  low: 26,
  rainChance: 25,
  humidity: 62,
  wind: 14,
  pressure: 1008,
  visibility: 6.5,
  uvIndex: 7,
  metrics: [
    { label: 'Humidity', value: '62%', detail: 'Moderate tropical feel', icon: 'humidity' },
    { label: 'Wind speed', value: '14 km/h', detail: 'Gusts up to 22 km/h ENE', icon: 'wind' },
    { label: 'Barometer', value: '1008 hPa', detail: 'Steady pressure trend', icon: 'pressure' },
    { label: 'Visibility', value: '6.5 km', detail: 'Haze clearing by noon', icon: 'visibility' },
    { label: 'UV Index', value: '7 of 11', detail: 'High sun exposure index', icon: 'thermometer' },
    { label: 'Rain probability', value: '25%', detail: 'Isolated evening thunder', icon: 'humidity' },
  ],
  forecast: [
    { day: 'Today', date: '10 Sep', icon: 'partly-cloudy-day', high: 36, low: 26, rainChance: 25, rainfall: 1.2, condition: 'Partly Cloudy' },
    { day: 'Thu', date: '11 Sep', icon: 'cloudy', high: 35, low: 25, rainChance: 40, rainfall: 4.8, condition: 'Scattered Clouds' },
    { day: 'Fri', date: '12 Sep', icon: 'rain', high: 33, low: 24, rainChance: 75, rainfall: 18.5, condition: 'Moderate Rain' },
    { day: 'Sat', date: '13 Sep', icon: 'rain', high: 32, low: 24, rainChance: 85, rainfall: 28.0, condition: 'Heavy Showers' },
    { day: 'Sun', date: '14 Sep', icon: 'partly-cloudy-day', high: 34, low: 25, rainChance: 35, rainfall: 2.1, condition: 'Passing Showers' },
    { day: 'Mon', date: '15 Sep', icon: 'sunny', high: 36, low: 26, rainChance: 15, rainfall: 0.0, condition: 'Clear Skies' },
    { day: 'Tue', date: '16 Sep', icon: 'sunny', high: 37, low: 27, rainChance: 10, rainfall: 0.0, condition: 'Mainly Sunny' },
  ],
  alerts: [
    {
      id: 'alt-del-01',
      type: 'thunderstorm',
      severity: 'moderate',
      title: 'Thunderstorm & Gusty Winds Advisory',
      location: 'Delhi-NCR & Western UP',
      issued: 'Today, 06:30 IST',
      expires: 'Tonight, 22:00 IST',
      description: 'IMD Radar detects localized convective cloud build-up with gusty surface winds (30-40 km/h) and light to moderate lightning activity.',
      color: '#f29b38',
    },
    {
      id: 'alt-mum-02',
      type: 'heavy_rain',
      severity: 'high',
      title: 'Monsoon Surge Orange Alert',
      location: 'Konkan & Coastal Maharashtra',
      issued: 'Today, 08:00 IST',
      expires: 'Tomorrow, 18:00 IST',
      description: 'Intense rain bands active along coastal ghats. Fishermen advised not to venture into deep sea due to rough squally weather.',
      color: '#d94b38',
    },
  ],
  climate: {
    location: 'India Composite Analysis',
    period: '2026 Monsoon Horizon',
    rainfallChange: 4.2,
    temperatureChange: 0.8,
    points: [
      { month: 'Apr', rainfall: 22, average: 18, temperature: 34.2 },
      { month: 'May', rainfall: 45, average: 38, temperature: 37.8 },
      { month: 'Jun', rainfall: 110, average: 95, temperature: 35.1 },
      { month: 'Jul', rainfall: 245, average: 230, temperature: 31.4 },
      { month: 'Aug', rainfall: 280, average: 260, temperature: 30.2 },
      { month: 'Sep', rainfall: 165, average: 150, temperature: 31.8 },
    ],
  },
};

export function HomePage() {
  const overview = useGetWeatherOverview({ query: { queryKey: getGetWeatherOverviewQueryKey() } });
  const ask = useAskWeatherAssistant();
  const { langInfo, t } = useLanguage();
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string; highlights?: string[]; advisory?: { title: string; status: string; body: string; actions: string[] } }>>([]);

  const suggestions = [
    t('ask.sample1'),
    t('ask.sample2'),
    t('ask.sample3'),
    t('ask.sample4'),
  ];

  const submitQuestion = (question = message) => {
    const trimmed = question.trim();
    if (!trimmed || ask.isPending) return;
    setChatLog((current) => [...current, { role: 'user', text: trimmed }]);
    setMessage('');
    ask.mutate({ data: { message: trimmed, language: langInfo.name } }, {
      onSuccess: (response) => setChatLog((current) => [...current, { role: 'assistant', text: response.answer, highlights: response.highlights, advisory: response.advisory }]),
      onError: () => setChatLog((current) => [...current, { role: 'assistant', text: 'The field signal is delayed right now. Please try that question once more.' }]),
    });
  };

  const data = overview.data ?? fallbackOverview;

  return <div className="content-wrap weather-grid">
      <div className="animate-rise mb-8 flex flex-wrap items-end justify-between gap-4">
       <div>
         <div className="flex items-center gap-2 mb-2">
           <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary)/.12)] px-2.5 py-0.5 mono text-[10px] font-bold text-[hsl(var(--primary))] uppercase tracking-[.15em]">
             <span className="h-1.5 w-1.5 rounded-full bg-[#138808] animate-pulse" />
             {t('nav.mainDashboard')} · LIVE
           </span>
           <span className="text-[10px] mono text-[hsl(var(--muted-foreground))]">SIH 2026 #26068</span>
         </div>
         <h1 className="display text-[clamp(30px,4.5vw,52px)] font-bold leading-[.98] tracking-[-.065em]">Weather answers<br /><span className="text-[hsl(var(--primary))]">for everyday decisions.</span></h1>
         <p className="mt-4 max-w-lg text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">WeatherGPT brings forecasts, warnings, and decision support from public weather signals into one unified dashboard and conversational service.</p>
       </div>
       <div className="flex flex-wrap items-center justify-end gap-2">
         <div className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] px-3 py-2 text-xs text-[hsl(var(--muted-foreground))]">
           <Crosshair className="h-3.5 w-3.5 text-[hsl(var(--accent-foreground))]" /> India · {langInfo.nativeName} ({langInfo.name})
         </div>
         <Link href="/map" data-testid="link-home-map" className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] px-4 py-2.5 text-xs font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card))] transition-transform hover:-translate-y-0.5">
           <MapIcon className="h-3.5 w-3.5 text-[hsl(var(--primary))]" /> Live Map
         </Link>
         <Link href="/ask" data-testid="link-home-ask" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-semibold text-[hsl(var(--primary-foreground))] shadow-[0_10px_24px_hsl(var(--primary)/.18)] transition-transform hover:-translate-y-0.5">
           <MessageCircle className="h-3.5 w-3.5" /> Ask WeatherGPT
         </Link>
       </div>
    </div>
    {overview.isLoading && !overview.data ? <HomeSkeleton /> : <div className="space-y-7">
      <section className="animate-rise delay-1 grid gap-5 xl:grid-cols-[1.18fr_.82fr]">
        <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))] shadow-[0_20px_50px_hsl(var(--primary)/.2)] sm:p-8">
          <div className="absolute -right-8 -top-12 h-64 w-64 rounded-full border border-[hsl(var(--primary-foreground)/.08)]" /><div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[hsl(var(--primary-foreground)/.06)]" />
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-5"><div><div className="flex items-center gap-2 text-sm text-[hsl(var(--primary-foreground)/.7)]"><MapPin className="h-4 w-4 text-[hsl(var(--accent))]" />{data.location}, {data.region}</div><p className="mono mt-2 text-[10px] uppercase tracking-[.14em] text-[hsl(var(--primary-foreground)/.48)]">{formatUpdated(data.updatedAt)}</p></div><div className="rounded-full border border-[hsl(var(--primary-foreground)/.18)] px-3 py-1 text-[10px] uppercase tracking-[.12em] text-[hsl(var(--primary-foreground)/.65)]">At a glance</div></div>
          <div className="relative z-10 mt-10 flex flex-wrap items-end justify-between gap-8"><div className="flex items-center gap-5"><WeatherGlyph condition={data.condition} size="lg" /><div><div className="display text-[clamp(52px,7vw,80px)] font-medium leading-none tracking-[-.09em]">{Math.round(data.temperature)}°</div><p className="mt-2 text-sm text-[hsl(var(--primary-foreground)/.68)]">Feels like {Math.round(data.feelsLike)}° · {data.condition}</p></div></div><div className="grid min-w-[190px] grid-cols-2 gap-x-8 gap-y-4 border-l border-[hsl(var(--primary-foreground)/.17)] pl-6 text-sm"><div><span className="block text-[11px] text-[hsl(var(--primary-foreground)/.48)]">{t('metric.high')} / {t('metric.low')}</span><span className="mt-1 flex items-center gap-1.5 font-semibold"><ArrowUp className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />{Math.round(data.high)}° <span className="text-[hsl(var(--primary-foreground)/.4)]">/</span> <ArrowDown className="h-3.5 w-3.5 text-[#9fc1d0]" />{Math.round(data.low)}°</span></div><div><span className="block text-[11px] text-[hsl(var(--primary-foreground)/.48)]">{t('metric.rainChance')}</span><span className="mt-1 block font-semibold">{data.rainChance}%</span></div></div></div>
        </div>
        <div className="card-surface rounded-2xl p-6"><div className="flex items-start justify-between"><div><p className="mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Today’s read</p><h2 className="display mt-2 text-2xl font-bold tracking-[-.05em]">Conditions are <span className="text-[hsl(var(--primary))]">steady.</span></h2></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><SunMedium className="h-5 w-5" /></div></div><p className="mt-5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">A warm start with a watchful eye on afternoon moisture. Outdoor work is most comfortable before 11:00 and after 16:00.</p><div className="mt-6 border-t border-[hsl(var(--border))] pt-5"><div className="flex items-center justify-between text-xs"><span className="text-[hsl(var(--muted-foreground))]">{t('metric.confidence')}</span><span className="font-semibold text-[hsl(var(--primary))]">High</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--muted))]"><div className="h-full w-[78%] rounded-full bg-[hsl(var(--accent))]" /></div><div className="mt-3 flex items-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))]"><ShieldCheck className="h-3.5 w-3.5 text-[#5c9270]" /> Based on 4 live signals</div></div></div>
      </section>

      {/* Embedded WeatherGPT Conversational Intelligence on Main Dashboard */}
      <section className="animate-rise delay-2">
        <AssistantCard
          message={message}
          setMessage={setMessage}
          suggestions={suggestions}
          chatLog={chatLog}
          isPending={ask.isPending}
          onSubmit={submitQuestion}
        />
      </section>

      <section className="animate-rise delay-2"><div className="mb-3 flex items-center justify-between"><p className="mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--muted-foreground))]">Atmosphere now</p><span className="text-[11px] text-[hsl(var(--muted-foreground))]">Local observation · {formatUpdated(data.updatedAt)}</span></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{data.metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</div></section>
      <section className="animate-rise delay-3"><SectionHeading eyebrow="Next seven days" title="Plan around the pattern." detail="A glanceable forecast, with rainfall kept in millimetres so plans stay grounded." action={<Link href="/climate" data-testid="link-view-climate" className="hidden items-center gap-1 text-xs font-semibold text-[hsl(var(--primary))] sm:flex">See climate lens <ArrowUpRight className="h-3.5 w-3.5" /></Link>} /><div className="card-surface overflow-x-auto rounded-2xl"><div className="grid min-w-[720px] grid-cols-7 divide-x divide-[hsl(var(--border))]">{data.forecast.map((day, index) => <div key={`${day.date}-${index}`} className={`group p-4 transition-colors hover:bg-[hsl(var(--secondary)/.42)] ${index === 0 ? 'bg-[hsl(var(--secondary)/.32)]' : ''}`}><p className="text-xs font-semibold">{day.day}</p><p className="mono mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{day.date}</p><div className="my-5"><WeatherGlyph condition={day.condition} /></div><p className="text-xs text-[hsl(var(--muted-foreground))]">{day.condition}</p><div className="mt-4 flex items-center justify-between text-xs"><span className="font-bold">{Math.round(day.high)}°</span><span className="text-[hsl(var(--muted-foreground))]">{Math.round(day.low)}°</span></div><div className="mt-3 flex items-center gap-1 text-[10px] text-[hsl(var(--primary))]"><CloudRain className="h-3 w-3" />{day.rainChance}%</div></div>)}</div></div></section>
      <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]"><div className="card-surface rounded-2xl p-6"><SectionHeading eyebrow="Active watch" title={`${data.alerts.length || 'No'} alerts nearby`} detail="Prioritised by urgency and impact to your area." action={<Link href="/alerts" data-testid="link-open-alerts" className="text-xs font-semibold text-[hsl(var(--primary))]">Open center</Link>} />{data.alerts.length ? <div className="space-y-3">{data.alerts.slice(0, 3).map((alert) => <AlertRow key={alert.id} alert={alert} />)}</div> : <EmptyState title="Quiet skies for now" detail="No active warnings are mapped to this region." icon={ShieldCheck} />}</div><div className="rounded-2xl border border-[hsl(var(--primary)/.18)] bg-[hsl(var(--secondary)/.46)] p-6"><p className="mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Public service note</p><h2 className="display mt-3 text-xl font-bold tracking-[-.04em]">Use official warnings first.</h2><p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">WeatherGPT helps explain conditions and prepare next steps. In an emergency, follow instructions from district authorities and IMD bulletins.</p><Link href="/alerts" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--primary))]">Read active warnings <ArrowUpRight className="h-3.5 w-3.5" /></Link></div></section>
    </div>}
  </div>;
}

export function AskPage() {
  const ask = useAskWeatherAssistant();
  const { langInfo, t } = useLanguage();
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string; highlights?: string[]; advisory?: { title: string; status: string; body: string; actions: string[] } }>>([]);

  const suggestions = [
    t('ask.sample1'),
    t('ask.sample2'),
    t('ask.sample3'),
    t('ask.sample4'),
  ];

  const submitQuestion = (question = message) => {
    const trimmed = question.trim();
    if (!trimmed || ask.isPending) return;
    setChatLog((current) => [...current, { role: 'user', text: trimmed }]);
    setMessage('');
    ask.mutate({ data: { message: trimmed, language: langInfo.name } }, {
      onSuccess: (response) => setChatLog((current) => [...current, { role: 'assistant', text: response.answer, highlights: response.highlights, advisory: response.advisory }]),
      onError: () => setChatLog((current) => [...current, { role: 'assistant', text: 'The field signal is delayed right now. Please try that question once more.' }]),
    });
  };

  return <div className="ask-page weather-grid">
    <div className="ask-page-bar">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><MessageCircle className="h-4 w-4" /></div>
        <div><p className="display text-sm font-bold tracking-[-.02em]">{t('ask.title')}</p><p className="mono text-[9px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">{t('ask.subtitle')}</p></div>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))]"><span className="h-1.5 w-1.5 rounded-full bg-[#75ae81]" /> {t('ask.onlineBadge')}</div>
    </div>
    <section id="assistant" className="ask-chat-region animate-rise delay-1">
      <ChatAssistant message={message} setMessage={setMessage} suggestions={suggestions} chatLog={chatLog} isPending={ask.isPending} onSubmit={submitQuestion} />
    </section>
  </div>;
}

function ChatAssistant({ message, setMessage, suggestions, chatLog, isPending, onSubmit }: { message: string; setMessage: (value: string) => void; suggestions: string[]; chatLog: Array<{ role: 'user' | 'assistant'; text: string; highlights?: string[]; advisory?: { title: string; status: string; body: string; actions: string[] } }>; isPending: boolean; onSubmit: (question?: string) => void }) {
  const { language, setLanguage, langInfo, t, supportedLanguages } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');
  const recognitionRef = useRef<VoiceRecognition | null>(null);

  useEffect(() => () => {
    recognitionRef.current?.stop();
  }, []);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const voiceWindow = window as Window & {
      SpeechRecognition?: VoiceRecognitionConstructor;
      webkitSpeechRecognition?: VoiceRecognitionConstructor;
    };
    const SpeechRecognition = voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceNotice(t('ask.voiceUnavailable'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langInfo.speechLang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const result = event.results[0];
      const transcript = result?.[0]?.transcript ?? '';
      if (transcript) setMessage(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setVoiceNotice(t('ask.voiceError'));
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    setVoiceNotice('');
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      recognitionRef.current = null;
      setVoiceNotice(t('ask.voiceError'));
    }
  };

  return <div className="ask-chat-frame">
    <div className="ask-chat-scroll scrollbar-thin">
      {chatLog.length === 0 ? <div className="ask-empty-state">
        <div className="ask-empty-mark"><SparkIcon /></div>
        <h1 className="display mt-6 text-[clamp(28px,4vw,44px)] font-bold tracking-[-.06em]">{t('ask.heroTitle')}</h1>
        <p className="mt-3 max-w-lg text-center text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{t('ask.heroSubtitle')}</p>
        <div className="mt-9 flex max-w-3xl flex-wrap justify-center gap-3">{suggestions.map((item) => <button type="button" key={item} data-testid={`button-suggestion-${item.slice(0, 8).replaceAll(' ', '-').toLowerCase()}`} onClick={() => onSubmit(item)} className="ask-suggestion">{item}<ArrowUpRight className="h-3.5 w-3.5 opacity-60" /></button>)}</div>
      </div> : <div className="ask-messages">{chatLog.map((item, index) => <div key={`${item.role}-${index}`} className={`ask-message ${item.role === 'user' ? 'ask-message-user' : 'ask-message-assistant'}`}><div className="ask-message-label">{item.role === 'user' ? t('ask.you') : t('ask.assistant')}</div><p>{item.text}</p>{item.highlights && <div className="mt-3 space-y-1.5">{item.highlights.map((highlight) => <div key={highlight} className="flex gap-2 text-xs text-[hsl(var(--muted-foreground))]"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[hsl(var(--accent-foreground))]" />{highlight}</div>)}</div>}{item.advisory && <div className="mt-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)] p-3 text-xs"><div className="flex items-center justify-between font-semibold"><span>{item.advisory.title}</span><span className="text-[hsl(var(--accent-foreground))]">{item.advisory.status}</span></div><p className="mt-1.5 text-[hsl(var(--muted-foreground))]">{item.advisory.body}</p></div>}</div>)}{isPending && <div className="ask-message ask-message-assistant"><div className="ask-message-label">{t('ask.assistant')}</div><div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--accent-foreground))]" /> {t('ask.readingSignals')}</div></div>}</div>}
    </div>
    <div className="ask-composer-dock">
       {isListening && <div className="voice-listening-panel" role="status" aria-live="polite">
         <div className="voice-listening-copy">
           <span className="voice-pulse"><Mic className="h-3.5 w-3.5" /></span>
           <span><strong>{t('ask.listeningIn')} {langInfo.nativeName} ({langInfo.name})</strong><small>{message || 'Speak your weather question…'}</small></span>
         </div>
         <div className="voice-bars" aria-hidden="true"><span /><span /><span /><span /><span /></div>
         <span className="voice-stop-hint">{t('ask.tapMicToStop')}</span>
       </div>}
       <div className={`ask-composer ${isListening ? 'is-listening' : ''}`}>
         <input aria-label="Weather question" data-testid="input-weather-question" value={message} onChange={(event) => { setMessage(event.target.value); setVoiceNotice(''); }} onKeyDown={(event) => { if (event.key === 'Enter') onSubmit(); }} placeholder={isListening ? `${t('ask.listeningIn')}…` : t('ask.placeholder')} />
        <div className="flex items-center gap-1 border-l border-[hsl(var(--border))] pl-2 pr-1">
          <Globe className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
          <select aria-label="Response language" data-testid="select-language" value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)} className="bg-transparent text-xs font-medium text-[hsl(var(--foreground))] outline-none cursor-pointer">
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>
         <button type="button" data-testid="button-voice-question" title={isListening ? t('ask.tapMicToStop') : `Voice input (${langInfo.nativeName})`} aria-label={isListening ? t('ask.tapMicToStop') : 'Use voice input'} aria-pressed={isListening} onClick={toggleVoiceInput} className={`ask-icon-button ${isListening ? 'is-listening' : ''}`}><Mic className="h-4 w-4" /></button>
        <button type="button" data-testid="button-submit-question" title={message.trim() ? 'Ask WeatherGPT' : 'Type a question first'} aria-label={message.trim() ? 'Ask WeatherGPT' : 'Type a question first'} onClick={() => onSubmit()} disabled={!message.trim() || isPending} className="ask-send-button"><Send className="h-4 w-4" /></button>
      </div>
       {voiceNotice && <p className="voice-notice" role="status">{voiceNotice}</p>}
      <p className="mt-2 text-center text-[10px] text-[hsl(var(--muted-foreground))]">{t('ask.disclaimer')}</p>
    </div>
  </div>;
}

function AssistantCard({ message, setMessage, suggestions, chatLog, isPending, onSubmit }: { message: string; setMessage: (value: string) => void; suggestions: string[]; chatLog: Array<{ role: 'user' | 'assistant'; text: string; highlights?: string[]; advisory?: { title: string; status: string; body: string; actions: string[] } }>; isPending: boolean; onSubmit: (question?: string) => void }) {
  const { language, setLanguage, langInfo, t, supportedLanguages } = useLanguage();
  return <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--foreground))] p-6 text-[hsl(var(--background))] shadow-[0_18px_50px_hsl(var(--foreground)/.18)] sm:p-8"><div className="absolute left-0 right-0 top-0 flex h-1"><span className="flex-1 bg-[#f29b38]" /><span className="flex-1 bg-[#f7f5ef]" /><span className="flex-1 bg-[#138808]" /></div><div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border border-[hsl(var(--background)/.08)]" /><div className="relative z-10"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[hsl(var(--accent))]"><MessageCircle className="h-4 w-4" /><span className="mono text-[10px] uppercase tracking-[.17em]">{t('ask.title')} · {langInfo.nativeName}</span></div><h2 className="display mt-2 text-[clamp(25px,3vw,36px)] font-bold tracking-[-.05em]">Your weather desk,<br />in plain language.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-[hsl(var(--background)/.64)]">{t('ask.heroSubtitle')}</p></div><div className="grid h-12 w-12 place-items-center rounded-xl bg-[hsl(var(--background)/.1)]"><SparkIcon /></div></div><div className="mt-6 space-y-3">{chatLog.length === 0 && <div className="rounded-xl border border-[hsl(var(--background)/.12)] bg-[hsl(var(--background)/.05)] p-4"><p className="mono text-[9px] uppercase tracking-[.14em] text-[hsl(var(--accent))]">Try a public-service question</p><p className="mt-2 text-sm text-[hsl(var(--background)/.7)]">“{suggestions[0] || 'Will it rain tomorrow in Delhi?'}”</p></div>}{chatLog.slice(-4).map((item, index) => <div key={`${item.role}-${index}`} className={`rounded-xl p-3 text-sm leading-relaxed ${item.role === 'user' ? 'ml-8 bg-[hsl(var(--background)/.1)] text-[hsl(var(--background)/.83)]' : 'mr-3 bg-[hsl(var(--accent)/.16)] text-[hsl(var(--background)/.85)]'}`}><span className="mono mb-1 block text-[9px] uppercase tracking-[.14em] text-[hsl(var(--background)/.45)]">{item.role === 'user' ? t('ask.you') : t('ask.assistant')}</span>{item.text}{item.highlights && <div className="mt-3 space-y-1.5">{item.highlights.map((highlight) => <div key={highlight} className="flex gap-2 text-xs text-[hsl(var(--background)/.68)]"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[hsl(var(--accent))]" />{highlight}</div>)}</div>}{item.advisory && <div className="mt-3 rounded-lg border border-[hsl(var(--background)/.12)] p-3"><div className="flex items-center justify-between text-xs font-semibold"><span>{item.advisory.title}</span><span className="text-[hsl(var(--accent))]">{item.advisory.status}</span></div><p className="mt-1.5 text-xs text-[hsl(var(--background)/.62)]">{item.advisory.body}</p></div>}</div>)}{isPending && <div className="flex items-center gap-2 text-xs text-[hsl(var(--background)/.58)]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--accent))]" /> {t('ask.readingSignals')}</div>}</div><div className="mt-5 flex items-center gap-2 rounded-xl border border-[hsl(var(--background)/.16)] bg-[hsl(var(--background)/.07)] p-2 focus-within:border-[hsl(var(--accent)/.65)]"><input aria-label="Weather question" data-testid="input-weather-question" value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') onSubmit(); }} placeholder={t('ask.placeholder')} className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[hsl(var(--background))] outline-none placeholder:text-[hsl(var(--background)/.42)]" /><select aria-label="Response language" data-testid="select-language" value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)} className="hidden bg-transparent text-[11px] text-[hsl(var(--background)/.6)] outline-none sm:block">{supportedLanguages.map((l) => <option key={l.code} value={l.code} className="bg-neutral-800 text-white">{l.nativeName}</option>)}</select><button data-testid="button-voice-question" title="Voice input" aria-label="Use voice input" onClick={() => { const speech = (window as typeof window & { webkitSpeechRecognition?: new () => { lang: string; start: () => void; onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void } }).webkitSpeechRecognition; if (!speech) { window.alert(t('ask.voiceUnavailable')); return; } const recognition = new speech(); recognition.lang = langInfo.speechLang; recognition.onresult = (event) => setMessage(event.results[0][0].transcript); recognition.start(); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[hsl(var(--background)/.16)] text-[hsl(var(--background)/.62)] transition-colors hover:border-[hsl(var(--accent)/.7)] hover:text-[hsl(var(--accent))]"><Mic className="h-4 w-4" /></button><button type="button" data-testid="button-submit-question" title={message.trim() ? 'Ask WeatherGPT' : 'Type a question first'} aria-label={message.trim() ? 'Ask WeatherGPT' : 'Type a question first'} onClick={() => onSubmit()} disabled={!message.trim() || isPending} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button></div>{!message.trim() && <p className="mt-2 text-[10px] text-[hsl(var(--background)/.48)]">Type a question above, then press Enter or the arrow button to ask.</p>}<div className="mt-3 flex flex-wrap gap-2">{suggestions.map((item) => <button type="button" key={item} data-testid={`button-suggestion-${item.slice(0, 8).replaceAll(' ', '-').toLowerCase()}`} onClick={() => onSubmit(item)} className="rounded-full border border-[hsl(var(--background)/.12)] px-2.5 py-1.5 text-[10px] text-[hsl(var(--background)/.58)] transition-colors hover:border-[hsl(var(--accent)/.7)] hover:text-[hsl(var(--accent))]">{item}</button>)}</div></div></div>;
}

function SparkIcon() { return <span className="relative block h-5 w-5"><span className="absolute left-2 top-0 h-5 w-1 rounded-full bg-[hsl(var(--accent))]" /><span className="absolute left-0 top-2 h-1 w-5 rounded-full bg-[hsl(var(--accent))]" /><span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[hsl(var(--accent))]" /></span>; }

function AlertRow({ alert }: { alert: { id: string; type: string; severity: string; title: string; location: string; issued: string; expires: string; description: string; color: string } }) {
  return <div className="group rounded-xl border border-[hsl(var(--border))] p-3.5 transition-colors hover:bg-[hsl(var(--secondary)/.35)]"><div className="flex items-start gap-3"><div className="mt-0.5 h-9 w-1 rounded-full" style={{ backgroundColor: alert.color || '#e0a23a' }} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><AlertPill severity={alert.severity} /><span className="text-[10px] text-[hsl(var(--muted-foreground))]">{alert.type}</span></div><h3 className="mt-2 text-sm font-semibold">{alert.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{alert.description}</p><div className="mt-2 flex items-center gap-3 text-[10px] text-[hsl(var(--muted-foreground))]"><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{alert.location}</span><span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />Expires {alert.expires}</span></div></div><ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))] transition-transform group-hover:translate-x-0.5" /></div></div>;
}

function HomeSkeleton() {
  return <div className="space-y-7"><div className="grid gap-5 xl:grid-cols-[1.18fr_.82fr]"><SkeletonBlock className="h-[320px]" /><SkeletonBlock className="h-[320px]" /></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonBlock key={i} className="h-28" />)}</div><SkeletonBlock className="h-48" /></div>;
}

export function AlertsPage() {
  const query = useGetWeatherAlerts({ query: { queryKey: getGetWeatherAlertsQueryKey() } });
  const [filter, setFilter] = useState('All');
  const alerts = query.data ?? [];
  const filtered = filter === 'All' ? alerts : alerts.filter((alert) => alert.severity.toLowerCase().includes(filter.toLowerCase()));
  return <div className="content-wrap weather-grid"><div className="animate-rise flex flex-wrap items-end justify-between gap-5"><div><p className="mono mb-2 text-[10px] uppercase tracking-[.2em] text-[hsl(var(--destructive))]">Signal priority / active now</p><h1 className="display text-[clamp(32px,4vw,50px)] font-bold leading-none tracking-[-.065em]">Alert center</h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">One place to see warnings that affect movement, harvest, safety, and response across your watch areas.</p></div><div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs"><span className="h-2 w-2 rounded-full bg-[hsl(var(--destructive))]" /> {alerts.length} active signals</div></div>{query.isLoading ? <div className="mt-8 space-y-3">{Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-28" />)}</div> : query.isError ? <div className="mt-8"><ErrorState onRetry={() => query.refetch()} /></div> : <div className="mt-9 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]"><div><div className="mb-4 flex flex-wrap gap-2">{['All', 'High', 'Moderate'].map((item) => <button key={item} data-testid={`button-filter-alerts-${item.toLowerCase()}`} onClick={() => setFilter(item)} className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${filter === item ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}>{item}{item !== 'All' && <span className="ml-1.5 opacity-60">{alerts.filter((alert) => alert.severity.toLowerCase().includes(item.toLowerCase())).length}</span>}</button>)}</div>{filtered.length ? <div className="space-y-3">{filtered.map((alert) => <AlertRow key={alert.id} alert={alert} />)}</div> : <EmptyState title="No alerts in this band" detail="The sky is quiet for this filter. Keep the center open for live updates." icon={CheckCircle2} />}</div><div className="space-y-4"><div className="card-surface rounded-2xl p-5"><p className="mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">How to read this</p><div className="mt-5 space-y-4"><LegendDot color="#b94836" title="High impact" text="Act now or check local authority guidance." /><LegendDot color="#d99b35" title="Moderate" text="Adjust timing and keep a close watch." /><LegendDot color="#5a9872" title="Information" text="Useful context for planning ahead." /></div></div><div className="rounded-2xl bg-[hsl(var(--primary))] p-5 text-[hsl(var(--primary-foreground))]"><Siren className="h-5 w-5 text-[hsl(var(--accent))]" /><h3 className="display mt-4 text-lg font-semibold">In an emergency</h3><p className="mt-2 text-xs leading-relaxed text-[hsl(var(--primary-foreground)/.65)]">Always follow official local authority instructions first. WeatherGPT is a decision aid, not an emergency service.</p><button data-testid="button-view-guidance" onClick={() => window.alert('Emergency guidance: follow district authority instructions and move to a safe area.')} className="mt-4 flex items-center gap-2 text-xs font-semibold text-[hsl(var(--accent))]">View response guidance <ExternalLink className="h-3 w-3" /></button></div></div></div>}</div>;
}

function LegendDot({ color, title, text }: { color: string; title: string; text: string }) { return <div className="flex gap-3"><span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} /><div><p className="text-xs font-semibold">{title}</p><p className="mt-1 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">{text}</p></div></div>; }

const mapCoordinates = [
  { left: '52%', top: '36%' },
  { left: '45%', top: '48%' },
  { left: '61%', top: '52%' },
  { left: '39%', top: '59%' },
  { left: '67%', top: '40%' },
  { left: '55%', top: '67%' },
  { left: '73%', top: '58%' },
  { left: '31%', top: '43%' },
];

function mapPointFor(alert: { location: string }, index: number) {
  const location = alert.location.toLowerCase();
  const knownPoints: Record<string, { left: string; top: string }> = {
    delhi: { left: '56%', top: '32%' },
    mumbai: { left: '38%', top: '59%' },
    pune: { left: '43%', top: '61%' },
    bengaluru: { left: '50%', top: '78%' },
    bangalore: { left: '50%', top: '78%' },
    kolkata: { left: '77%', top: '50%' },
    chennai: { left: '66%', top: '80%' },
    hyderabad: { left: '58%', top: '65%' },
    jaipur: { left: '46%', top: '36%' },
    assam: { left: '85%', top: '43%' },
  };
  const match = Object.entries(knownPoints).find(([name]) => location.includes(name));
  return match?.[1] ?? mapCoordinates[index % mapCoordinates.length];
}

function severityMatch(severity: string, filter: string) {
  if (filter === 'All') return true;
  const normalized = severity.toLowerCase();
  if (filter === 'High') return normalized.includes('high') || normalized.includes('severe') || normalized.includes('watch');
  if (filter === 'Moderate') return normalized.includes('moderate') || normalized.includes('advisory');
  return normalized.includes(filter.toLowerCase());
}

function markerColorFor(alert: { color?: string; severity: string }) {
  const colors: Record<string, string> = {
    amber: '#d99b35',
    orange: '#df7639',
    rose: '#b94836',
    red: '#b94836',
    green: '#5a9872',
  };
  const severity = alert.severity.toLowerCase();
  return colors[alert.color?.toLowerCase() ?? ''] ?? (severity.includes('high') || severity.includes('severe') || severity.includes('watch') ? '#b94836' : '#d99b35');
}

export function MapPage() {
  const query = useGetWeatherAlerts({ query: { queryKey: getGetWeatherAlertsQueryKey() } });
  const alerts = query.data ?? [];
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filtered = useMemo(() => alerts.filter((alert) => severityMatch(alert.severity, filter)), [alerts, filter]);
  const selected = filtered.find((alert) => alert.id === selectedId) ?? filtered[0];

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
    if (!selected) setSelectedId(null);
  }, [selected, selectedId]);

  return <div className="content-wrap weather-grid map-page">
    <div className="animate-rise flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="mono mb-2 text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Spatial watch / public signals</p>
        <h1 className="display text-[clamp(32px,4vw,50px)] font-bold leading-none tracking-[-.065em]">Signal map</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">A calmer view of active weather alerts across India. Select a marker to understand what the signal could mean for the ground.</p>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs">
        <span className="h-2 w-2 rounded-full bg-[#75ae81]" /> {alerts.length} active signals
      </div>
    </div>

    {query.isLoading ? <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><SkeletonBlock className="h-[520px]" /><SkeletonBlock className="h-[520px]" /></div> : query.isError ? <div className="mt-8"><ErrorState onRetry={() => query.refetch()} /></div> : <div className="mt-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" aria-label="Filter alerts by severity">
          {['All', 'High', 'Moderate', 'Information'].map((item) => <button key={item} type="button" data-testid={`button-map-filter-${item.toLowerCase()}`} onClick={() => setFilter(item)} className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${filter === item ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}>{item}<span className="ml-1.5 opacity-60">{item === 'All' ? alerts.length : alerts.filter((alert) => severityMatch(alert.severity, item)).length}</span></button>)}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))]"><MapIcon className="h-3.5 w-3.5 text-[hsl(var(--primary))]" /> Approximate signal locations · updated with alert feed</div>
      </div>

      {filtered.length ? <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
        <section className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[#dce9e4] shadow-[var(--shadow-soft)] min-h-[440px] sm:min-h-[560px]" aria-label="Interactive India weather & alert map">
          <InteractiveWeatherMap
            alerts={filtered}
            selectedId={selectedId}
            onSelectAlert={(id) => setSelectedId(id)}
          />
        </section>

        <aside className="space-y-5">
          {selected ? <section className="card-surface animate-rise rounded-2xl p-5 sm:p-6" aria-live="polite">
            <div className="flex items-start justify-between gap-3"><div><p className="mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Selected signal</p><div className="mt-3"><AlertPill severity={selected.severity} /></div></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><MapPin className="h-4 w-4" /></span></div>
            <h2 className="display mt-5 text-[23px] font-bold leading-tight tracking-[-.045em]">{selected.title}</h2>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"><MapPin className="h-3.5 w-3.5" /> {selected.location} <span className="opacity-40">·</span> {selected.type}</p>
            <p className="mt-5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{selected.description}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 border-y border-[hsl(var(--border))] py-4 text-xs"><div><span className="block text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Issued</span><span className="mt-1.5 block font-semibold">{selected.issued}</span></div><div><span className="block text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Expires</span><span className="mt-1.5 block font-semibold">{selected.expires}</span></div></div>
            <div className="mt-5 rounded-xl bg-[hsl(var(--secondary)/.58)] p-4"><p className="text-xs font-semibold">What to do with this</p><p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Use this signal to adjust timing and check the latest district guidance before acting.</p></div>
            <Link href="/alerts" data-testid="link-map-alert-center" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--primary))]">Open full alert record <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </section> : <EmptyState title="No signals in this band" detail="Try another severity filter to bring alerts back onto the map." icon={MapIcon} />}
          <section className="rounded-2xl bg-[hsl(var(--primary))] p-5 text-[hsl(var(--primary-foreground))]"><div className="flex items-center justify-between"><p className="mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--accent))]">Reading the map</p><Crosshair className="h-4 w-4 text-[hsl(var(--accent))]" /></div><p className="mt-3 text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.72)]">Markers show where the alert feed is pointing, not a precise boundary. Confirm local instructions before travel, outdoor work, or response.</p></section>
        </aside>
      </div> : <EmptyState title="No signals in this band" detail="Try another severity filter to bring alerts back onto the map." icon={MapIcon} />}
    </div>}
  </div>;
}

export function ClimatePage() {
  const query = useGetClimateTrends({ query: { queryKey: getGetClimateTrendsQueryKey() } });
  const trends = query.data;
  const [range, setRange] = useState('12 months');
  const points = useMemo(() => trends?.points ?? [], [trends?.points]);
  return <div className="content-wrap weather-grid"><div className="animate-rise flex flex-wrap items-end justify-between gap-5"><div><p className="mono mb-2 text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Pattern memory / {trends?.location ?? 'India'}</p><h1 className="display text-[clamp(32px,4vw,50px)] font-bold leading-none tracking-[-.065em]">Climate lens</h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">See the longer rhythm behind today’s weather — useful for crop planning, infrastructure, and resilient operations.</p></div><div className="flex rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1">{['12 months', '5 years'].map((item) => <button key={item} data-testid={`button-climate-range-${item.split(' ')[0]}`} onClick={() => setRange(item)} className={`rounded-md px-3 py-1.5 text-xs ${range === item ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{item}</button>)}</div></div>{query.isLoading ? <div className="mt-9 grid gap-5 lg:grid-cols-[1.4fr_.6fr]"><SkeletonBlock className="h-[410px]" /><SkeletonBlock className="h-[410px]" /></div> : query.isError || !trends ? <div className="mt-8"><ErrorState onRetry={() => query.refetch()} /></div> : <div className="mt-9 space-y-7"><div className="grid gap-5 md:grid-cols-2"><TrendStat icon={TrendingUp} label="Rainfall shift" value={`${trends.rainfallChange > 0 ? '+' : ''}${trends.rainfallChange}%`} detail="versus the long-term average" positive={trends.rainfallChange >= 0} /><TrendStat icon={Thermometer} label="Temperature shift" value={`${trends.temperatureChange > 0 ? '+' : ''}${trends.temperatureChange}°`} detail="average surface temperature" positive={false} /></div><section className="card-surface rounded-2xl p-5 sm:p-7"><SectionHeading eyebrow={`${range} view · millimetres`} title="Rain arrives in pulses." detail="Monthly rainfall compared with the historical baseline." action={<button data-testid="button-chart-options" onClick={() => window.alert('Chart options are coming to your workspace soon.')} className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"><MoreHorizontal className="h-5 w-5" /></button>} /><div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={points} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f6472" stopOpacity=".28" /><stop offset="100%" stopColor="#1f6472" stopOpacity=".02" /></linearGradient></defs><CartesianGrid vertical={false} stroke="#dbe0d8" strokeDasharray="3 4" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#738188' }} /><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#738188' }} /><Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #d8ddd5', background: '#fbfaf5', fontSize: 12 }} /><Area type="monotone" dataKey="average" stroke="#aebbb6" strokeDasharray="5 5" fill="none" strokeWidth={2} name="Baseline" /><Area type="monotone" dataKey="rainfall" stroke="#1f6472" fill="url(#rainFill)" strokeWidth={2.5} name="Observed" /></AreaChart></ResponsiveContainer></div><div className="mt-4 flex flex-wrap items-center gap-5 text-[11px] text-[hsl(var(--muted-foreground))]"><span className="flex items-center gap-2"><span className="h-2 w-5 rounded-full bg-[hsl(var(--primary))]" /> Observed rainfall</span><span className="flex items-center gap-2"><span className="w-5 border-t border-dashed border-[#aebbb6]" /> Historical baseline</span></div></section><section className="card-surface rounded-2xl p-5 sm:p-7"><SectionHeading eyebrow="Temperature arc" title="Heat is changing the timetable." detail="Average temperature through the same period." /><div className="h-[250px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={points} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}><CartesianGrid vertical={false} stroke="#dbe0d8" strokeDasharray="3 4" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#738188' }} /><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#738188' }} /><Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #d8ddd5', background: '#fbfaf5', fontSize: 12 }} /><Line type="monotone" dataKey="temperature" stroke="#df8a39" strokeWidth={2.5} dot={{ fill: '#df8a39', r: 3, strokeWidth: 0 }} name="Temperature" /></LineChart></ResponsiveContainer></div></section></div>}</div>;
}

function TrendStat({ icon: Icon, label, value, detail, positive }: { icon: typeof TrendingUp; label: string; value: string; detail: string; positive: boolean }) { return <div className="card-surface flex items-center gap-4 rounded-2xl p-5"><div className={`grid h-11 w-11 place-items-center rounded-xl ${positive ? 'bg-[#dcebdc] text-[#4d8562]' : 'bg-[#f8e2d3] text-[#aa5738]'}`}><Icon className="h-5 w-5" /></div><div><p className="text-xs text-[hsl(var(--muted-foreground))]">{label}</p><p className="display mt-0.5 text-2xl font-bold tracking-[-.04em]">{value}</p><p className="mt-0.5 text-[11px] text-[hsl(var(--muted-foreground))]">{detail}</p></div></div>; }

export function AdvisoryPage() {
  const overview = useGetWeatherOverview({ query: { queryKey: getGetWeatherOverviewQueryKey() } });
  const ask = useAskWeatherAssistant();
  const [active, setActive] = useState('farm');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<{ answer: string; highlights?: string[]; advisory?: { title: string; status: string; body: string; actions: string[] } } | null>(null);
  const data = overview.data;
  const cards = [{ id: 'farm', title: 'Farm window', icon: Sprout, body: 'Timing for sowing, spraying, irrigation, and harvest.', prompt: 'Give me a practical farm advisory for the next 48 hours.' }, { id: 'travel', title: 'Travel brief', icon: Navigation, body: 'Road and visibility context for the next journey.', prompt: 'Is it safe to travel today? Give me a concise travel brief.' }, { id: 'response', title: 'Response plan', icon: Siren, body: 'A calm checklist when a warning becomes active.', prompt: 'What should a local coordinator prepare for the current alerts?' }];
  const askAdvisory = (prompt: string) => { setQuestion(prompt); ask.mutate({ data: { message: prompt, language: 'English' } }, { onSuccess: (result) => setAnswer(result), onError: () => setAnswer({ answer: 'The advisory signal is delayed. Please retry shortly.' }) }); };
  return <div className="content-wrap weather-grid"><div className="animate-rise"><p className="mono mb-2 text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent-foreground)/.72)]">Action layer / grounded in today</p><h1 className="display text-[clamp(32px,4vw,50px)] font-bold leading-none tracking-[-.065em]">Field advisory</h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Weather is only useful when it changes a decision. Choose a lens and get guidance written for the work in front of you.</p></div>{overview.isLoading ? <div className="mt-9 grid gap-4 md:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-48" />)}</div> : overview.isError ? <div className="mt-8"><ErrorState onRetry={() => overview.refetch()} /></div> : <div className="mt-9 space-y-7"><div className="grid gap-4 md:grid-cols-3">{cards.map((card) => { const Icon = card.icon; return <button key={card.id} data-testid={`button-advisory-${card.id}`} onClick={() => { setActive(card.id); askAdvisory(card.prompt); }} className={`group text-left ${active === card.id ? 'border-[hsl(var(--primary))] bg-[hsl(var(--secondary)/.58)]' : 'card-surface'} rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]`}><div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"><Icon className="h-5 w-5" /></div><ArrowUpRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><h2 className="display mt-7 text-lg font-bold tracking-[-.03em]">{card.title}</h2><p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{card.body}</p></button>; })}</div><div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><div className="card-surface rounded-2xl p-6"><div className="flex items-center gap-2 text-[hsl(var(--primary))]"><BadgeInfo className="h-4 w-4" /><span className="mono text-[10px] uppercase tracking-[.16em]">Current context</span></div><h2 className="display mt-3 text-2xl font-bold tracking-[-.05em]">{data?.location ?? 'Your location'} <span className="text-[hsl(var(--muted-foreground))]">/ today</span></h2><div className="mt-6 space-y-3">{[{ icon: Thermometer, label: 'Heat load', value: `${Math.round(data?.temperature ?? 0)}° · feels ${Math.round(data?.feelsLike ?? 0)}°` }, { icon: Droplets, label: 'Moisture', value: `${data?.humidity ?? 0}% humidity · ${data?.rainChance ?? 0}% rain chance` }, { icon: Wind, label: 'Movement', value: `${data?.wind ?? 0} km/h wind · ${data?.visibility ?? 0} km visibility` }].map((item) => { const Icon = item.icon; return <div key={item.label} className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3 text-xs last:border-0 last:pb-0"><span className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]"><Icon className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />{item.label}</span><span className="font-semibold">{item.value}</span></div>; })}</div><div className="mt-7 rounded-xl bg-[hsl(var(--secondary)/.6)] p-4"><p className="text-xs font-semibold">A useful habit</p><p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Ask for a decision, not just a forecast. “Can I spray?” gives you a more useful answer than “Will it rain?”</p></div></div><div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--foreground))] p-6 text-[hsl(var(--background))]"><div className="flex items-center justify-between"><div><p className="mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--accent))]">Your briefing</p><h2 className="display mt-2 text-2xl font-bold tracking-[-.05em]">{answer ? 'Here is what matters.' : 'Choose a lens to begin.'}</h2></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--background)/.1)]"><BookOpen className="h-5 w-5 text-[hsl(var(--accent))]" /></div></div>{answer ? <div className="mt-7 animate-rise"><p className="text-sm leading-relaxed text-[hsl(var(--background)/.8)]">{answer.answer}</p>{answer.highlights && <div className="mt-5 space-y-2">{answer.highlights.map((item) => <div key={item} className="flex gap-2 text-xs text-[hsl(var(--background)/.63)]"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--accent))]" />{item}</div>)}</div>}{answer.advisory && <div className="mt-5 rounded-xl border border-[hsl(var(--background)/.14)] p-4"><div className="flex items-center justify-between"><span className="text-xs font-semibold">{answer.advisory.title}</span><span className="text-[10px] uppercase tracking-[.12em] text-[hsl(var(--accent))]">{answer.advisory.status}</span></div><p className="mt-2 text-xs leading-relaxed text-[hsl(var(--background)/.66)]">{answer.advisory.body}</p><div className="mt-3 space-y-1">{answer.advisory.actions.map((item) => <p key={item} className="text-xs text-[hsl(var(--background)/.72)]">→ {item}</p>)}</div></div>}</div> : <div className="mt-10 rounded-xl border border-dashed border-[hsl(var(--background)/.18)] p-5 text-center"><Sprout className="mx-auto h-7 w-7 text-[hsl(var(--accent))]" /><p className="mt-3 text-sm text-[hsl(var(--background)/.7)]">Select one of the lenses above for a plain-language brief based on live conditions.</p></div>}{ask.isPending && <p className="mt-5 flex items-center gap-2 text-xs text-[hsl(var(--background)/.52)]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--accent))]" /> Building your briefing…</p>}<div className="mt-6 flex items-center gap-2 border-t border-[hsl(var(--background)/.14)] pt-4"><input data-testid="input-advisory-question" value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') askAdvisory(question); }} placeholder="Ask a follow-up…" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[hsl(var(--background)/.4)]" /><button data-testid="button-submit-advisory" onClick={() => askAdvisory(question)} disabled={!question.trim() || ask.isPending} className="grid h-8 w-8 place-items-center rounded-lg bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] disabled:opacity-40"><Send className="h-3.5 w-3.5" /></button></div></div></div></div>}</div>;
}