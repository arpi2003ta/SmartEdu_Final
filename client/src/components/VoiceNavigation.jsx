import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { useBrowserCompatibility, useVoiceRecognition } from './BrowserCompatibility';
import voiceBotIcon from '../assets/voice-bot.svg';
import { playOpenSound, playCloseSound } from '../utils/audioUtils';
import { Mic, MicOff, Smartphone, Volume2, VolumeX } from 'lucide-react';

const VoiceNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { browserInfo, deviceInfo, voiceSupport, isVoiceSupported, isMobileOptimized } = useBrowserCompatibility();
  const { createRecognition, isSupported: voiceRecognitionSupported } = useVoiceRecognition();
  const [activeAi, setActiveAi] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showMobileKeyboard, setShowMobileKeyboard] = useState(false);
  const [mobileInput, setMobileInput] = useState('');
  const [logoutUser] = useLogoutUserMutation();

  // Use browser compatibility data
  const isMobile = isMobileOptimized();
  const hasVoiceSupport = voiceRecognitionSupported;

  useEffect(() => {
    // Mobile-specific optimizations using browser compatibility data
    if (isMobile && deviceInfo?.ios) {
      // Prevent zoom on input focus for iOS
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
      }
    }
  }, [isMobile, deviceInfo]);

  // Industry-level command processor with fallbacks
  const processVoiceCommand = (transcript) => {
    const normalized = transcript.toLowerCase().trim();
    console.log('Processing voice command:', normalized);
    setLastCommand(normalized);

    const intent = classifyIntent(normalized);
    return executeCommand(intent, normalized);
  };

  // Enhanced intent classification with mobile patterns
  const classifyIntent = (transcript) => {
    const intents = {
      // Navigation intents - mobile optimized patterns
      navigate_home: /\b(home|homepage|go home|take me home|main page|start|beginning)\b/,
      navigate_courses: /\b(courses|all courses|show courses|view courses|browse courses|course list)\b/,
      navigate_learning: /\b(my learning|learning|my dashboard|student dashboard|my courses|enrolled courses)\b/,
      navigate_profile: /\b(profile|my profile|account|my account|user profile|settings|preferences)\b/,
      navigate_search: /\b(search|search page|course search|search courses|find courses|search portal|explore)\b/,
      navigate_ai_examiner: /\b(ai examiner|examiner|exam|test|ai exam|examination|assessment)\b/,
      navigate_ai_roadmap: /\b(ai roadmap|personalised roadmap|schedule|timetable|road map|planner)\b/,
      navigate_colleges: /\b(colleges|college|institutions|universities|schools|education)\b/,
      navigate_cbt_practice: /\b(cbt|cvt|practice|test|quiz|mcq)\b/,
      
      // Admin navigation
      admin_dashboard: /\b(admin|admin dashboard|control panel|management|admin panel|dashboard)\b/,
      admin_create_course: /\b(create course|add course|new course|make course|course creation|build course|add course)\b/,
      admin_manage_courses: /\b(manage course|my course|edit course|course management|instructor course|course admin)\b/,
      admin_cbt_exam: /\b(manage|cbtexam|practice|test|quiz|mcq)\b/,
      admin_ai_examiner: /\b(admin ai|ai|examiner|test|quiz|mcq)\b/,
      
      // Advanced search patterns - mobile friendly
      voice_search: /\b(search for|find|look for|show me|get me|i want|i need)\s+(.+)/,
      
      // Mobile-specific commands
      mobile_back: /\b(back|go back|previous|return|navigate back)\b/,
      mobile_close: /\b(close|hide|minimize|dismiss|cancel)\b/,
      
      // System commands
      system_logout: /\b(logout|sign out|log out|log off|exit|quit|goodbye|bye)\b/,
      system_help: /\b(help|what can you do|commands|available commands|instructions|guide|how to|tutorial)\b/,
      system_repeat: /\b(repeat|again|what did you say|say that again|pardon|excuse me)\b/,
      system_mute: /\b(mute|silent|quiet|turn off sound|disable audio|stop sound)\b/,
      system_unmute: /\b(unmute|sound on|enable sound|turn on sound|audio on)\b/,
    };

    for (const [intentName, pattern] of Object.entries(intents)) {
      if (pattern.test(transcript)) {
        return { name: intentName, match: transcript.match(pattern) };
      }
    }

    return { name: 'unknown', match: null };
  };

  // Enhanced command execution with mobile support
  const executeCommand = (intent, transcript) => {
    const { name, match } = intent;

    try {
      switch (name) {
        // Basic Navigation
        case 'navigate_home':
          toast.success("🏠 Going to home page");
          navigate("/");
          return true;
        
        case 'navigate_profile':
          toast.success("👤 Opening profile");
          navigate(user?.role === "instructor" ? "/admin/profile/edit" : "/profile");
          return true;

        case 'navigate_courses':
          if (user?.role === 'student') {
            toast.success("📚 Opening courses");
            navigate("/course/search");
            return true;
          } else {
            toast.error("🚫 Access denied: student privileges required");
            return true;
          }
          

        case 'navigate_learning':
          if (user?.role === 'student') {
            toast.success("🎓 Opening learning dashboard");
            navigate("/my-learning");
            return true;
          } else {
            toast.error("🚫 Access denied: student privileges required");
            return true;
          }
          

        

        case 'navigate_ai_examiner':
          if (user?.role === 'student') {
            toast.success("🤖 Opening AI Examiner");
            navigate("/ai-examiner");
            return true;
          } else {
            toast.error("🚫 Access denied: student privileges required");
            return true;
          }
          
        
          case 'navigate_ai_roadmap':
            if (user?.role === 'student') {
            toast.success("🤖 Opening AI Roadmap Planner");
            navigate("/ai-roadmap");
            return true;
          } else {
            toast.error("🚫 Access denied: student privileges required");
            return true;
          }
          
       
          case 'navigate_cbt_practice':
            if (user?.role === 'student') {
            toast.success("🤖 Opening CBT Practice");
            navigate("/cbt");
            return true;
          } else {
            toast.error("🚫 Access denied: student privileges required");
            return true;
          }
            
          
        case 'navigate_colleges':
          if (user?.role === 'student') {
            toast.success("🏫 Opening colleges");
            navigate("/ai-examiner/colleges");
            return true;
          } else {
            toast.error("🚫 Access denied: student privileges required");
            return true;
          }
          

        // Admin Commands
        case 'admin_dashboard':
          if (user?.role === 'instructor') {
            toast.success("⚡ Opening admin dashboard");
            navigate("/admin/dashboard");
            return true;
          } else {
            toast.error("🚫 Access denied: Admin privileges required");
            return true;
          }

        case 'admin_create_course':
          if (user?.role === 'instructor') {
            toast.success("➕ Opening course creation");
            navigate("/admin/course/create");
            return true;
          } else {
            toast.error("🚫 Access denied: Instructor privileges required");
            return true;
          }

        case 'admin_manage_courses':
          if (user?.role === 'instructor') {
            toast.success("📋 Opening course management");
            navigate("/admin/course");
            return true;
          } else {
            toast.error("🚫 Access denied: Instructor privileges required");
            return true;
          }
          
          case 'admin_cbt_exam':
          if (user?.role === 'instructor') {
            toast.success("⚡ Opening cbt exam");
            navigate("/admin/manage-exam");
            return true;
          } else {
            toast.error("🚫 Access denied: Admin privileges required");
            return true;
          }
          case 'admin_ai_examiner':
          if (user?.role === 'instructor') {
            toast.success("⚡ Opening ai examiner management");
            navigate("/admin-ai-examiner");
            return true;
          } else {
            toast.error("🚫 Access denied: Admin privileges required");
            return true;
          }

          
        // Advanced Search Commands
        case 'voice_search': {
          const searchQuery = match[2]?.trim();
          if (searchQuery && searchQuery.length > 1) {
            toast.success(`🔍 Searching for "${searchQuery}"`);
            navigate(`/course/search?query=${encodeURIComponent(searchQuery)}`);
            return true;
          }
          break;
        }

       

       

        // Mobile-specific commands
        case 'mobile_back':
          toast.info("⬅️ Going back");
          window.history.back();
          return true;

       

        case 'mobile_close':
          toast.info("❌ Closing");
          setShowMobileKeyboard(false);
          return true;

        // System Commands
        case 'system_logout':
          toast.info("👋 Logging out...");
          logoutUser().then(() => {
            navigate('/');
            toast.success("✅ Successfully logged out");
          }).catch(() => {
            toast.error("❌ Failed to logout");
          });
          return true;

        case 'system_mute':
          setIsMuted(true);
          toast.success("🔇 Audio muted");
          return true;

        case 'system_unmute':
          setIsMuted(false);
          toast.success("🔊 Audio enabled");
          return true;

        case 'system_help': {
          const helpCommands = user?.role === 'instructor' 
            ? [
                "🏠 Navigation: home, courses, my learning, profile, search",
                "⚡ Admin: admin dashboard, create course, manage courses", 
                "🔍 Search: search for [topic]",
                "🛠️ System: logout, help, mute, unmute" + (isMobile ? ", back, menu" : "")
              ]
            : [
                "🏠 Navigation: home, courses, my learning, profile, search",
                "🤖 AI: ai examiner, colleges",
                "🔍 Search: search for [topic]", 
                "🛠️ System: logout, help, mute, unmute" + (isMobile ? ", back, menu" : "")
              ];
          
          toast.info("🎤 Voice Commands Available", {
            description: helpCommands.join(" • "),
            duration: 10000,
            });
          return true;
        }

        case 'system_repeat':
          if (lastCommand) {
            toast.info(`🔄 Last command: "${lastCommand}"`);
            return processVoiceCommand(lastCommand);
          }
          break;

        default:
          return false;
      }
    } catch (error) {
      console.error('Command execution error:', error);
      toast.error("❌ Error executing command");
      return false;
    }

    return false;
  };

  // Enhanced voice recognition with fallbacks
  const handleVoiceCommand = () => {
    if (!isAuthenticated) {
      toast.error("🔒 Please log in to use voice navigation");
      navigate('/login');
      return;
    }

    // Mobile fallback to keyboard input
    if (isMobile && (!hasVoiceSupport || !voiceSupport?.support?.overall)) {
      setShowMobileKeyboard(true);
      toast.info("📱 Voice not available. Using text input.", {
        description: "Type your command below"
      });
      return;
    }

    if (!hasVoiceSupport) {
      toast.error("❌ Voice recognition not supported", {
        description: "Try updating your browser or use the text input option"
      });
      return;
    }

    const recognition = createRecognition();
    if (!recognition) {
      toast.error("❌ Could not initialize voice recognition");
      return;
    }
    
    // Enhanced recognition settings using browser compatibility
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = deviceInfo?.mobile ? 15 : 10; // More alternatives for mobile

    // Mobile-specific optimizations
    if (deviceInfo?.mobile) {
      recognition.continuous = false; // Disable continuous for mobile
      recognition.interimResults = false;
    }

    recognition.onstart = () => {
      setIsListening(true);
      setActiveAi(true);
      if (!isMuted) playOpenSound();
      
      toast.loading("🎤 Listening...", { 
        id: "voice-listening", 
        duration: isMobile ? 15000 : 10000 // Longer timeout on mobile
      });
    };

    recognition.onresult = (event) => {
      toast.dismiss("voice-listening");
      
      let commandExecuted = false;
      const alternatives = [];
      
      // Collect all alternatives
      for (let i = 0; i < event.results[0].length; i++) {
        const transcript = event.results[0][i].transcript.trim();
        if (transcript.length > 1) {
          alternatives.push(transcript);
        }
      }

      console.log('Voice alternatives:', alternatives);

      // Try each alternative
      for (const transcript of alternatives) {
        if (processVoiceCommand(transcript)) {
          commandExecuted = true;
          break;
        }
      }
      
      if (!commandExecuted && alternatives.length > 0) {
        const primaryTranscript = alternatives[0];
        const suggestion = generateSmartSuggestion(primaryTranscript);
        
        toast.error(`❌ Command "${primaryTranscript}" not recognized`, {
          description: suggestion ? `💡 Did you mean: ${suggestion}?` : "Say 'help' for available commands",
          duration: 6000,
        });
      }
      
      setTimeout(() => {
        if (!isMuted) playCloseSound();
      }, 100);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.dismiss("voice-listening");
      setIsListening(false);
      setActiveAi(false);
      
      const errorMessages = {
        'not-allowed': "🎤 Microphone access denied. Please allow microphone access in browser settings.",
        'no-speech': "🔇 No speech detected. Please speak clearly and try again.",
        'network': "🌐 Network error. Check your internet connection and try again.",
        'audio-capture': "🎧 Microphone not available. Check your audio device settings.",
        'aborted': "⏹️ Voice recognition was cancelled.",
        'service-not-allowed': "🚫 Speech recognition service not allowed.",
        'bad-grammar': "📝 Recognition grammar error occurred.",
        'language-not-supported': "🗣️ Language not supported for speech recognition."
      };
      
      const message = errorMessages[event.error] || "❌ Voice recognition error. Please try again.";
      toast.error(message, { duration: 6000 });
      
      if (!isMuted) playCloseSound();
    };

    recognition.onend = () => {
      toast.dismiss("voice-listening");
      setIsListening(false);
      setActiveAi(false);
    };

    // Start recognition with enhanced error handling
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast.error("❌ Failed to start voice recognition");
      setActiveAi(false);
      setIsListening(false);
    }
  };

  // Smart suggestion system with mobile patterns
  const generateSmartSuggestion = (transcript) => {
    const suggestions = {
      'holmes': 'home',
      'horse': 'courses',
      'course': 'courses',
      'learning': 'my learning',
      'profile': 'my profile',
      'search': 'search for courses',
      'admin': 'admin dashboard',
      'create': 'create course',
      'manage': 'manage courses',
      'examiner': 'ai examiner',
      'college': 'colleges',
      'logout': 'logout',
      'help': 'help',
      'back': 'back',
      'menu': 'menu',
      'CVT':'CBT'
    };

    const words = transcript.toLowerCase().split(' ');
    
    // Direct matching
    for (const word of words) {
      if (suggestions[word]) {
        return suggestions[word];
      }
    }

    // Fuzzy matching with enhanced algorithm
    for (const word of words) {
      if (word.length > 2) {
        for (const [key, value] of Object.entries(suggestions)) {
          if (levenshteinDistance(word, key) <= Math.max(1, Math.floor(word.length * 0.3))) {
            return value;
          }
        }
      }
    }

    // Pattern-based suggestions
    if (transcript.includes('find') || transcript.includes('search')) return 'search for courses';
    if (transcript.includes('go') || transcript.includes('navigate')) return 'home';
    if (transcript.includes('show') || transcript.includes('display')) return 'courses';
    
    return null;
  };

  // Enhanced Levenshtein distance
  const levenshteinDistance = (str1, str2) => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Handle mobile keyboard input
  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (mobileInput.trim()) {
      const success = processVoiceCommand(mobileInput.trim());
      if (success) {
        setMobileInput('');
        setShowMobileKeyboard(false);
        if (!isMuted) playCloseSound();
      }
    }
  };

  // Render mobile keyboard interface
  if (showMobileKeyboard) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Voice Command
            </h3>
            <button 
              onClick={() => setShowMobileKeyboard(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleMobileSubmit}>
            <div className="mb-4">
              <input
                type="text"
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
                placeholder="Type your command... (e.g., search for React)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base"
                autoFocus
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!mobileInput.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Execute Command
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileInput('help');
                  handleMobileSubmit({ preventDefault: () => {} });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Help
              </button>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 text-center">
              Quick commands: home, courses, search for [topic], popular courses
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Enhanced visual design for all devices
  return (
    <>
      {/* Desktop/Tablet Voice Button */}
      <div className={`fixed z-50 transition-all duration-300 ${
        isMobile 
          ? 'bottom-4 right-4' // Mobile: bottom-right to avoid navigation
          : 'lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%]' // Desktop: bottom-left
      }`}>
        <div
          onClick={handleVoiceCommand}
          className="cursor-pointer relative group"
          title={
            !isAuthenticated 
              ? "Login required for voice navigation"
              : !hasVoiceSupport && isMobile
              ? "Tap for text input commands"
              : hasVoiceSupport
              ? "Click to use voice navigation"
              : "Browser not supported - using text input"
          }
        >
          <div className="relative">
            <img
              src={voiceBotIcon}
              alt="Voice Navigation"
              className={`transition-all duration-300 ease-in-out ${
                isMobile ? 'w-[60px] h-[60px]' : 'w-[80px] h-[80px]'
              } ${
                activeAi
                  ? 'translate-x-[10%] translate-y-[-10%] scale-125'
                  : 'translate-x-[0] translate-y-[0] scale-100 hover:scale-110'
              }`}
              style={{
                filter: activeAi
                  ? 'drop-shadow(0px 0px 30px #00d2fc) drop-shadow(0px 0px 15px #00d2fc)'
                  : 'drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.5))',
              }}
            />
            
            {/* Mobile indicator overlay */}
            {isMobile && !hasVoiceSupport && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
            )}
          </div>
          
          {/* Pulse animation when listening */}
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"></div>
          )}
          
          {/* Enhanced status indicator */}
          <div className="absolute -top-2 -right-2 flex gap-1">
            <div
              className={`w-4 h-4 rounded-full ${
                !hasVoiceSupport
                  ? 'bg-orange-500' // Browser limitation
                  : !isAuthenticated
                  ? 'bg-gray-400'   // Not authenticated
                  : isListening
                  ? 'bg-red-500 animate-pulse' // Listening
                  : 'bg-green-500'  // Ready
              }`}
            />
            
            {/* Audio mute indicator */}
            {isMuted && (
              <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center">
                <VolumeX className="w-2 h-2 text-white" />
              </div>
            )}
          </div>

          {/* Enhanced tooltip with device-specific info */}
          <div className={`absolute ${
            isMobile ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2' : 'left-full ml-4 top-1/2 transform -translate-y-1/2'
          } bg-black text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none max-w-xs`}>
            {!isAuthenticated
              ? '🔒 Login Required'
              : !hasVoiceSupport && isMobile
              ? '📱 Tap for Text Commands'
              : !hasVoiceSupport
              ? '❌ Browser Not Supported'
              : isListening
              ? '🎤 Listening...'
              : isMobile
              ? '📱 Voice/Text Navigation'
              : '🎤 Voice Navigation'
            }
            
            {/* Tooltip arrow */}
            <div className={`absolute ${
              isMobile 
                ? 'top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black'
                : 'right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-black'
            }`}></div>
          </div>
          
          {/* Mobile device info */}
          {isMobile && (
            <div className="absolute bottom-full mb-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              {hasVoiceSupport ? '🎤 Voice + 📱 Text' : '📱 Text Only'}
            </div>
          )}
        </div>
      </div>

      {/* Quick mute/unmute button for mobile */}
      {isMobile && (
        <div className="fixed bottom-4 left-4 z-40">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      )}
    </>
  );
};

export default VoiceNavigation;
