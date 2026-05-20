import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

const BrowserCompatibilityContext = createContext();

export const useBrowserCompatibility = () => {
  const context = useContext(BrowserCompatibilityContext);
  if (!context) {
    throw new Error('useBrowserCompatibility must be used within BrowserCompatibilityProvider');
  }
  return context;
};

export const BrowserCompatibilityProvider = ({ children }) => {
  const [browserInfo, setBrowserInfo] = useState(null);
  const [voiceSupport, setVoiceSupport] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    const detectBrowserAndDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform;
      const maxTouchPoints = navigator.maxTouchPoints || 0;

      // Detailed browser detection
      const browser = {
        chrome: /chrome/.test(userAgent) && !/edge/.test(userAgent) && !/opr/.test(userAgent),
        safari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
        firefox: /firefox/.test(userAgent),
        edge: /edge/.test(userAgent) || /edg/.test(userAgent),
        opera: /opr/.test(userAgent) || /opera/.test(userAgent),
        samsung: /samsungbrowser/.test(userAgent),
        ie: /msie/.test(userAgent) || /trident/.test(userAgent)
      };

      // Device detection
      const device = {
        mobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
        tablet: /ipad|android(?!.*mobile)|kindle|playbook|silk/i.test(userAgent),
        desktop: !(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)),
        ios: /ipad|iphone|ipod/.test(userAgent),
        android: /android/.test(userAgent),
        touchDevice: maxTouchPoints > 0 || 'ontouchstart' in window
      };

      // Voice capabilities detection
      const voice = {
        speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
        speechSynthesis: !!window.speechSynthesis,
        mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        audioContext: !!(window.AudioContext || window.webkitAudioContext),
        getUserMedia: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia),
      };

      // Calculate overall support levels
      const support = {
        voiceRecognition: voice.speechRecognition ? 
          (browser.chrome || browser.edge ? 'excellent' : 
           browser.safari ? 'good' : 'limited') : 'none',
        audioPlayback: voice.audioContext ? 'supported' : 'limited',
        microphone: voice.mediaDevices || voice.getUserMedia ? 'supported' : 'none',
        overall: voice.speechRecognition && voice.audioContext && (voice.mediaDevices || voice.getUserMedia) ? 
          'full' : voice.speechRecognition ? 'partial' : 'none'
      };

      setBrowserInfo({ ...browser, userAgent, platform });
      setDeviceInfo(device);
      setVoiceSupport({ ...voice, support });
    };

    detectBrowserAndDevice();

    // Re-detect on device orientation change
    const handleOrientationChange = () => {
      setTimeout(detectBrowserAndDevice, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Browser compatibility warnings
  useEffect(() => {
    if (browserInfo && voiceSupport) {
      let warningShown = false;

      // IE Warning
      if (browserInfo.ie && !warningShown) {
        toast.error('⚠️ Internet Explorer Detected', {
          description: 'For the best experience, please use Chrome, Firefox, Safari, or Edge.',
          duration: 10000
        });
        warningShown = true;
      }

      // Voice support warnings for mobile
      if (deviceInfo?.mobile && voiceSupport.support.overall === 'none' && !warningShown) {
        toast.info('📱 Mobile Voice Support', {
          description: 'Voice navigation available via text input. Tap the voice button to start.',
          duration: 6000
        });
        warningShown = true;
      }

      // Safari voice limitations
      if (browserInfo.safari && !deviceInfo?.ios && voiceSupport.support.voiceRecognition === 'limited' && !warningShown) {
        toast.warning('🦊 Safari Voice Limitation', {
          description: 'Voice recognition may have limited functionality. Consider using Chrome for full features.',
          duration: 8000
        });
        warningShown = true;
      }

      // Firefox voice limitations
      if (browserInfo.firefox && voiceSupport.support.voiceRecognition === 'limited' && !warningShown) {
        toast.warning('🔥 Firefox Voice Support', {
          description: 'Voice recognition not fully supported. Text input alternative available.',
          duration: 8000
        });
        warningShown = true;
      }
    }
  }, [browserInfo, voiceSupport, deviceInfo]);

  // Provide polyfills and fallbacks
  const getVoiceRecognition = () => {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  };

  const getAudioContext = () => {
    return window.AudioContext || window.webkitAudioContext || null;
  };

  const getUserMedia = () => {
    return navigator.mediaDevices?.getUserMedia || 
           navigator.getUserMedia || 
           navigator.webkitGetUserMedia || 
           navigator.mozGetUserMedia || 
           null;
  };

  const isVoiceSupported = () => {
    return voiceSupport?.support.overall !== 'none';
  };

  const isMobileOptimized = () => {
    return deviceInfo?.mobile || deviceInfo?.tablet;
  };

  const getBrowserRecommendation = () => {
    if (!browserInfo) return null;

    if (browserInfo.ie) {
      return 'For optimal experience, please upgrade to Chrome, Firefox, Safari, or Edge.';
    }

    if (deviceInfo?.mobile) {
      if (browserInfo.chrome || browserInfo.edge) {
        return 'Excellent! Your browser supports all features.';
      } else if (browserInfo.safari && deviceInfo.ios) {
        return 'Good support. Some voice features may have limitations.';
      } else {
        return 'Consider using Chrome or Safari for better voice navigation support.';
      }
    }

    if (browserInfo.chrome || browserInfo.edge) {
      return 'Perfect! Full voice navigation support available.';
    } else if (browserInfo.safari) {
      return 'Good support with some limitations. Chrome recommended for full features.';
    } else if (browserInfo.firefox) {
      return 'Limited voice support. Text-based navigation available as alternative.';
    }

    return 'Your browser has limited support. Chrome or Edge recommended.';
  };

  const contextValue = {
    browserInfo,
    deviceInfo,
    voiceSupport,
    getVoiceRecognition,
    getAudioContext,
    getUserMedia,
    isVoiceSupported,
    isMobileOptimized,
    getBrowserRecommendation
  };

  return (
    <BrowserCompatibilityContext.Provider value={contextValue}>
      {children}
    </BrowserCompatibilityContext.Provider>
  );
};

// Hook for voice recognition with fallbacks
export const useVoiceRecognition = () => {
  const { getVoiceRecognition, voiceSupport, deviceInfo } = useBrowserCompatibility();

  const createRecognition = () => {
    const SpeechRecognition = getVoiceRecognition();
    
    if (!SpeechRecognition) {
      return null;
    }

    const recognition = new SpeechRecognition();
    
    // Mobile optimizations
    if (deviceInfo?.mobile) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 15;
    } else {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 10;
    }

    recognition.lang = 'en-US';
    
    return recognition;
  };

  return {
    createRecognition,
    isSupported: !!getVoiceRecognition(),
    supportLevel: voiceSupport?.support.voiceRecognition || 'none'
  };
};

export default BrowserCompatibilityProvider;