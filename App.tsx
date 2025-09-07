
import React, { useState, useEffect, useRef, useCallback, FormEvent, createContext, useContext, useMemo } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useClerk, SignIn, useUser } from '@clerk/clerk-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { marked } from 'marked';
import LandingPage from './LandingPage';
import type { ChatMessage, DiseaseAnalysisResult, YieldPredictionParams, YieldPredictionResult, RecentActivity, UserProfile, MarketAnalysisResult } from './types';
import * as GeminiService from './services/geminiService';

// --- ICONS ---
const IconBot = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 12.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5 4c-1.38 0-2.5-1.12-2.5-2.5h5c0 1.38-1.12 2.5-2.5 2.5zm3.5-4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>;
const IconLeaf = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM17.5 13c-.83 0-1.5-.67-1.5-1.5V11h-2v.5c0 .83-.67 1.5-1.5 1.5S11 12.33 11 11.5V11H9v.5c0 .83-.67 1.5-1.5 1.5S6 12.33 6 11.5V10c0-2.21 1.79-4 4-4h4c2.21 0 4 1.79 4 4v1.5c0 .83-.67 1.5-1.5 1.5z" /></svg>;
const IconChart = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" /></svg>;
const IconDroplet = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2C8.13 2 5 5.13 5 9c0 3.39 3.4 7.64 6.15 10.39.29.29.77.29 1.06 0C15.6 16.64 19 12.39 19 9c0-3.87-3.13-7-7-7zm0 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>;
const IconDashboard = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>;
const IconSend = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>;
const IconClear = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const IconUpload = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" /></svg>;
const IconCheckCircle = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>;
const IconAlert = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>;
const IconExternalLink = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-4.5 0V6.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125V15m-4.5-8.625 5.153 5.153" /></svg>;
const IconLogout = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>;
const IconExpand = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>;
const IconCollapse = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9V4.5M15 9h4.5M15 9l5.25-5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" /></svg>;
const IconQuote = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>;
const IconTwitter = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.81 1.91 3.58-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.7 2.14 2.94 4.03 2.97-1.47 1.15-3.32 1.83-5.33 1.83-.35 0-.69-.02-1.03-.06 1.9 1.23 4.16 1.95 6.56 1.95 7.88 0 12.2-6.52 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>;
const IconLinkedIn = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-11 5H5v11h3V8zm-1.5-2.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 2.5h-2.8c-.5 0-1 .4-1 .9V19h-3V8h3v1.9c.7-1.3 1.8-2.4 3.3-2.4 2.5 0 4.5 2 4.5 4.5V19h-3v-6.5c0-1.4-.6-2.5-1.5-2.5s-1.5 1.1-1.5 2.5V19z"/></svg>;
const IconSun = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" /></svg>;
const IconMoon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;
const IconUser = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const IconTrendingUp = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" /></svg>;
const IconLanguage = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.93 0 3.83.129 5.68.371m-5.68-.371v2.39c.096.136.24.308.44.525.317.353.751.732 1.28 1.133C12.08 10.608 13.5 12 13.5 12s1.42-1.392 2.78-2.722c.529-.401.963-.78 1.28-1.133.2-.217.344-.389.44-.525V5.25M3 5.621V3.75A.75.75 0 0 1 3.75 3h1.875c.621 0 1.125.504 1.125 1.125v1.371M21 5.621V3.75a.75.75 0 0 0-.75-.75h-1.875a1.125 1.125 0 0 0-1.125 1.125v1.371m0 0A47.999 47.999 0 0 1 12 4.5a47.999 47.999 0 0 1-9 1.121" /></svg>;
const IconGlobe = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9Zm8.716-6.747c-4.041-.02-7.69-3.369-7.716-7.747M3.284 14.253c4.041-.02 7.69-3.369 7.716-7.747M12 3c-2.485 0-4.5 4.03-4.5 9s2.015 9 4.5 9m0-18c2.485 0 4.5 4.03 4.5 9s-2.015 9-4.5 9" /></svg>;
const IconMicrophone = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>;
const IconMicrophoneSlash = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75 12 12m0 0 2.25 2.25M12 12l-2.25-2.25M12 12l2.25-2.25m-2.25 6.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>;


// --- CONTEXT & PROVIDERS ---
// Theme Context
type Theme = 'light' | 'dark';
interface ThemeContextType { theme: Theme; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Initialize theme from localStorage to prevent flicker on load
        try {
            const savedTheme = localStorage.getItem('agri_theme');
            if (savedTheme === 'light' || savedTheme === 'dark') {
                return savedTheme;
            }
        } catch (error) {
            console.warn('Could not read theme from localStorage.', error);
        }
        // Fallback to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Explicitly set the correct class on the <html> element
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }

        // Persist the theme choice in localStorage
        try {
            localStorage.setItem('agri_theme', theme);
        } catch (error) {
            console.warn('Could not save theme to localStorage.', error);
        }
    }, [theme]); // Re-run this effect whenever the theme state changes

    // Memoize the toggle function so it doesn't change on every render
    const toggleTheme = useCallback(() => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    // Memoize the context value to prevent unnecessary re-renders of consumer components
    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext)!;

// Language Context
type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh';
interface LanguageContextType { 
    language: Language; 
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}
const LanguageContext = createContext<LanguageContextType | null>(null);

