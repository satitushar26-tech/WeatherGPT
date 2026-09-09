import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useHealthCheck, getHealthCheckQueryKey } from '@workspace/api-client-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDot,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSun,
  Compass,
  Droplets,
  Gauge,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Leaf,
  LocateFixed,
  Map as MapIcon,
  Menu,
  MessageCircle,
  Navigation,
  PanelLeftClose,
  Radio,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { useLanguage, type LanguageCode } from '@/lib/i18n';

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, supportedLanguages } = useLanguage();

  return (
    <div className="relative inline-flex items-center">
      <div className={`flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.9)] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--foreground))] transition-all hover:bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/.4)] focus-within:ring-2 focus-within:ring-[hsl(var(--primary)/.3)] ${compact ? 'text-[11px] px-2 py-0.5' : ''}`}>
        <Globe className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--primary))]" />
        <select
          aria-label="Select Interface Language"
          data-testid="select-global-language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          className="cursor-pointer appearance-none bg-transparent pr-4 text-xs font-medium text-[hsl(var(--foreground))] outline-none"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
              {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 text-[8px] text-[hsl(var(--muted-foreground))]">▼</span>
      </div>
    </div>
  );
}

const navItemDefs = [
  { href: '/', translationKey: 'nav.mainDashboard', defaultLabel: 'Main Dashboard', icon: LayoutDashboard },
  { href: '/ask', translationKey: 'nav.ask', defaultLabel: 'Ask WeatherGPT', icon: MessageCircle },
  { href: '/alerts', translationKey: 'nav.alerts', defaultLabel: 'Alert center', icon: ShieldAlert },
  { href: '/map', translationKey: 'nav.map', defaultLabel: 'Signal map', icon: MapIcon },
  { href: '/climate', translationKey: 'nav.climate', defaultLabel: 'Climate lens', icon: BarChart3 },
  { href: '/advisory', translationKey: 'nav.advisory', defaultLabel: 'Field advisory', icon: Leaf },
  { href: '/presentation', translationKey: 'nav.presentation', defaultLabel: 'SIH Presentation', icon: Sparkles },
];

