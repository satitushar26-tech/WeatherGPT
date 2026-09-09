import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WeatherShell } from '@/components/weather-ui';
import { AdvisoryPage, AlertsPage, AskPage, ClimatePage, HomePage, MapPage } from '@/pages/weather-pages';
import { PresentationPage } from '@/pages/presentation-page';
import { LanguageProvider } from '@/lib/i18n';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false },
  },
});

function Router() {
  return (
    <WeatherShell>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/dashboard" component={HomePage} />
          <Route path="/main-dashboard" component={HomePage} />
          <Route path="/weather" component={HomePage} />
          <Route path="/desk" component={HomePage} />
          <Route path="/ask" component={AskPage} />
          <Route path="/alerts" component={AlertsPage} />
          <Route path="/map" component={MapPage} />
          <Route path="/climate" component={ClimatePage} />
          <Route path="/advisory" component={AdvisoryPage} />
          <Route path="/presentation" component={PresentationPage} />
          <Route path="/pitch" component={PresentationPage} />
          <Route path="/sih" component={PresentationPage} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </WeatherShell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;