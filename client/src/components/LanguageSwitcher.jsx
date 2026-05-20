import React, { useEffect, useMemo, useState } from "react";
import { Check, Languages } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DEFAULT_LANGUAGE = "en";
const STORAGE_KEY = "smartedu.language";
const LANGUAGE_EVENT = "smartedu-language-change";

const LANGUAGES = [
  { value: "en", label: "English", shortLabel: "EN", htmlLang: "en" },
  { value: "bn", label: "বাংলা", shortLabel: "BN", htmlLang: "bn" },
];

const isBrowser = () => typeof window !== "undefined";

const getLanguageConfig = (value) =>
  LANGUAGES.find((language) => language.value === value) || LANGUAGES[0];

const getTranslateCookie = () => {
  if (!isBrowser()) return "";

  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
};

const getInitialLanguage = () => {
  if (!isBrowser()) return DEFAULT_LANGUAGE;

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (LANGUAGES.some((language) => language.value === storedLanguage)) {
    return storedLanguage;
  }

  const translateCookie = getTranslateCookie();
  return translateCookie.endsWith("/bn") ? "bn" : DEFAULT_LANGUAGE;
};

const getCookieDomains = () => {
  if (!isBrowser()) return [""];

  const { hostname } = window.location;
  const domains = [""];

  if (hostname && hostname !== "localhost" && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    domains.push(hostname, `.${hostname}`);

    const hostnameParts = hostname.split(".");
    if (hostnameParts.length > 2) {
      domains.push(`.${hostnameParts.slice(-2).join(".")}`);
    }
  }

  return domains;
};

const writeTranslateCookie = (language) => {
  if (!isBrowser()) return;

  const isDefaultLanguage = language === DEFAULT_LANGUAGE;
  const cookieValue = isDefaultLanguage ? "" : `/en/${language}`;
  const expiry = isDefaultLanguage
    ? "expires=Thu, 01 Jan 1970 00:00:00 GMT"
    : "max-age=31536000";

  getCookieDomains().forEach((domain) => {
    const domainPart = domain ? `;domain=${domain}` : "";
    document.cookie = `googtrans=${cookieValue};path=/;${expiry}${domainPart}`;
  });
};

const updateStoredLanguage = (language) => {
  if (!isBrowser()) return;

  window.localStorage.setItem(STORAGE_KEY, language);
  document.documentElement.lang = getLanguageConfig(language).htmlLang;
  writeTranslateCookie(language);
};

const isTranslatedPage = () => {
  if (!isBrowser()) return false;

  return (
    document.documentElement.classList.contains("translated-ltr") ||
    document.body.classList.contains("translated-ltr") ||
    getTranslateCookie().endsWith("/bn")
  );
};

const waitForTranslateCombo = (attempts = 30) =>
  new Promise((resolve) => {
    const findCombo = (remainingAttempts) => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo || remainingAttempts <= 0) {
        resolve(combo);
        return;
      }

      window.setTimeout(() => findCombo(remainingAttempts - 1), 200);
    };

    findCombo(attempts);
  });

const initializeGoogleTranslate = () => {
  if (
    !isBrowser() ||
    window.__smartEduGoogleTranslateInitialized ||
    !window.google?.translate?.TranslateElement
  ) {
    return;
  }

  const target = document.getElementById("google_translate_element");
  if (!target) return;

  window.__smartEduGoogleTranslateInitialized = true;

  new window.google.translate.TranslateElement(
    {
      pageLanguage: DEFAULT_LANGUAGE,
      includedLanguages: "en,bn",
      autoDisplay: false,
      multilanguagePage: true,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
    },
    "google_translate_element",
  );
};

const loadGoogleTranslate = () => {
  if (!isBrowser()) return Promise.resolve();

  if (window.google?.translate?.TranslateElement) {
    initializeGoogleTranslate();
    return Promise.resolve();
  }

  if (window.__smartEduGoogleTranslatePromise) {
    return window.__smartEduGoogleTranslatePromise;
  }

  window.__smartEduGoogleTranslatePromise = new Promise((resolve, reject) => {
    window.googleTranslateElementInit = () => {
      initializeGoogleTranslate();
      resolve();
    };

    const existingScript = document.querySelector(
      'script[src*="translate_a/element.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        initializeGoogleTranslate();
        resolve();
      });
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.dataset.googleTranslate = "true";
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return window.__smartEduGoogleTranslatePromise;
};

const applyGoogleTranslation = async (language) => {
  if (!isBrowser()) return;

  try {
    await loadGoogleTranslate();
    const combo = await waitForTranslateCombo();
    if (!combo) return;

    combo.value = language === DEFAULT_LANGUAGE ? "" : language;
    combo.dispatchEvent(new Event("change"));
  } catch (error) {
    console.warn("Google Translate failed to load.", error);
  }
};

export const setSiteLanguage = (language) => {
  if (!LANGUAGES.some((item) => item.value === language)) return;

  const previousLanguage = getInitialLanguage();
  updateStoredLanguage(language);

  if (isBrowser()) {
    window.dispatchEvent(
      new CustomEvent(LANGUAGE_EVENT, { detail: { language } }),
    );

    if (language === DEFAULT_LANGUAGE && previousLanguage !== DEFAULT_LANGUAGE) {
      window.setTimeout(() => {
        if (isTranslatedPage()) window.location.reload();
      }, 100);
    }
  }
};

export const LanguageTranslator = () => {
  const location = useLocation();
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail?.language || DEFAULT_LANGUAGE);
    };

    window.addEventListener(LANGUAGE_EVENT, handleLanguageChange);
    return () =>
      window.removeEventListener(LANGUAGE_EVENT, handleLanguageChange);
  }, []);

  useEffect(() => {
    updateStoredLanguage(language);

    if (language !== DEFAULT_LANGUAGE) {
      applyGoogleTranslation(language);
      window.setTimeout(() => applyGoogleTranslation(language), 700);
    }
  }, [language, location.pathname, location.search]);

  return (
    <div
      id="google_translate_element"
      aria-hidden="true"
      className="google-translate-element"
    />
  );
};

const LanguageSwitcher = ({ className, compact = false }) => {
  const [language, setLanguage] = useState(getInitialLanguage);
  const selectedLanguage = useMemo(() => getLanguageConfig(language), [language]);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail?.language || DEFAULT_LANGUAGE);
    };

    window.addEventListener(LANGUAGE_EVENT, handleLanguageChange);
    return () =>
      window.removeEventListener(LANGUAGE_EVENT, handleLanguageChange);
  }, []);

  const handleLanguageSelect = (nextLanguage) => {
    if (nextLanguage === language) return;
    setLanguage(nextLanguage);
    setSiteLanguage(nextLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "notranslate h-9 rounded-full px-3",
            compact ? "w-9 px-0" : "gap-2",
            className,
          )}
          translate="no"
          aria-label="Change language"
        >
          <Languages className="h-4 w-4" />
          {!compact && (
            <span className="hidden sm:inline">{selectedLanguage.label}</span>
          )}
          <span className={compact ? "sr-only" : "sm:hidden"}>
            {selectedLanguage.shortLabel}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="notranslate w-40"
        translate="no"
      >
        {LANGUAGES.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onSelect={() => handleLanguageSelect(item.value)}
            className="justify-between"
          >
            <span>{item.label}</span>
            {language === item.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