export function WeatherShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });
  const { t, langInfo } = useLanguage();

  const navItems = navItemDefs.map((item) => ({
    href: item.href,
    icon: item.icon,
    label: t(item.translationKey) || item.defaultLabel,
  }));

  const isDashboardActive = (href: string) => {
    if (href === '/') {
      return location === '/' || location === '/dashboard' || location === '/main-dashboard' || location === '/weather' || location === '/desk';
    }
    return location === href;
  };

  return (
    <div className="app-shell noise">
      <aside className="desktop-sidebar flex flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))]">
        <div className="gov-tricolor" aria-hidden="true" />
        <div className="flex items-center gap-3 px-7 pt-8">
          <BrandMark compact />
          <div>
            <div className="display text-[17px] font-bold tracking-[-.03em]">WeatherGPT</div>
            <div className="mono mt-0.5 text-[9px] uppercase tracking-[.16em] text-[hsl(var(--sidebar-foreground)/.55)]">{t('brand.tagline')}</div>
          </div>
        </div>
        <div className="mx-7 mt-4 flex items-center justify-between text-[10px] text-[hsl(var(--sidebar-foreground)/.62)]">
          <div className="flex items-center gap-1.5"><CircleDot className="h-3 w-3 text-[#f29b38]" /><span>INDIA · {langInfo.nativeName}</span></div>
          <span className="rounded bg-[hsl(var(--sidebar-primary)/.15)] px-1.5 py-0.2 mono text-[9px] text-[hsl(var(--sidebar-primary))] font-semibold">{langInfo.code.toUpperCase()}</span>
        </div>
        <div className="mx-7 mt-4 border-t border-[hsl(var(--sidebar-border))]" />

        {/* SIH Panel Banner in Sidebar */}
        <div className="mx-4 mt-4 rounded-xl border border-[hsl(var(--sidebar-primary)/.35)] bg-[hsl(var(--sidebar-primary)/.12)] p-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-[hsl(var(--sidebar-primary))]">
            <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> {t('brand.sihEvaluation')}</span>
            <span className="rounded bg-[hsl(var(--sidebar-primary)/.2)] px-1.5 py-0.5 mono text-[9px]">ID: 26068</span>
          </div>
          <p className="mt-1 text-[11px] leading-tight text-[hsl(var(--sidebar-foreground)/.85)] font-medium">{t('brand.sihSubtitle')}</p>
          <Link href="/presentation" className="mt-2 flex items-center justify-between rounded-lg bg-[hsl(var(--sidebar-primary))] px-2.5 py-1.5 text-[11px] font-bold text-[hsl(var(--sidebar-primary-foreground))] shadow-sm hover:opacity-90 transition-opacity">
            <span>{t('brand.sihLaunch')}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="px-4 pt-4">
          <p className="mono px-3 pb-2 text-[9px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.46)]">{t('brand.publicServices')}</p>
          <nav className="space-y-1" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isDashboardActive(item.href)}
              />
            ))}
          </nav>
        </div>
        <div className="mt-auto px-7 pb-7">
          <div className="rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.72)] p-4">
            <div className="flex items-center justify-between">
              <span className="mono text-[10px] uppercase tracking-[.14em] text-[hsl(var(--sidebar-foreground)/.6)]">{t('brand.systemPulse')}</span>
              <span className={`h-2 w-2 rounded-full ${health.isError ? 'bg-[hsl(var(--accent))]' : 'bg-[#9ccf9b]'}`} />
            </div>
            <p className="mt-3 text-sm leading-snug text-[hsl(var(--sidebar-foreground)/.78)]">
              {health.isError ? t('brand.pulseIssue') : t('brand.pulseConnected')}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-[hsl(var(--sidebar-foreground)/.55)]">
              <Activity className="h-3.5 w-3.5" /> {health.isLoading ? t('brand.checking') : t('brand.updated')}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[hsl(var(--sidebar-primary))] text-xs font-bold text-[hsl(var(--sidebar-primary-foreground))]">IN</div>
              <div className="min-w-0"><p className="truncate text-xs font-semibold">{t('brand.indiaCoverage')}</p><p className="truncate text-[11px] text-[hsl(var(--sidebar-foreground)/.52)]">{t('brand.localView')}</p></div>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[hsl(var(--border)/.7)] bg-[hsl(var(--background)/.94)] px-3 backdrop-blur-xl sm:h-[82px] sm:px-[clamp(18px,4vw,58px)]">
          <div className="flex items-center gap-3">
            <button data-testid="button-open-navigation" onClick={() => setMobileOpen(true)} className="mobile-nav rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"><Menu className="h-5 w-5" /></button>
            <div className="hidden items-center gap-3 sm:flex"><BrandMark /><div><div className="text-[11px] font-semibold tracking-[.02em]">{t('brand.tagline').toUpperCase()}</div><span className="mono text-[9px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">{t('brand.subtitle')}</span></div></div>
            <div className="sm:hidden"><BrandMark /></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <Link href="/presentation" className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--accent)/.4)] bg-[hsl(var(--accent)/.12)] px-2.5 py-1 text-[11px] font-bold text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/.22)] transition-colors" title="Open SIH 2026 Presentation Slide Deck">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
              <span className="hidden xs:inline">{t('header.pitch')}</span>
              <span className="xs:hidden">Pitch</span>
            </Link>
            <div className="hidden items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-1.5 text-[11px] text-[hsl(var(--muted-foreground))] md:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#75ae81]" /> {t('header.live')}</div>
            <button data-testid="button-refresh-dashboard" onClick={() => window.location.reload()} className="rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))] transition-transform hover:-rotate-45 hover:bg-[hsl(var(--card))]" title={t('header.refresh')}><RefreshCw className="h-4 w-4" /></button>
            <div className="grid h-8 w-8 place-items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[10px] font-bold text-[hsl(var(--primary))]">{langInfo.code.toUpperCase()}</div>
          </div>
        </header>
        {children}
      </main>

      {mobileOpen && <div className="fixed inset-0 z-50 bg-[hsl(var(--foreground)/.32)] backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
        <div className="h-full w-[285px] bg-[hsl(var(--sidebar))] p-6 text-[hsl(var(--sidebar-foreground))]" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><BrandMark compact /><span className="display font-bold">WeatherGPT</span></div><button data-testid="button-close-navigation" onClick={() => setMobileOpen(false)} className="rounded-lg p-2"><X className="h-5 w-5" /></button></div>
          <div className="mt-4 pb-4 border-b border-[hsl(var(--sidebar-border))]">
            <p className="mono pb-2 text-[9px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.46)]">Language / भाषा</p>
            <LanguageSelector />
          </div>
          <nav className="mt-4 space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isDashboardActive(item.href)}
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </nav>
        </div>
      </div>}
      <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-40 border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/.94)] px-1 py-1.5 backdrop-blur-xl" aria-label="Mobile navigation">
        <div className="grid grid-cols-7 gap-0.5">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isDashboardActive(item.href)}
              mobile
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