// Simple translations object
const translations = {
    en: {
        // App and navigation
        'app.name': 'AgriAssist Pro',
        'app.tagline': 'Your Smart Farming Companion',
        'nav.assistant': 'AI Assistant',
        'nav.disease': 'Disease Detection',
        'nav.yield': 'Yield Prediction',
        'nav.market': 'Market Advisor',
        'nav.watering': 'Smart Watering',
        'nav.dashboard': 'User Dashboard',
        'nav.profile': 'Profile',
        'nav.logout': 'Logout',
        
        // Common actions
        'action.upload': 'Upload',
        'action.analyze': 'Analyze',
        'action.predict': 'Predict',
        'action.save': 'Save',
        'action.cancel': 'Cancel',
        'action.clear': 'Clear',
        'action.send': 'Send',
        'action.fullscreen': 'Fullscreen',
        'action.collapse': 'Collapse',
        'action.gotit': 'Got it!',
        'action.selectLanguage': 'Select Language',
        
        // AI Assistant
        'ai.title': 'AI Agricultural Assistant',
        'ai.subtitle': 'Your on-demand farming expert. Ask me anything.',
        'ai.placeholder': 'Ask about crops, soil, or anything farming-related...',
        'ai.suggestion1': 'Best fertilizer for corn?',
        'ai.suggestion2': 'How to treat tomato blight?',
        'ai.suggestion3': 'When is the best time to plant soybeans?',
        'ai.suggestion4': 'Improve soil quality',
        
        // Disease Detection
        'disease.title': 'Crop Disease Detection',
        'disease.subtitle': 'Upload an image of a plant leaf to identify potential diseases.',
        'disease.uploadPrompt': 'Upload an image to analyze',
        'disease.analyzing': 'Analyzing image...',
        'disease.disease': 'Disease',
        'disease.confidence': 'Confidence',
        'disease.description': 'Description',
        'disease.treatment': 'Treatment',
        'disease.prevention': 'Prevention',
        
        // Yield Prediction
        'yield.title': 'Yield Prediction',
        'yield.subtitle': 'Forecast crop yield based on your profile and selected crop.',
        'yield.selectCrop': 'Select Crop',
        'yield.location': 'Location',
        'yield.farmSize': 'Farm Size (acres)',
        'yield.soilType': 'Soil Type',
        'yield.predictedYield': 'Predicted Yield',
        'yield.regionalAverage': 'Regional Average',
        'yield.insights': 'Insights',
        
        // Smart Watering
        'water.title': 'Smart Watering System',
        'water.subtitle': 'Monitor soil moisture and get intelligent watering recommendations.',
        'water.currentMoisture': 'Current Soil Moisture',
        'water.threshold': 'Watering Threshold',
        'water.recommendation': 'Recommendation',
        'water.getAdvice': 'Get Watering Advice',
        
        // Market Advisor
        'market.title': 'Market Advisor',
        'market.subtitle': 'Get AI-powered market analysis and price forecasts for your crops.',
        'market.selectCrop': 'Select Crop for Analysis',
        'market.analyzing': 'Analyzing market data...',
        'market.sources': 'Sources',
        
        // Dashboard
        'dashboard.title': 'User Dashboard',
        'dashboard.subtitle': 'An overview of your activity and usage statistics.',
        'dashboard.recentActivity': 'Recent Activity',
        'dashboard.noActivity': 'No recent activity to display.',
        'dashboard.welcome': 'Welcome back',
        
        // Profile
        'profile.title': 'Your Profile',
        'profile.subtitle': 'Keep your farm and contact information up to date.',
        'profile.farmDetails': 'Farm Details',
        'profile.contactInfo': 'Contact Information',
        'profile.name': 'Name',
        'profile.email': 'Email',
        'profile.phone': 'Phone',
        'profile.acres': 'Farm Size (acres)',
        'profile.location': 'Location',
        'profile.soilType': 'Primary Soil Type',
        'profile.currentCrops': 'Currently Planted Crops',
        'profile.clay': 'Clay',
        'profile.sandy': 'Sandy',
        'profile.loam': 'Loam',
        'profile.silt': 'Silt',
        
        // Voice Assistant
        'voice.title': 'Voice Assistant',
        'voice.prompt': 'Click to start voice input',
        'voice.listening': 'Listening...',
        'voice.notSupported': 'Voice recognition not supported'
    },
    
    hi: {
        // App and navigation
        'app.name': 'एग्रीअसिस्ट प्रो',
        'app.tagline': 'आपका स्मार्ट खेती साथी',
        'nav.assistant': 'एआई सहायक',
        'nav.disease': 'रोग का पता लगाना',
        'nav.yield': 'उत्पादन पूर्वानुमान',
        'nav.market': 'बाजार सलाहकार',
        'nav.watering': 'स्मार्ट सिंचाई',
        'nav.dashboard': 'उपयोगकर्ता डैशबोर्ड',
        'nav.profile': 'प्रोफ़ाइल',
        'nav.logout': 'लॉग आउट',
        
        // Common actions
        'action.upload': 'अपलोड करें',
        'action.analyze': 'विश्लेषण करें',
        'action.predict': 'पूर्वानुमान लगाएं',
        'action.save': 'सेव करें',
        'action.cancel': 'रद्द करें',
        'action.clear': 'साफ करें',
        'action.send': 'भेजें',
        'action.fullscreen': 'पूर्ण स्क्रीन',
        'action.collapse': 'संक्षिप्त करें',
        'action.gotit': 'समझ गया!',
        'action.selectLanguage': 'भाषा चुनें',
        
        // AI Assistant
        'ai.title': 'एआई कृषि सहायक',
        'ai.subtitle': 'आपका मांग पर खेती विशेषज्ञ। मुझसे कुछ भी पूछें।',
        'ai.placeholder': 'फसल, मिट्टी, या खेती से संबंधित कुछ भी पूछें...',
        'ai.suggestion1': 'मक्का के लिए सबसे अच्छा उर्वरक?',
        'ai.suggestion2': 'टमाटर की झुलसाहट का इलाज कैसे करें?',
        'ai.suggestion3': 'सोयाबीन बोने का सबसे अच्छा समय कब है?',
        'ai.suggestion4': 'मिट्टी की गुणवत्ता में सुधार करें',
        
        // Disease Detection
        'disease.title': 'फसल रोग पहचान',
        'disease.subtitle': 'संभावित रोगों की पहचान के लिए पौधे की पत्ती की छवि अपलोड करें।',
        'disease.uploadPrompt': 'विश्लेषण के लिए छवि अपलोड करें',
        'disease.analyzing': 'छवि का विश्लेषण कर रहे हैं...',
        'disease.disease': 'रोग',
        'disease.confidence': 'विश्वास',
        'disease.description': 'विवरण',
        'disease.treatment': 'उपचार',
        'disease.prevention': 'रोकथाम',
        
        // Yield Prediction
        'yield.title': 'उत्पादन पूर्वानुमान',
        'yield.subtitle': 'आपकी प्रोफ़ाइल और चयनित फसल के आधार पर फसल उत्पादन का पूर्वानुमान।',
        'yield.selectCrop': 'फसल चुनें',
        'yield.location': 'स्थान',
        'yield.farmSize': 'खेत का आकार (एकड़)',
        'yield.soilType': 'मिट्टी का प्रकार',
        'yield.predictedYield': 'अनुमानित उत्पादन',
        'yield.regionalAverage': 'क्षेत्रीय औसत',
        'yield.insights': 'अंतर्दृष्टि',
        
        // Smart Watering
        'water.title': 'स्मार्ट सिंचाई प्रणाली',
        'water.subtitle': 'मिट्टी की नमी की निगरानी करें और बुद्धिमान सिंचाई सिफारिशें प्राप्त करें।',
        'water.currentMoisture': 'वर्तमान मिट्टी की नमी',
        'water.threshold': 'सिंचाई सीमा',
        'water.recommendation': 'सिफारिश',
        'water.getAdvice': 'सिंचाई सलाह प्राप्त करें',
        
        // Market Advisor
        'market.title': 'बाजार सलाहकार',
        'market.subtitle': 'अपनी फसलों के लिए एआई-संचालित बाजार विश्लेषण और मूल्य पूर्वानुमान प्राप्त करें।',
        'market.selectCrop': 'विश्लेषण के लिए फसल चुनें',
        'market.analyzing': 'बाजार डेटा का विश्लेषण कर रहे हैं...',
        'market.sources': 'स्रोत',
        
        // Dashboard
        'dashboard.title': 'उपयोगकर्ता डैशबोर्ड',
        'dashboard.subtitle': 'आपकी गतिविधि और उपयोग आंकड़ों का अवलोकन।',
        'dashboard.recentActivity': 'हालिया गतिविधि',
        'dashboard.noActivity': 'प्रदर्शित करने के लिए कोई हालिया गतिविधि नहीं।',
        'dashboard.welcome': 'वापसी पर स्वागत है',
        
        // Profile
        'profile.title': 'आपकी प्रोफ़ाइल',
        'profile.subtitle': 'अपने खेत और संपर्क जानकारी को अद्यतन रखें।',
        'profile.farmDetails': 'खेत विवरण',
        'profile.contactInfo': 'संपर्क जानकारी',
        'profile.name': 'नाम',
        'profile.email': 'ईमेल',
        'profile.phone': 'फोन',
        'profile.acres': 'खेत का आकार (एकड़)',
        'profile.location': 'स्थान',
        'profile.soilType': 'प्राथमिक मिट्टी प्रकार',
        'profile.currentCrops': 'वर्तमान में लगाई गई फसलें',
        'profile.clay': 'चिकनी मिट्टी',
        'profile.sandy': 'रेतीली मिट्टी',
        'profile.loam': 'दोमट मिट्टी',
        'profile.silt': 'गाद मिट्टी',
        
        // Voice Assistant
        'voice.title': 'ध्वनि सहायक',
        'voice.prompt': 'ध्वनि इनपुट शुरू करने के लिए क्लिक करें',
        'voice.listening': 'सुन रहे हैं...',
        'voice.notSupported': 'ध्वनि पहचान समर्थित नहीं है'
    },
    
    // Add basic structure for other Indian languages (we can expand these)
    bn: {
        'app.name': 'এগ্রিঅ্যাসিস্ট প্রো',
        'nav.assistant': 'AI সহায়ক',
        'nav.disease': 'রোগ সনাক্তকরণ',
        'nav.yield': 'ফলন পূর্বাভাস',
        'nav.market': 'বাজার উপদেষ্টা',
        'nav.watering': 'স্মার্ট সেচ',
        'nav.dashboard': 'ব্যবহারকারী ড্যাশবোর্ড',
        'nav.profile': 'প্রোফাইল',
        'nav.logout': 'লগ আউট',
        'action.fullscreen': 'পূর্ণ স্ক্রিন',
        'action.collapse': 'সংকুচিত'
    },
    
    ta: {
        'app.name': 'AgriAssist Pro',
        'nav.assistant': 'AI உதவியாளர்',
        'nav.disease': 'நோய் கண்டறிதல்',
        'nav.yield': 'விளைச்சல் முன்னறிவிப்பு',
        'nav.market': 'சந்தை ஆலோசகர்',
        'nav.watering': 'ஸ்மார்ட் நீர்ப்பாசனம்',
        'nav.dashboard': 'பயனர் டாஷ்போர்டு',
        'nav.profile': 'சுயவிவரம்',
        'nav.logout': 'வெளியேறு',
        'action.fullscreen': 'முழுத்திரை',
        'action.collapse': 'சுருக்கு'
    },
    
    te: {
        'app.name': 'AgriAssist Pro',
        'nav.assistant': 'AI సహాయకుడు',
        'nav.disease': 'వ్యాధి గుర్తింపు',
        'nav.yield': 'దిగుబడి అంచనా',
        'nav.market': 'మార్కెట్ సలహాదారు',
        'nav.watering': 'స్మార్ట్ నీటిపారుదల',
        'nav.dashboard': 'వినియోగదారు డాష్‌బోర్డ్',
        'nav.profile': 'ప్రొఫైల్',
        'nav.logout': 'లాగ్ అవుట్',
        'action.fullscreen': 'పూర్తి స్క్రీన్',
        'action.collapse': 'కుదించు'
    },
    
    mr: {
        'app.name': 'AgriAssist Pro',
        'nav.assistant': 'AI सहाय्यक',
        'nav.disease': 'रोग ओळख',
        'nav.yield': 'उत्पादन अंदाज',
        'nav.market': 'बाजार सल्लागार',
        'nav.watering': 'स्मार्ट पाणी',
        'nav.dashboard': 'वापरकर्ता डॅशबोर्ड',
        'nav.profile': 'प्रोफाइल',
        'nav.logout': 'लॉग आउट',
        'action.fullscreen': 'पूर्ण स्क्रीन',
        'action.collapse': 'संकुचित'
    },
    
    gu: {
        'app.name': 'AgriAssist Pro',
        'nav.assistant': 'AI સહાયક',
        'nav.disease': 'રોગ ઓળખ',
        'nav.yield': 'ઉત્પાદન આગાહી',
        'nav.market': 'બજાર સલાહકાર',
        'nav.watering': 'સ્માર્ટ પાણી',
        'nav.dashboard': 'વપરાશકર્તા ડેશબોર્ડ',
        'nav.profile': 'પ્રોફાઇલ',
        'nav.logout': 'લૉગ આઉટ',
        'action.fullscreen': 'પૂર્ણ સ્ક્રીન',
        'action.collapse': 'સંકુચિત'
    },
    
    kn: {
        'app.name': 'AgriAssist Pro',
        'nav.assistant': 'AI ಸಹಾಯಕ',
        'nav.disease': 'ರೋಗ ಪತ್ತೆ',
        'nav.yield': 'ಇಳುವರಿ ಮುನ್ಸೂಚನೆ',
        'nav.market': 'ಮಾರುಕಟ್ಟೆ ಸಲಹೆಗಾರ',
        'nav.watering': 'ಸ್ಮಾರ್ಟ್ ನೀರು',
        'nav.dashboard': 'ಬಳಕೆದಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        'nav.profile': 'ಪ್ರೊಫೈಲ್',
        'nav.logout': 'ಲಾಗ್ ಔಟ್',
        'action.fullscreen': 'ಪೂರ್ಣ ಪರದೆ',
        'action.collapse': 'ಸಂಕುಚಿತ'
    },
    
    ml: {
        'app.name': 'AgriAssist Pro',
        'nav.assistant': 'AI സഹായി',
        'nav.disease': 'രോഗ കണ്ടെത്തൽ',
        'nav.yield': 'വിളവ് പ്രവചനം',
        'nav.market': 'മാർക്കറ്റ് ഉപദേശകൻ',
        'nav.watering': 'സ്മാർട്ട് വെള്ളം',
        'nav.dashboard': 'ഉപയോക്താവ് ഡാഷ്ബോർഡ്',
        'nav.profile': 'പ്രൊഫൈൽ',
        'nav.logout': 'ലോഗ് ഔട്ട്',
        'action.fullscreen': 'പൂർണ്ണ സ്ക്രീൻ',
        'action.collapse': 'ചുരുക്കുക'
    },
    
    pa: {
        'app.name': 'AgriAssist Pro',
        'nav.assistant': 'AI ਸਹਾਇਕ',
        'nav.disease': 'ਬਿਮਾਰੀ ਪਛਾਣ',
        'nav.yield': 'ਪੈਦਾਵਾਰ ਪੂਰਵ-ਅਨੁਮਾਨ',
        'nav.market': 'ਮਾਰਕੀਟ ਸਲਾਹਕਾਰ',
        'nav.watering': 'ਸਮਾਰਟ ਪਾਣੀ',
        'nav.dashboard': 'ਉਪਭੋਗਤਾ ਡੈਸ਼ਬੋਰਡ',
        'nav.profile': 'ਪ੍ਰੋਫਾਈਲ',
        'nav.logout': 'ਲਾਗ ਆਉਟ',
        'action.fullscreen': 'ਪੂਰੀ ਸਕਰੀਨ',
        'action.collapse': 'ਸੁੰਗੜੋ'
    }
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        try {
            const saved = localStorage.getItem('agri_language');
            if (saved && Object.keys(translations).includes(saved)) {
                return saved as Language;
            }
        } catch (error) {
            console.warn('Could not read language from localStorage.', error);
        }
        // Fallback to browser language or English
        const browserLang = navigator.language.split('-')[0];
        return Object.keys(translations).includes(browserLang) ? browserLang as Language : 'en';
    });

    useEffect(() => {
        try {
            localStorage.setItem('agri_language', language);
        } catch (error) {
            console.warn('Could not save language to localStorage.', error);
        }
    }, [language]);

    const t = (key: string): string => {
        return translations[language][key] || translations.en[key] || key;
    };

    const value = useMemo(() => ({ language, setLanguage, t }), [language]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext)!;

