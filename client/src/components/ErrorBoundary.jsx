import React from 'react';
import { toast } from 'sonner';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and potentially send to monitoring service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Show user-friendly error message
    toast.error('Something went wrong!', {
      description: 'The application encountered an error. Please refresh the page.',
      duration: 10000,
    });

    // In production, you would send this to your error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Go to Home
              </button>
            </div>

            {/* Debug info for development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left bg-gray-100 dark:bg-gray-700 rounded p-4">
                <summary className="cursor-pointer font-medium text-sm mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs overflow-auto max-h-40 text-red-600 dark:text-red-400">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  React.useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            totalTime: entry.loadEventEnd - entry.fetchStart,
          });
        }

        if (entry.entryType === 'paint') {
          console.log(`${entry.name}: ${entry.startTime}ms`);
        }

        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    } catch (error) {
      console.log('Performance Observer not supported:', error);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Monitor memory usage (Chrome only)
  React.useEffect(() => {
    if ('memory' in performance) {
      const logMemoryUsage = () => {
        const memory = performance.memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
        });
      };

      // Log memory usage every 30 seconds in development
      if (import.meta.env.DEV) {
        const interval = setInterval(logMemoryUsage, 30000);
        return () => clearInterval(interval);
      }
    }
  }, []);
};

// Network status monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('🌐 Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('🚫 Connection lost', {
        description: 'Please check your internet connection',
        duration: Infinity,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export default ErrorBoundary;