function NavItem({ href, label, icon: Icon, active, onClick, mobile }: { href: string; label: string; icon: typeof Compass; active: boolean; onClick?: () => void; mobile?: boolean }) {
  return <Link href={href} onClick={onClick} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`} className={`${mobile ? 'flex-col gap-1 py-1.5 text-[10px]' : 'gap-3 px-3 py-3 text-[13px]'} ${active ? 'bg-[hsl(var(--sidebar-primary)/.14)] text-[hsl(var(--sidebar-primary))]' : mobile ? 'text-[hsl(var(--muted-foreground))]' : 'text-[hsl(var(--sidebar-foreground)/.68)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]'} flex items-center rounded-lg font-medium transition-colors`}><Icon className={`${mobile ? 'h-4 w-4' : 'h-[17px] w-[17px]'}`} /><span>{mobile ? label.split(' ')[0] : label}</span>{active && !mobile && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}</Link>;
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return <div className={`${compact ? 'h-9 w-9' : 'h-8 w-8'} relative grid place-items-center overflow-hidden rounded-[11px] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-[0_7px_18px_hsl(var(--accent)/.25)]`}><CloudSun className={`${compact ? 'h-5 w-5' : 'h-[18px] w-[18px]'}`} strokeWidth={2.2} /><span className="absolute bottom-0 left-0 right-0 h-1 bg-[#138808]" /></div>;
}

export function SectionHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: React.ReactNode }) {
  return <div className="mb-6 flex items-end justify-between gap-4"><div><p className="mono mb-2 text-[10px] uppercase tracking-[.17em] text-[hsl(var(--accent-foreground)/.72)]">{eyebrow}</p><h2 className="display text-[clamp(22px,2.4vw,31px)] font-bold leading-tight tracking-[-.045em]">{title}</h2>{detail && <p className="mt-1.5 max-w-xl text-sm text-[hsl(var(--muted-foreground))]">{detail}</p>}</div>{action}</div>;
}

export function WeatherGlyph({ condition, size = 'md' }: { condition?: string; size?: 'sm' | 'md' | 'lg' }) {
  const value = (condition ?? '').toLowerCase();
  const Icon = value.includes('rain') || value.includes('shower') ? CloudRain : value.includes('drizzle') ? CloudDrizzle : value.includes('cloud') || value.includes('overcast') ? Cloud : value.includes('wind') ? Wind : value.includes('sun') || value.includes('clear') ? Sun : CloudSun;
  const sizeClass = size === 'lg' ? 'h-16 w-16' : size === 'sm' ? 'h-5 w-5' : 'h-8 w-8';
  return <Icon className={`${sizeClass} ${Icon === Sun ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--primary))]'}`} strokeWidth={1.65} />;
}

export function MetricCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon?: string }) {
  const Icon = icon?.toLowerCase().includes('wind') ? Wind : icon?.toLowerCase().includes('humidity') ? Droplets : icon?.toLowerCase().includes('pressure') ? Gauge : icon?.toLowerCase().includes('visibility') ? Search : Thermometer;
  return <div className="card-surface group rounded-xl p-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"><div className="flex items-start justify-between"><span className="text-xs text-[hsl(var(--muted-foreground))]">{label}</span><Icon className="h-4 w-4 text-[hsl(var(--primary)/.65)] transition-transform group-hover:scale-110" /></div><div className="mt-3 display text-[22px] font-bold tracking-[-.04em]">{value}</div><div className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">{detail}</div></div>;
}

export function SkeletonBlock({ className = '' }: { className?: string }) { return <div className={`skeleton rounded-xl ${className}`} />; }

export function ErrorState({ title = 'Signal interrupted', onRetry }: { title?: string; onRetry?: () => void }) {
  return <div className="card-surface flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center"><AlertTriangle className="h-8 w-8 text-[hsl(var(--accent-foreground))]" /><h3 className="display mt-4 text-lg font-semibold">{title}</h3><p className="mt-1 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">We could not reach the weather feed. Try again in a moment.</p>{onRetry && <button data-testid="button-retry-data" onClick={onRetry} className="mt-5 flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-xs font-semibold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5"><RefreshCw className="h-3.5 w-3.5" /> Retry connection</button>}</div>;
}

export function EmptyState({ title, detail, icon: Icon = Cloud }: { title: string; detail: string; icon?: typeof Cloud }) {
  return <div className="card-surface flex flex-col items-center justify-center rounded-2xl px-6 py-14 text-center"><div className="grid h-12 w-12 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><Icon className="h-5 w-5" /></div><h3 className="display mt-4 text-lg font-semibold">{title}</h3><p className="mt-1 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">{detail}</p></div>;
}

export function AlertPill({ severity }: { severity: string }) {
  const high = severity.toLowerCase().includes('high') || severity.toLowerCase().includes('severe') || severity.toLowerCase().includes('red');
  return <span className={`${high ? 'bg-[#f8ddd5] text-[#9c3d2b]' : 'bg-[#f8e9c7] text-[#8b651e]'} inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[.1em]`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{severity}</span>;
}

export function formatUpdated(value?: string) {
  if (!value) return 'Live feed';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `Updated ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
}

export const iconSet = { Bell, CalendarDays, ChevronRight, Droplets, LocateFixed, Navigation, Send, Sparkles, Umbrella, Zap, Check, ArrowUpRight, HelpCircle, PanelLeftClose };