// Clerk will provide authentication state; local AuthContext removed in favor of Clerk

// Activity Context
interface ActivityContextType { activities: RecentActivity[]; addActivity: (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => void; }
const ActivityContext = createContext<ActivityContextType | null>(null);
const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activities, setActivities] = useState<RecentActivity[]>(() => {
        const saved = localStorage.getItem('agri_activities');
        return saved ? JSON.parse(saved) : [];
    });
    useEffect(() => { localStorage.setItem('agri_activities', JSON.stringify(activities)); }, [activities]);
    
    const addActivity = (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => {
        const newActivity: RecentActivity = {
            ...activity,
            id: Date.now(),
            timestamp: new Date().toLocaleString()
        };
        setActivities(prev => [newActivity, ...prev].slice(0, 10)); // Keep last 10
    };
    return <ActivityContext.Provider value={{ activities, addActivity }}>{children}</ActivityContext.Provider>;
};
export const useActivity = () => useContext(ActivityContext)!;

// Chat Context
interface ChatContextType { messages: ChatMessage[]; sendMessage: (messageText: string) => Promise<void>; isLoading: boolean; clearMessages: () => void; }
const ChatContext = createContext<ChatContextType | null>(null);
const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language } = useLanguage();
    
    // Welcome messages in different languages
    const welcomeMessages: Record<string, string> = {
        'en': 'Hello! I am AgriAssist Pro. How can I help you with your farming needs today?',
        'hi': 'नमस्ते! मैं AgriAssist Pro हूं। आज मैं आपकी खेती की जरूरतों में कैसे मदद कर सकता हूं?',
        'bn': 'হ্যালো! আমি AgriAssist Pro। আজ আপনার কৃষি প্রয়োজনে আমি কিভাবে সাহায্য করতে পারি?',
        'ta': 'வணக்கம்! நான் AgriAssist Pro. இன்று உங்கள் விவசாய தேவைகளில் நான் எப்படி உதவ முடியும்?',
        'te': 'హలో! నేను AgriAssist Pro. ఈరోజు మీ వ్యవసాయ అవసరాలలో నేను ఎలా సహాయం చేయగలను?',
        'mr': 'नमस्कार! मी AgriAssist Pro आहे। आज मी तुमच्या शेतीच्या गरजांमध्ये कशी मदत करू शकतो?',
        'gu': 'હેલો! હું AgriAssist Pro છું। આજે તમારી ખેતીની જરૂરિયાતોમાં હું કેવી રીતે મદદ કરી શકું?',
        'kn': 'ಹಲೋ! ನಾನು AgriAssist Pro. ಇಂದು ನಿಮ್ಮ ಕೃಷಿ ಅಗತ್ಯಗಳಲ್ಲಿ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
        'ml': 'ഹലോ! ഞാൻ AgriAssist Pro ആണ്. ഇന്ന് നിങ്ങളുടെ കാർഷിക ആവശ്യങ്ങളിൽ എനിക്ക് എങ്ങനെ സഹായിക്കാം?',
        'pa': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ AgriAssist Pro ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀਆਂ ਖੇਤੀ ਦੀਆਂ ਲੋੜਾਂ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?'
    };
    
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = sessionStorage.getItem('agri_chat');
        return saved ? JSON.parse(saved) : [{ role: 'model', text: welcomeMessages[language] || welcomeMessages['en'] }];
    });
    const [isLoading, setIsLoading] = useState(false);
    const { addActivity } = useActivity();
    const { profile } = useProfile();
    const { user } = useUser();

    useEffect(() => { sessionStorage.setItem('agri_chat', JSON.stringify(messages)); }, [messages]);
    
    // Reset chat when language changes and update welcome message
    useEffect(() => {
        GeminiService.resetChat();
        setMessages([{ role: 'model', text: welcomeMessages[language] || welcomeMessages['en'] }]);
    }, [language]);

    const saveChatMessageToSupabase = async (role: string, content: string) => {
        if (!user) {
            console.log('No user logged in, skipping Supabase save');
            return;
        }
        try {
            console.log('Attempting to save message to Supabase...', { role, content: content.substring(0, 50) + '...', userId: user.id });
            const mod = await import('./services/supabaseClient');
            const { supabase } = mod as typeof import('./services/supabaseClient');
            
            const messageData = {
                user_id: user.id,
                conversation_id: null, // Could add session ID here if needed
                role,
                content,
                metadata: {},
                created_at: new Date().toISOString()
            };
            
            console.log('Message data to insert:', messageData);
            
            const { data, error } = await supabase.from('chat_messages').insert([messageData]);
            
            if (error) {
                console.error('❌ Supabase save error:', error);
                console.error('Error details:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                
                // If it's an RLS error, show a notification to the user
                if (error.code === '42501') {
                    console.warn('🔒 Row Level Security is preventing data save. Please check Supabase RLS policies.');
                }
            } else {
                console.log('✅ Message saved successfully to Supabase:', data);
            }
        } catch (err) {
            console.error('❌ Failed to save chat message to Supabase:', err);
        }
    };

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;
        
        addActivity({ icon: 'chat', description: `Asked AI: "${messageText.substring(0, 30)}..."` });
        const newMessages: ChatMessage[] = [...messages, { role: 'user', text: messageText }];
        setMessages(newMessages);
        setIsLoading(true);

        // Save user message to Supabase
        await saveChatMessageToSupabase('user', messageText);

        try {
            const stream = GeminiService.streamChatResponse(messageText, profile, language);
            let fullResponse = "";
            const responseMessage: ChatMessage = { role: 'model', text: '' };
            setMessages([...newMessages, responseMessage]);

            for await (const chunk of stream) {
                fullResponse += chunk;
                setMessages(prev => {
                    const updatedMessages = [...prev];
                    updatedMessages[updatedMessages.length - 1] = { ...responseMessage, text: fullResponse };
                    return updatedMessages;
                });
            }

            // Save assistant response to Supabase
            if (fullResponse) {
                await saveChatMessageToSupabase('model', fullResponse);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearMessages = () => {
        setMessages([{ role: 'model', text: 'Hello! I am AgriAssist Pro. How can I help you with your farming needs today?' }]);
    };

    return <ChatContext.Provider value={{ messages, sendMessage, isLoading, clearMessages }}>{children}</ChatContext.Provider>;
};
export const useChat = () => useContext(ChatContext)!;

// Profile Context
interface ProfileContextType { profile: UserProfile; updateProfile: (newProfile: UserProfile) => void; }
const ProfileContext = createContext<ProfileContextType | null>(null);
const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const supabaseClientImport = async () => await import('./services/supabaseClient');

    const [profile, setProfile] = useState<UserProfile>(() => {
        const saved = localStorage.getItem('agri_profile');
        return saved ? JSON.parse(saved) : {
            name: 'John Farmer',
            email: 'john.farmer@example.com',
            contact: '',
            acres: '',
            location: '',
            currentCrops: '',
            soilType: 'loamy'
        };
    });

    // Load profile from Supabase when user becomes available
    useEffect(() => {
        let mounted = true;
        if (!user) return;
        (async () => {
            try {
                const mod = await supabaseClientImport();
                const { supabase } = mod as typeof import('./services/supabaseClient');
                const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (error && !data) {
                    // If no row exists, create one using Clerk metadata
                    const clerkName = (user as any)?.fullName || `${(user as any)?.firstName || ''} ${(user as any)?.lastName || ''}`.trim() || undefined;
                    const clerkEmail = (user as any)?.primaryEmailAddress?.emailAddress || (user as any)?.emailAddresses?.[0]?.emailAddress || (user as any)?.email || undefined;
                    const payload: any = { id: user.id };
                    if (clerkName) payload.name = clerkName;
                    if (clerkEmail) payload.email = clerkEmail;
                    try {
                        const up = await supabase.from('profiles').upsert(payload);
                        if (up.error) console.warn('Failed to create profile in supabase', up.error);
                    } catch (upErr) {
                        console.warn('Supabase upsert failed', upErr);
                    }
                    // Set local profile using clerk metadata if available
                    if (mounted) {
                        setProfile(prev => ({ ...prev, ...(clerkName ? { name: clerkName } : {}), ...(clerkEmail ? { email: clerkEmail } : {}) } as any));
                        try { localStorage.setItem('agri_profile', JSON.stringify({ ...profile, ...(clerkName ? { name: clerkName } : {}), ...(clerkEmail ? { email: clerkEmail } : {}) })); } catch (_) {}
                    }
                } else if (data && mounted) {
                    // Merge existing DB row into local profile, mapping field names
                    const mappedData = {
                        name: data.name,
                        email: data.email,
                        contact: data.contact,
                        acres: data.acres,
                        location: data.location,
                        currentCrops: data.currentcrops || '', // Map from DB field name
                        soilType: data.soiltype || 'loamy' // Map from DB field name
                    };
                    setProfile(prev => ({ ...prev, ...mappedData }));
                    try { localStorage.setItem('agri_profile', JSON.stringify({ ...profile, ...mappedData })); } catch (_) {}
                    // If DB row exists but missing name/email, fill from Clerk metadata
                    const clerkName = (user as any)?.fullName || `${(user as any)?.firstName || ''} ${(user as any)?.lastName || ''}`.trim() || undefined;
                    const clerkEmail = (user as any)?.primaryEmailAddress?.emailAddress || (user as any)?.emailAddresses?.[0]?.emailAddress || (user as any)?.email || undefined;
                    const needsUpdate: any = {};
                    if (clerkName && !data.name) needsUpdate.name = clerkName;
                    if (clerkEmail && !data.email) needsUpdate.email = clerkEmail;
                    if (Object.keys(needsUpdate).length) {
                        try {
                            const payload = { id: user.id, ...needsUpdate };
                            const up = await supabase.from('profiles').upsert(payload);
                            if (up.error) console.warn('Failed to update profile with clerk metadata', up.error);
                        } catch (upErr) {
                            console.warn('Supabase upsert failed', upErr);
                        }
                    }
                }
            } catch (err) {
                console.warn('Supabase client import failed', err);
            }
        })();
        return () => { mounted = false; };
    }, [user]);

    useEffect(() => { localStorage.setItem('agri_profile', JSON.stringify(profile)); }, [profile]);
    
    const updateProfile = async (newProfile: UserProfile) => {
        setProfile(newProfile);
        // Persist to Supabase if user is signed in
        if (!user) {
            console.log('No user logged in, skipping Supabase profile save');
            return;
        }
        try {
            console.log('Attempting to save profile to Supabase...', { userId: user.id, profile: newProfile });
            const mod = await supabaseClientImport();
            const { supabase } = mod as typeof import('./services/supabaseClient');
            
            // Map the profile fields to match Supabase schema
            const payload = { 
                id: user.id, 
                name: newProfile.name,
                email: newProfile.email,
                contact: newProfile.contact,
                acres: newProfile.acres,
                location: newProfile.location,
                currentcrops: newProfile.currentCrops, // Map to schema field name
                soiltype: newProfile.soilType, // Map to schema field name
                updated_at: new Date().toISOString()
            };
            
            console.log('Profile data to upsert:', payload);
            
            // Upsert into profiles table
            const { data, error } = await supabase.from('profiles').upsert(payload);
            if (error) {
                console.error('❌ Supabase profile save error:', error);
                console.error('Error details:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                
                if (error.code === '42501') {
                    console.warn('🔒 Row Level Security is preventing profile save. Please check Supabase RLS policies.');
                }
            } else {
                console.log('✅ Profile saved successfully to Supabase:', data);
            }
        } catch (err) {
            console.error('❌ Supabase client import failed:', err);
        }
    };
    return <ProfileContext.Provider value={{ profile, updateProfile }}>{children}</ProfileContext.Provider>;
};
export const useProfile = () => useContext(ProfileContext)!;


// --- UI COMPONENTS ---
const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent<HTMLDivElement>) => void }> = ({ children, className, onClick }) => (
    <div onClick={onClick} className={`bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-lg ${className}`}>
        {children}
    </div>
);
const Button: React.FC<{ children: React.ReactNode, onClick?: () => void, className?: string, type?: "button" | "submit" | "reset", disabled?: boolean }> = ({ children, onClick, className, type = "button", disabled }) => (
    <button type={type} onClick={onClick} disabled={disabled} className={`bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-500 transition-all duration-300 flex items-center justify-center gap-2 ${className} disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed`}>
        {children}
    </button>
);
const ToolHeader: React.FC<{ icon: React.ReactNode, title: string, subtitle: string, children?: React.ReactNode }> = ({ icon, title, subtitle, children }) => (
    <div className="mb-8 flex justify-between items-start">
        <div>
                <div className="flex items-center gap-4 mb-2">
                <div className="text-emerald-400">{icon}</div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        <div>{children}</div>
    </div>
);
const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors duration-300 ${className} text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800`} aria-label="Toggle theme">
            {theme === 'light' ? <IconMoon className="w-5 h-5" /> : <IconSun className="w-5 h-5" />}
        </button>
    );
};

const LanguageToggle: React.FC<{ className?: string }> = ({ className }) => {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇮🇳' },
        { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
        { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
        { code: 'te', name: 'తెలుగు', flag: 'IN' },
        { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
        { code: 'gu', name: 'ગુજરાતી', flag: 'IN' },
        { code: 'kn', name: 'ಕನ್ನಡ', flag: 'IN' },
        { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
        { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: 'IN' }
    ] as const;

    const currentLang = languages.find(lang => lang.code === language) || languages[0];

    const handleLanguageChange = (langCode: Language) => {
        setLanguage(langCode);
        setIsOpen(false);
        
        // Use the existing Google Translate element from the HTML
        setTimeout(() => {
            try {
                const translateSelect = document.querySelector('#page-translator select') as HTMLSelectElement;
                if (translateSelect) {
                    // Map our language codes to Google Translate codes
                    const langMap: Record<string, string> = {
                        'en': 'en',
                        'hi': 'hi', 
                        'bn': 'bn',
                        'ta': 'ta',
                        'te': 'te',
                        'mr': 'mr',
                        'gu': 'gu',
                        'kn': 'kn',
                        'ml': 'ml',
                        'pa': 'pa'
                    };
                    
                    const translateCode = langMap[langCode] || 'en';
                    translateSelect.value = translateCode;
                    translateSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    // Also update our internal translations
                    document.title = t('appName') || 'AgriAssist Pro';
                } else {
                    console.log('Google Translate not available, using internal translations');
                    // Fallback to internal translations
                    document.title = t('appName') || 'AgriAssist Pro';
                }
            } catch (error) {
                console.error('Translation error:', error);
                // Fallback to internal translations
                document.title = t('appName') || 'AgriAssist Pro';
            }
        }, 200);
    };

    return (
        <div className={`relative ${className}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-300 text-black dark:text-black hover:bg-white dark:hover:bg-slate-800 hover:shadow-md flex items-center gap-2"
                aria-label="Change language"
                title={t('action.selectLanguage')}
            >
                <IconGlobe className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
            </button>
            
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-slate-200 rounded-lg shadow-xl py-2 min-w-[180px] backdrop-blur-sm">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code as Language)}
                                className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-slate-100 transition-colors duration-200 ${
                                    language === lang.code 
                                        ? 'bg-emerald-50 text-black' 
                                        : 'text-black'
                                }`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <div className="flex flex-col">
                                    <span className="font-medium">{lang.name}</span>
                                    <span className="text-xs opacity-60">{lang.code.toUpperCase()}</span>
                                </div>
                                {language === lang.code && (
                                    <IconCheckCircle className="w-4 h-4 ml-auto text-emerald-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const VoiceToggle: React.FC<{ className?: string }> = ({ className }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Check if speech recognition is supported
        setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    }, []);

    const handleVoiceToggle = () => {
        if (!isSupported) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        if (isListening) {
            // Stop listening (dummy implementation)
            setIsListening(false);
            console.log('Voice recognition stopped');
        } else {
            // Start listening (dummy implementation)
            setIsListening(true);
            console.log('Voice recognition started');
            
            // Simulate stopping after 3 seconds for demo
            setTimeout(() => {
                setIsListening(false);
                console.log('Voice recognition auto-stopped');
                // Here you would process the speech result
                alert('Voice feature is coming soon! This is a demo button.');
            }, 3000);
        }
    };

    return (
        <button 
            onClick={handleVoiceToggle}
            className={`p-2 rounded-full transition-all duration-300 ${className} ${
                isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            disabled={!isSupported}
        >
            {isListening ? (
                <IconMicrophoneSlash className="w-5 h-5" />
            ) : (
                <IconMicrophone className="w-5 h-5" />
            )}
        </button>
    );
};
// LanguageTranslator removed per request.

