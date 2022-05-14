import { useState, useEffect, useErrorBoundary } from 'preact/hooks';
import { useLocation } from 'wouter-preact';

import useBus from "use-bus";

import ConnectPage from './pages/connect';
import DashboardPage from './pages/dashboard';
import ErrorBoundary from './shared/ErrorBoundary';
import TestPage from './pages/test';

export function App() {
  const [location, setLocation] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem('authSignature')) {
      setIsAuthorized(true);
    }
  }, []);

  useBus("authSignature", ({ payload: authSignature }) => {
    window.localStorage.setItem("authSignature", authSignature);
    setIsAuthorized(!!authSignature);
  }, []);

  useEffect(() => {
    if (location.startsWith("/test")) {
      // setLocation('/test');
    } else if (isAuthorized && location.startsWith("/connect")) {
      setLocation('/dashboard');
    } else if (!isAuthorized && !location.startsWith("/connect")) {
      setLocation('/connect');
    }
  }, [isAuthorized, location]);

  const [error, resetError] = useErrorBoundary(
    error => console.error(error),
  );

  return <div className="flex flex-col h-screen bg-gray-900 font-mono text-white">
    {
      error && <div className="flex flex-col items-center justify-center">
        <h1>Error</h1>
        <pre>{error.message}</pre>
        <button onClick={resetError}>Reset</button>
      </div>
    }
    {
      location.startsWith('/test') && <TestPage />
    }
    {
      location.startsWith('/connect') && <ConnectPage />
    }
    {
      location.startsWith('/dashboard') && <DashboardPage />
    }
  </div>
}