// --- AUTH & ROUTING ---
const ProtectedRoute: React.FC = () => {
    // Use Clerk's SignedIn/SignedOut components to gate routes
    return (
        <>
            <SignedIn>
                <Outlet />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
};
// Login UI is provided by Clerk's <SignIn /> component at /sign-in


// --- TOOLS PAGE LAYOUT ---
const ToolsPage: React.FC = () => {
    const location = useLocation();
    const clerk = useClerk();
    const { t } = useLanguage();

    const tools = [
        { name: t('nav.assistant'), path: '/tools/assistant', icon: <IconBot /> },
        { name: t('nav.disease'), path: '/tools/disease-detection', icon: <IconLeaf /> },
        { name: t('nav.yield'), path: '/tools/yield-prediction', icon: <IconChart /> },
        { name: t('nav.market'), path: '/tools/market-advisor', icon: <IconTrendingUp /> },
        { name: t('nav.watering'), path: '/tools/watering', icon: <IconDroplet /> },
        { name: t('nav.dashboard'), path: '/tools/dashboard', icon: <IconDashboard /> },
    ];
    const profileTool = { name: t('nav.profile'), path: '/tools/profile', icon: <IconUser /> };
    const allToolsForMobile = [...tools, profileTool];

    return (
        <div className="tools-area flex flex-col md:flex-row h-screen bg-transparent overflow-hidden">
            <aside className="hidden md:flex bg-white/80 dark:bg-slate-950/50 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 md:w-64 flex-shrink-0 flex flex-col">
                <div className="p-4 hidden md:block">
                    <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <IconLeaf className="text-emerald-400 w-8 h-8" />
                        <span>{t('app.name')}</span>
                    </Link>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    {/* mobile nav moved below so the aside doesn't occupy full screen on small devices */}
                    <nav className="hidden md:block p-4">
                        <ul>
                            {tools.map(tool => (
                                <li key={tool.name}>
                                    <Link to={tool.path} className={`flex items-center gap-3 py-3 px-4 rounded-lg mb-2 transition-colors duration-200 ${location.pathname.startsWith(tool.path) ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                                        {tool.icon}
                                        {tool.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {/* Voice Toggle Section */}
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Voice Assistant</span>
                                <VoiceToggle />
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500">Click to start voice input</p>
                        </div>
                    </nav>
                    <nav className="hidden md:block p-4">
                         <ul>
                            <li>
                                <Link to={profileTool.path} className={`flex items-center gap-3 py-3 px-4 rounded-lg mb-2 transition-colors duration-200 ${location.pathname.startsWith(profileTool.path) ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                                    {profileTool.icon}
                                    {t('nav.profile')}
                                </Link>
                            </li>
                        </ul>
                        {/* Language moved to top-right; keep sidebar clean to avoid duplicate widgets */}
                    </nav>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <button onClick={() => clerk.signOut()} className="flex items-center gap-3 py-2 px-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-800/50 dark:hover:text-red-300 transition-colors duration-200">
                        <IconLogout className="w-5 h-5"/>
                        <span className="text-sm font-medium hidden md:inline">{t('nav.logout')}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </div>
            </aside>

            {/* Mobile bottom nav: visible only on small screens (fixed) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-around items-center gap-2 overflow-x-auto px-2 py-2 max-w-full">
                    {allToolsForMobile.map(tool => (
                        <Link
                            key={tool.name}
                            to={tool.path}
                            className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-full p-1 transition-colors duration-200 ${location.pathname.startsWith(tool.path) ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                            title={tool.name}
                        >
                            <div className="w-6 h-6 flex items-center justify-center">{tool.icon}</div>
                            {/* small label for accessibility, hidden on very small screens */}
                            <span className="mt-1 text-[10px] truncate w-16 hidden xs:inline-block sm:hidden">{tool.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative pb-20 md:pb-0">
                <Outlet />
            </main>
        </div>
    );
};


// --- AI ASSISTANT (CHAT COMPONENT) ---
const ChatInterface: React.FC<{ isFullScreen: boolean }> = ({ isFullScreen }) => {
    const { messages, sendMessage, isLoading, clearMessages } = useChat();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    useEffect(() => {
        // Scroll to bottom when messages update
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Helper: convert rgb(...) to hex like #f1f5f9
        const rgbToHex = (rgb: string) => {
            if (!rgb) return '';
            const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!m) return '';
            const r = parseInt(m[1], 10);
            const g = parseInt(m[2], 10);
            const b = parseInt(m[3], 10);
            return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        };

        // If any chat bubble has background #f1f5f9, ensure text is black for readability
        try {
            const bubbles = document.querySelectorAll<HTMLElement>('.chat-bubble');
            bubbles.forEach(b => {
                const bg = getComputedStyle(b).backgroundColor;
                const hex = rgbToHex(bg).toLowerCase();
                if (hex === '#f1f5f9') {
                    b.classList.add('text-black');
                } else {
                    // If it was previously forced, remove to preserve normal theming
                    // but only remove if it was added by this logic (we can't easily track origin),
                    // so keep safe: don't remove automatically to avoid flicker
                }
            });
        } catch (err) {
            // noop
        }
    }, [messages]);

    const handleSendMessage = async (e?: FormEvent, suggestion?: string) => {
        e?.preventDefault();
        const userMessage = suggestion || input;
        if (userMessage.trim()) {
            sendMessage(userMessage);
            setInput('');
        }
    };

    const suggestionChips = [t('ai.suggestion1'), t('ai.suggestion2'), t('ai.suggestion3'), t('ai.suggestion4')];

    const chatBody = (
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center"><IconBot className="w-5 h-5 text-white" /></div>}
                    <div className={`chat-bubble max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-emerald-600 dark:bg-emerald-700 text-black dark:text-white' : 'bg-slate-200 dark:bg-slate-700 text-black dark:text-white'}`}>
                         {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                            <div
                                className="prose prose-slate prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }}
                            />
                        )}
                    </div>
                </div>
            ))}
            {isLoading && messages[messages.length - 1].role === 'user' && (
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center"><IconBot className="w-5 h-5 text-white" /></div>
                    <div className={`chat-bubble max-w-xl p-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-black dark:text-white flex items-center gap-2`}>
                        <div className="w-2 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );

    const chatInput = (
         <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800">
            <div className="flex gap-2 overflow-x-auto mb-3 pb-2">
                {suggestionChips.map(s => (
                    <button key={s} onClick={() => handleSendMessage(undefined, s)} className="flex-shrink-0 bg-slate-200 text-sm text-slate-600 py-1 px-3 rounded-full hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors">
                        {s}
                    </button>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('ai.placeholder')} className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none" disabled={isLoading} />
                <Button onClick={clearMessages} className="p-3 bg-slate-500 hover:bg-slate-600" disabled={isLoading}>
                    <IconClear className="w-6 h-6"/>
                </Button>
                <Button type="submit" className="p-3" disabled={isLoading}><IconSend className="w-6 h-6"/></Button>
            </form>
        </div>
    );

    if (isFullScreen) {
        return <div className="h-full flex flex-col bg-white dark:bg-slate-800">{chatBody}{chatInput}</div>;
    }
    return <div className="h-full flex flex-col bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">{chatBody}{chatInput}</div>;
};

const AIAssistant: React.FC = () => {
    const [showModal, setShowModal] = useState(() => !sessionStorage.getItem('agri_assistant_modal_seen'));
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleModalClose = () => {
        setShowModal(false);
        sessionStorage.setItem('agri_assistant_modal_seen', 'true');
    };

    return (
        <div className="h-full flex flex-col">
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={handleModalClose}>
                    <Card className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><IconBot /> AI Assistant Capabilities</h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                            <li>Instant answers on crop diseases and treatments.</li>
                            <li>Advice on soil management and fertilization.</li>
                            <li>Guidance on planting schedules and techniques.</li>
                        </ul>
                        <Button onClick={handleModalClose} className="mt-6 w-full">Got it!</Button>
                    </Card>
                </div>
            )}
            <ToolHeader icon={<IconBot className="w-10 h-10" />} title={t('ai.title')} subtitle={t('ai.subtitle')}>
                <div className="flex items-center gap-3">
                    <LanguageToggle />
                    <Button onClick={() => navigate('/tools/assistant/fullscreen')} className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white">
                        <IconExpand /> {t('action.fullscreen')}
                    </Button>
                </div>
            </ToolHeader>
            <ChatInterface isFullScreen={false} />
        </div>
    );
};

const AIAssistantFullScreen: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    return (
        <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
             <header className="p-4 bg-white/80 dark:bg-slate-950/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h1 className="text-xl font-bold flex items-center gap-2"><IconBot/> {t('nav.assistant')}</h1>
                <div className="flex items-center gap-3">
                    <LanguageToggle />
                    <Button onClick={() => navigate('/tools/assistant')} className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white">
                        <IconCollapse /> {t('action.collapse')}
                    </Button>
                </div>
            </header>
            <main className="flex-1 overflow-hidden">
                <ChatInterface isFullScreen={true} />
            </main>
        </div>
    );
}

// --- DISEASE DETECTION ---
const DiseaseDetection: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [usingCamera, setUsingCamera] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [result, setResult] = useState<DiseaseAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addActivity } = useActivity();
    const { user } = useUser();

    const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { setError("File size cannot exceed 10MB."); return; }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const startCamera = async () => {
        if (usingCamera) return;
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
            setStream(s);
            setUsingCamera(true);
            if (videoRef.current) videoRef.current.srcObject = s;
        } catch (err) {
            console.error('Camera error', err);
            setUsingCamera(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
        setUsingCamera(false);
    };

    const captureFromCamera = async () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob: Blob | null = await new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/jpeg', 0.92));
        if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            // stop camera after capture for privacy
            stopCamera();
        }
    };
    
    const handleAnalyze = async () => {
        if (!imageFile) { setError("Please upload an image first."); return; }
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const base64Image = await fileToBase64(imageFile);
            const analysis = await GeminiService.analyzeCropDisease(base64Image, imageFile.type);
            setResult(analysis);
            addActivity({ icon: 'disease', description: `Analyzed plant for ${analysis.disease}.` });
            
            // Save to Supabase
            if (user) {
                await saveDiseaseAnalysisToSupabase(analysis);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to analyze image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const saveDiseaseAnalysisToSupabase = async (analysisResult: any) => {
        try {
            console.log('Saving disease analysis to Supabase...', { userId: user!.id, analysis: analysisResult });
            const { default: supabase } = await import('./services/supabaseClient');

            const { data, error } = await supabase
                .from('analyses')
                .insert({
                    user_id: user!.id,
                    result: analysisResult,
                    disease: analysisResult.disease,
                    confidence: analysisResult.confidence,
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('❌ Error saving analysis to Supabase:', error);
            } else {
                console.log('✅ Disease analysis saved successfully:', data);
            }
        } catch (error) {
            console.error('❌ Error connecting to Supabase:', error);
        }
    };

    return (
        <div>
            <ToolHeader icon={<IconLeaf className="w-10 h-10" />} title="Crop Disease Detection" subtitle="Upload an image of a plant leaf to identify potential diseases." />
            <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-xl font-bold mb-4">1. Upload Image</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="imageUpload" className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">Upload Image (Max 10MB)</label>
                            <input id="imageUpload" type="file" accept="image/jpeg, image/png" onChange={handleFileChange} className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500" />
                            <div className="mt-3 flex items-center gap-2">
                                <button type="button" onClick={usingCamera ? stopCamera : startCamera} className="px-3 py-2 bg-emerald-600 text-white rounded-md">{usingCamera ? 'Stop Camera' : 'Use Camera'}</button>
                                {usingCamera && <button type="button" onClick={captureFromCamera} className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-md">Capture</button>}
                            </div>
                            {usingCamera && <div className="mt-3">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg border" style={{ maxHeight: 360 }} />
                            </div>}
                        </div>
                        {imagePreview && <img src={imagePreview} alt="Crop preview" className="mt-4 rounded-lg max-h-60 w-auto mx-auto" />}
                        <Button onClick={handleAnalyze} disabled={isLoading || !imageFile} className="w-full mt-4">
                            {isLoading ? 'Analyzing...' : <><IconLeaf /> Analyze Image</>}
                        </Button>
                        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    </div>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4">2. Analysis Results</h2>
                    {isLoading && <div className="text-center p-8">Loading analysis...</div>}
                    {!isLoading && !result && <div className="text-center p-8 text-slate-400 dark:text-slate-500">Results will appear here.</div>}
                    {result && (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{result.disease}</h3>
                            <p><span className="font-semibold">Confidence:</span> {result.confidence.toFixed(1)}%</p>
                            <p><span className="font-semibold">Description:</span> {result.description}</p>
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Treatment Plan</h4>
                                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">{result.treatment.map((t, i) => <li key={i}>{t}</li>)}</ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg mb-2">Prevention Strategies</h4>
                                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">{result.prevention.map((p, i) => <li key={i}>{p}</li>)}</ul>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

// --- YIELD PREDICTION ---
const YieldPrediction: React.FC = () => {
    const [crop, setCrop] = useState('corn');
    const [result, setResult] = useState<YieldPredictionResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addActivity } = useActivity();
    const { theme } = useTheme();
    const { profile } = useProfile();
    const { user } = useUser();
    const navigate = useNavigate();

    const handlePredict = async () => {
        if (!profile.acres || !profile.location || !profile.soilType) {
            setError("Please complete your profile (acres, location, soil type) to get a prediction.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const params: YieldPredictionParams = {
                crop,
                acres: profile.acres,
                location: profile.location,
                soilType: profile.soilType,
            };
            const prediction = await GeminiService.predictYield(params);
            setResult(prediction);
            addActivity({ icon: 'yield', description: `Predicted ${crop} yield: ${prediction.predictedYield} T/ha.` });
            
            // Save to Supabase
            if (user) {
                await saveYieldPredictionToSupabase(params, prediction);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to get prediction. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const saveYieldPredictionToSupabase = async (params: YieldPredictionParams, prediction: any) => {
        try {
            console.log('Saving yield prediction to Supabase...', { userId: user!.id, params, prediction });
            const { default: supabase } = await import('./services/supabaseClient');

            const { data, error } = await supabase
                .from('yield_predictions')
                .insert({
                    user_id: user!.id,
                    params: params,
                    result: prediction,
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('❌ Error saving yield prediction to Supabase:', error);
            } else {
                console.log('✅ Yield prediction saved successfully:', data);
            }
        } catch (error) {
            console.error('❌ Error connecting to Supabase:', error);
        }
    };
    
    const chartData = result ? [{ name: 'Yield', 'Your Farm (T/ha)': result.predictedYield, 'Regional Average (T/ha)': result.regionalAverage }] : [];
    const axisColor = theme === 'light' ? '#334155' : '#94a3b8';
    const gridColor = theme === 'light' ? '#e2e8f0' : '#475569';
    const tooltipStyle = { backgroundColor: theme === 'light' ? '#ffffff' : '#1e293b', border: `1px solid ${theme === 'light' ? '#cbd5e1' : '#334155'}` };

    return (
        <div>
            <ToolHeader icon={<IconChart className="w-10 h-10" />} title="Yield Prediction" subtitle="Forecast crop yield based on your profile and selected crop." />
            <div className="grid lg:grid-cols-5 gap-8">
                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Prediction Parameters</h2>
                    <div className="space-y-4">
                        <FormField label="Crop Type" name="crop" value={crop} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCrop(e.target.value)} type="select" options={["corn", "wheat", "rice", "soybean", "potato"]} />
                         <div className="text-sm p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                           <p className="font-semibold">Using data from your profile:</p>
                           <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
                               <li>Location: {profile.location || "Not set"}</li>
                               <li>Land Area: {profile.acres ? `${profile.acres} acres` : "Not set"}</li>
                               <li>Soil Type: {profile.soilType ? profile.soilType.charAt(0).toUpperCase() + profile.soilType.slice(1) : "Not set"}</li>
                           </ul>
                           <button onClick={() => navigate('/tools/profile')} className="text-emerald-600 dark:text-emerald-400 hover:underline mt-2 text-xs font-bold">Update Profile</button>
                        </div>
                        <Button onClick={handlePredict} disabled={isLoading} className="w-full mt-4">
                            {isLoading ? 'Calculating...' : <><IconChart /> Predict Yield</>}
                        </Button>
                        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    </div>
                </Card>
                <Card className="lg:col-span-3">
                    <h2 className="text-xl font-bold mb-4">Prediction Results</h2>
                    {isLoading && <div className="text-center p-8">Generating prediction...</div>}
                    {!isLoading && !result && <div className="text-center p-8 text-slate-400 dark:text-slate-500">Results will be displayed here.</div>}
                    {result && (
                        <div>
                            <div className="h-64 w-full mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                        <XAxis dataKey="name" stroke={axisColor} />
                                        <YAxis stroke={axisColor} />
                                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: theme === 'light' ? '#00000010' : '#ffffff10' }}/>
                                        <Legend />
                                        <Bar dataKey="Your Farm (T/ha)" fill="#10b981" />
                                        <Bar dataKey="Regional Average (T/ha)" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Key Insights</h3>
                                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                                    {result.insights.map((insight, i) => <li key={i}>{insight}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

const FormField: React.FC<{label:string, name:string, value:any, onChange:any, type:string, options?:string[]}> = ({label, name, value, onChange, type, options}) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
        {type === 'select' ? (
            <select id={name} name={name} value={value} onChange={onChange} className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                {options?.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
            </select>
        ) : (
            <input id={name} name={name} type={type} value={value} onChange={onChange} className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        )}
    </div>
);

// --- SMART WATERING ---
const SmartWatering: React.FC = () => {
    const [moisture, setMoisture] = useState(65);
    const [threshold, setThreshold] = useState(50);
    const [crop, setCrop] = useState('tomato');
    const [notifications, setNotifications] = useState(Notification.permission);
    const [advice, setAdvice] = useState('');
    const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
    const { addActivity } = useActivity();
    const { user } = useUser();
    
    useEffect(() => {
        const interval = setInterval(() => {
            setMoisture(prev => Math.max(20, Math.min(90, prev + (Math.random() - 0.55) * 2)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchAdvice = useCallback(async () => {
        setIsLoadingAdvice(true);
        try {
            const newAdvice = await GeminiService.getWateringAdvice(crop, moisture, threshold);
            setAdvice(newAdvice);
            if (moisture < threshold) {
                if (notifications === 'granted') {
                    new Notification('AgriAssist Pro Watering Alert', {
                        body: `Soil moisture for ${crop} is at ${moisture.toFixed(1)}%, which is below your threshold of ${threshold}%.`,
                    });
                }
                addActivity({ icon: 'watering', description: `Watering alert for ${crop} (Moisture: ${moisture.toFixed(1)}%).`});
                
                // Save watering event to Supabase
                if (user) {
                    await saveWateringEventToSupabase(crop, moisture, threshold, newAdvice);
                }
            }
        } catch (error) {
            console.error(error);
            setAdvice("Could not retrieve advice at this time.");
        } finally {
            setIsLoadingAdvice(false);
        }
    }, [crop, moisture, threshold, notifications, addActivity, user]);

    const saveWateringEventToSupabase = async (crop: string, moisture: number, threshold: number, advice: string) => {
        try {
            console.log('Saving watering event to Supabase...', { userId: user!.id, crop, moisture, threshold });
            const { default: supabase } = await import('./services/supabaseClient');

            const { data, error } = await supabase
                .from('tool_events')
                .insert({
                    user_id: user!.id,
                    tool_name: 'smart_watering',
                    input: { crop, moisture, threshold },
                    output: { advice, alert_triggered: moisture < threshold },
                    status: 'completed',
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('❌ Error saving watering event to Supabase:', error);
            } else {
                console.log('✅ Watering event saved successfully:', data);
            }
        } catch (error) {
            console.error('❌ Error connecting to Supabase:', error);
        }
    };
    
    useEffect(() => { const timer = setTimeout(() => fetchAdvice(), 500); return () => clearTimeout(timer);}, [fetchAdvice]);

    const handleEnableNotifications = async () => {
        const permission = await Notification.requestPermission();
        setNotifications(permission);
    };

    const moistureColor = moisture < threshold ? 'text-yellow-400' : moisture < 30 ? 'text-red-500' : 'text-blue-400';
    
    return (
        <div>
            <ToolHeader icon={<IconDroplet className="w-10 h-10" />} title="Smart Watering System" subtitle="Monitor soil moisture and get intelligent watering recommendations." />
            <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Real-time Monitoring</h2>
                    <div className="text-center my-8">
                        <p className="text-slate-500 dark:text-slate-400">Current Soil Moisture</p>
                        <p className={`text-7xl font-bold ${moistureColor}`}>{moisture.toFixed(1)}%</p>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-8">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${moisture}%` }}></div>
                        <div className="relative h-0">
                            <div className="absolute top-[-8px] h-8 w-1 bg-red-500" style={{ left: `${threshold}%` }}>
                                <span className="absolute -top-6 -translate-x-1/2 text-xs text-red-400">Threshold</span>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mt-8 mb-4">AI Recommendation</h2>
                    <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 min-h-[6rem]">
                        <p>{isLoadingAdvice ? 'Getting advice...' : advice}</p>
                    </div>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4">Settings</h2>
                    <div className="space-y-6">
                        <FormField label="Crop Profile" name="crop" value={crop} onChange={e => setCrop(e.target.value)} type="select" options={["tomato", "corn", "lettuce", "potato"]} />
                        <div>
                            <label htmlFor="threshold" className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">Watering Threshold: {threshold}%</label>
                            <input id="threshold" type="range" min="20" max="80" value={threshold} onChange={e => setThreshold(parseInt(e.target.value, 10))} className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                            {notifications === 'granted' ? (
                                <p className="text-emerald-500 dark:text-emerald-400 flex items-center gap-2"><IconCheckCircle /> Notifications are enabled.</p>
                            ) : (
                                <Button onClick={handleEnableNotifications} disabled={notifications === 'denied'}>
                                    {notifications === 'denied' ? 'Notifications Blocked' : 'Enable Browser Notifications'}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// --- MARKET ADVISOR ---
const MarketAdvisor: React.FC = () => {
    const [selectedCrop, setSelectedCrop] = useState('corn');
    const [result, setResult] = useState<MarketAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addActivity } = useActivity();
    const { profile } = useProfile();
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        // Pre-fill with user's first crop if available
        if (profile.currentCrops) {
            const firstCrop = profile.currentCrops.split(',')[0].trim();
            if (firstCrop) setSelectedCrop(firstCrop.toLowerCase());
        }
    }, [profile.currentCrops]);

    const handleAnalyze = async () => {
        if (!profile.location) {
            setError("Please set your farm location in your profile to get a localized market analysis.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const analysis = await GeminiService.getMarketAnalysis(selectedCrop, profile.location);
            setResult(analysis);
            addActivity({ icon: 'market', description: `Analyzed market for ${selectedCrop}.` });
            
            // Save to Supabase
            if (user) {
                await saveMarketAnalysisToSupabase(selectedCrop, analysis);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to get market analysis. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const saveMarketAnalysisToSupabase = async (crop: string, analysis: any) => {
        try {
            console.log('Saving market analysis to Supabase...', { userId: user!.id, crop, analysis });
            const { default: supabase } = await import('./services/supabaseClient');

            const { data, error } = await supabase
                .from('tool_events')
                .insert({
                    user_id: user!.id,
                    tool_name: 'market_analysis',
                    input: { crop, location: profile.location },
                    output: analysis,
                    status: 'completed',
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('❌ Error saving market analysis to Supabase:', error);
            } else {
                console.log('✅ Market analysis saved successfully:', data);
            }
        } catch (error) {
            console.error('❌ Error connecting to Supabase:', error);
        }
    };

    return (
        <div>
            <ToolHeader icon={<IconTrendingUp className="w-10 h-10" />} title="Market Advisor" subtitle="Get AI-powered market analysis and price forecasts for your crops." />
            <div className="grid lg:grid-cols-5 gap-8">
                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Analysis Parameters</h2>
                    <div className="space-y-4">
                        <FormField label="Select Crop" name="crop" value={selectedCrop} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCrop(e.target.value)} type="select" options={["corn", "wheat", "rice", "soybean", "potato", "tomato", "cotton"]} />
                         <div className="text-sm p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                           <p className="font-semibold">Using location from your profile:</p>
                           <p className="text-slate-600 dark:text-slate-400">{profile.location || "Not set"}</p>
                           {!profile.location && <button onClick={() => navigate('/tools/profile')} className="text-emerald-600 dark:text-emerald-400 hover:underline mt-2 text-xs font-bold">Update Profile</button>}
                        </div>
                        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full mt-4">
                            {isLoading ? 'Analyzing Market...' : <><IconTrendingUp /> Get Analysis</>}
                        </Button>
                        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    </div>
                </Card>
                <Card className="lg:col-span-3">
                    <h2 className="text-xl font-bold mb-4">Market Analysis</h2>
                    {isLoading && <div className="text-center p-8">Searching for the latest market data...</div>}
                    {!isLoading && !result && <div className="text-center p-8 text-slate-400 dark:text-slate-500">Analysis results will appear here.</div>}
                    {result && (
                        <div>
                            <div
                                className="prose prose-slate prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: marked.parse(result.analysisText) as string }}
                            />
                            {result.sources.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <h4 className="font-semibold text-base mb-2">Sources</h4>
                                    <ul className="space-y-2 text-sm">
                                        {result.sources.map((source, i) => (
                                            <li key={i}>
                                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 break-all">
                                                    <IconExternalLink className="w-4 h-4 flex-shrink-0" />
                                                    <span>{source.title}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

// --- USER DASHBOARD ---
const UserDashboard: React.FC = () => {
    const { activities } = useActivity();
    const iconMap = {
        disease: <IconLeaf className="text-emerald-400"/>,
        yield: <IconChart className="text-emerald-400"/>,
        watering: <IconDroplet className="text-emerald-400"/>,
        chat: <IconBot className="text-emerald-400"/>,
        market: <IconTrendingUp className="text-emerald-400"/>,
    }

    return (
        <div>
            <ToolHeader icon={<IconDashboard className="w-10 h-10" />} title="User Dashboard" subtitle="An overview of your activity and usage statistics." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Analyses Performed" value={activities.filter(a=>['disease', 'market'].includes(a.icon)).length} />
                <StatCard title="Predictions Made" value={activities.filter(a=>a.icon === 'yield').length} />
                <StatCard title="Interactions" value={activities.length} />
            </div>
            <Card>
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {activities.length > 0 ? activities.map(activity => (
                        <div key={activity.id} className="flex items-center gap-4 py-4">
                            <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full">{iconMap[activity.icon]}</div>
                            <div className="flex-1">
                                <p className="text-slate-800 dark:text-slate-200">{activity.description}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{activity.timestamp}</p>
                            </div>
                        </div>
                    )) : <p className="text-slate-500 dark:text-slate-400 text-center py-8">No recent activity. Try using a tool!</p>}
                </div>
            </Card>
        </div>
    );
};

const useAnimatedCounter = (endValue: number, duration: number = 1000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = endValue;
        if (start === end) { setCount(end); return; }
        const incrementTime = Math.max(10, duration / end);
        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);
        return () => clearInterval(timer);
    }, [endValue, duration]);
    return count;
};
const StatCard: React.FC<{title: string, value: number}> = ({ title, value }) => {
    const animatedValue = useAnimatedCounter(value);
    return (
        <Card className="text-center">
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">{title}</p>
            <p className="text-5xl font-bold text-emerald-500 dark:text-emerald-400">{animatedValue}</p>
        </Card>
    );
};

// --- USER PROFILE ---
const ProfilePage: React.FC = () => {
    const { profile, updateProfile } = useProfile();
    const [formData, setFormData] = useState(profile);
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
    };

    return (
        <div>
            <ToolHeader icon={<IconUser className="w-10 h-10" />} title="Your Profile" subtitle="Keep your farm and contact information up to date." />
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} type="text" />
                        <FormField label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" />
                        <FormField label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} type="tel" />
                        <FormField label="Acres of Land" name="acres" value={formData.acres} onChange={handleChange} type="number" />
                        <FormField label="Primary Soil Type" name="soilType" value={formData.soilType} onChange={handleChange} type="select" options={["loamy", "sandy", "clay", "silty", "peaty", "chalky"]} />
                        <FormField label="Farm Location" name="location" value={formData.location} onChange={handleChange} type="text" />
                    </div>
                    <div>
                         <label htmlFor="currentCrops" className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">What do you have planted right now?</label>
                        <textarea
                            id="currentCrops"
                            name="currentCrops"
                            rows={4}
                            value={formData.currentCrops}
                            onChange={handleChange}
                            placeholder="e.g., Corn in Field A, Soybeans in Field B..."
                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button type="submit" className="w-auto">Save Changes</Button>
                        {isSaved && (
                            <div className="text-emerald-500 dark:text-emerald-400 flex items-center gap-2">
                                <IconCheckCircle className="w-5 h-5" />
                                <span>Profile updated successfully!</span>
                            </div>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    // Protect Material Symbols icon ligatures from being translated by third-party translators
    useEffect(() => {
        // Ensure Material Symbols font is loaded so restored text renders as icons
        if (!document.querySelector('link[href*="Material+Symbols+Outlined"]')) {
            const ms = document.createElement('link');
            ms.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
            ms.rel = 'stylesheet';
            document.head.appendChild(ms);
        }

        const protectIcons = () => {
            document.querySelectorAll<HTMLElement>('.material-symbols-outlined').forEach(el => {
                el.classList.add('notranslate');
                el.setAttribute('translate', 'no');
                if (!el.dataset.iconName) el.dataset.iconName = (el.textContent || '').trim();
            });
        };

        protectIcons();

        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'characterData') {
                    const parent = (m.target as CharacterData).parentElement as HTMLElement | null;
                    if (parent?.classList?.contains('material-symbols-outlined')) {
                        const orig = parent.dataset.iconName;
                        if (orig && (parent.textContent || '').trim() !== orig) {
                            parent.textContent = orig;
                        }
                    }
                } else if (m.type === 'childList' && m.addedNodes.length) {
                    // Protect any newly added icons
                    protectIcons();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });

        // Expose for debugging if needed
        (window as any).__agri_icon_protect = { disconnect: () => observer.disconnect() };

        return () => {
            observer.disconnect();
            try { delete (window as any).__agri_icon_protect; } catch (e) { }
        };
    }, []);
  return (
    <ThemeProvider>
        <LanguageProvider>
            <ProfileProvider>
                <ActivityProvider>
                    <ChatProvider>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
                            <Route path="/tools" element={<ProtectedRoute />}>
                                <Route path="" element={<ToolsPage />}>
                                    <Route index element={<Navigate to="assistant" replace />} />
                                    <Route path="assistant" element={<AIAssistant />} />
                                    <Route path="disease-detection" element={<DiseaseDetection />} />
                                    <Route path="yield-prediction" element={<YieldPrediction />} />
                                    <Route path="watering" element={<SmartWatering />} />
                                    <Route path="market-advisor" element={<MarketAdvisor />} />
                                    <Route path="profile" element={<ProfilePage />} />
                                    <Route path="dashboard" element={<UserDashboard />} />
                                </Route>
                            </Route>
                            {/* Fullscreen chat route needs to be outside the main ToolsPage layout */}
                            <Route path="/tools/assistant/fullscreen" element={<ProtectedRoute />}>
                                <Route index element={<AIAssistantFullScreen />} />
                            </Route>
                        </Routes>
                    </ChatProvider>
                </ActivityProvider>
            </ProfileProvider>
        </LanguageProvider>
    </ThemeProvider>
  );
}