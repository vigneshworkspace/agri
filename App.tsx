
import React, { useState, useEffect, useRef, useCallback, FormEvent, createContext, useContext, useMemo } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { marked } from 'marked';
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

// Auth Context
interface AuthContextType { isAuthenticated: boolean; login: () => void; logout: () => void; }
const AuthContext = createContext<AuthContextType | null>(null);
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('agri_user'));
    const navigate = useNavigate();

    const login = () => {
        localStorage.setItem('agri_user', 'true');
        setIsAuthenticated(true);
        navigate('/tools/assistant');
    };
    const logout = () => {
        localStorage.removeItem('agri_user');
        setIsAuthenticated(false);
        navigate('/');
    };
    return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext)!;

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
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = sessionStorage.getItem('agri_chat');
        return saved ? JSON.parse(saved) : [{ role: 'model', text: 'Hello! I am AgriAssist Pro. How can I help you with your farming needs today?' }];
    });
    const [isLoading, setIsLoading] = useState(false);
    const { addActivity } = useActivity();
    const { profile } = useProfile();

    useEffect(() => { sessionStorage.setItem('agri_chat', JSON.stringify(messages)); }, [messages]);

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;
        
        addActivity({ icon: 'chat', description: `Asked AI: "${messageText.substring(0, 30)}..."` });
        const newMessages: ChatMessage[] = [...messages, { role: 'user', text: messageText }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const stream = GeminiService.streamChatResponse(messageText, profile);
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

    useEffect(() => { localStorage.setItem('agri_profile', JSON.stringify(profile)); }, [profile]);
    
    const updateProfile = (newProfile: UserProfile) => {
        setProfile(newProfile);
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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
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
const LanguageTranslator: React.FC<{ className?: string }> = ({ className }) => {
    const translatorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // The Google Translate script initializes the element with id 'google_translate_element'
        // We move the styled child node into our component's div to control its placement
        const interval = setInterval(() => {
            const googleElement = document.getElementById('google_translate_element');
            const widget = googleElement?.querySelector('.skiptranslate');
            if (widget && translatorRef.current) {
                if (!translatorRef.current.querySelector('.skiptranslate')) {
                    translatorRef.current.appendChild(widget);
                }
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);
    
    return <div ref={translatorRef} id="translator-container" className={className}></div>;
};

// --- AUTH & ROUTING ---
const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/tools/assistant');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        login();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/1920/1080?random=1&blur=5')" }}>
            <Card className="w-full max-w-sm">
                <div className="text-center mb-6">
                    <IconLeaf className="text-emerald-400 w-12 h-12 mx-auto mb-2" />
                    <h1 className="text-2xl font-bold">Welcome to AgriAssist Pro</h1>
                    <p className="text-slate-500 dark:text-slate-400">Please sign in to continue</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="username">Username</label>
                        <input id="username" type="text" defaultValue="farmer_admin" className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="password">Password</label>
                        <input id="password" type="password" defaultValue="password" className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                </form>
            </Card>
        </div>
    );
};


// --- LANDING PAGE ---
const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <section className={`py-20 ${className}`}>
        <div className="container mx-auto px-6">{children}</div>
    </section>
);

const SectionTitle: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-2">{subtitle}</p>
    </div>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen">
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                <div className="text-2xl font-bold flex items-center gap-2 text-white">
                    <IconLeaf className="text-emerald-400 w-8 h-8" />
                    <span>AgriAssist Pro</span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle className="text-white hover:bg-white/20" />
                    <Button onClick={() => navigate('/tools')}>Launch App</Button>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
                    <img src="https://picsum.photos/1920/1080?random=1" alt="Lush farm" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="relative z-10 p-4 text-white">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">Empowering Agriculture with AI</h1>
                        <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-8">Harness the power of artificial intelligence to optimize your farming operations, from planting to harvest.</p>
                        <Button onClick={() => navigate('/tools')} className="text-lg py-3 px-8">Get Started</Button>
                    </div>
                </section>
                
                {/* Features Section */}
                <Section className="bg-slate-50 dark:bg-slate-900/80 backdrop-blur-sm">
                    <SectionTitle title="Platform Capabilities" subtitle="All the tools you need for smarter, more efficient farming."/>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard icon={<IconBot className="w-10 h-10 text-emerald-400"/>} title="AI Assistant" description="Get instant answers to your farming questions, 24/7."/>
                        <FeatureCard icon={<IconLeaf className="w-10 h-10 text-emerald-400"/>} title="Disease Detection" description="Upload crop images to identify diseases and receive treatment plans."/>
                        <FeatureCard icon={<IconChart className="w-10 h-10 text-emerald-400"/>} title="Yield Prediction" description="Forecast crop yields based on environmental and farm data."/>
                        <FeatureCard icon={<IconDroplet className="w-10 h-10 text-emerald-400"/>} title="Smart Watering" description="Monitor soil moisture and get intelligent watering alerts."/>
                    </div>
                </Section>

                {/* How It Works Section */}
                <Section>
                    <SectionTitle title="Get Started in 3 Simple Steps" subtitle="Begin your journey towards precision agriculture in minutes." />
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <HowItWorksStep number="1" title="Create an Account" description="Sign up for free and get immediate access to our full suite of tools." />
                        <HowItWorksStep number="2" title="Input Your Data" description="Upload crop images or enter farm details to start the analysis." />
                        <HowItWorksStep number="3" title="Receive AI Insights" description="Get actionable recommendations to boost your farm's productivity and health." />
                    </div>
                </Section>

                {/* Tools in Action Section */}
                 <Section className="bg-slate-200/50 dark:bg-slate-800/50">
                    <SectionTitle title="Tools in Action" subtitle="See how our AI-powered Disease Detection provides instant, critical insights."/>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <h3 className="text-3xl font-bold mb-4">Identify Crop Diseases in Seconds</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">Don't let diseases ruin your harvest. Our advanced image recognition model, trained on millions of samples, can identify common and rare crop diseases with high accuracy.</p>
                             <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                                <li>Instant diagnosis from a single photo.</li>
                                <li>Detailed treatment and prevention plans.</li>
                                <li>Confidence scores to help you make informed decisions.</li>
                            </ul>
                            <Button onClick={() => navigate('/tools/disease-detection')} className="mt-6">Try It Now</Button>
                        </div>
                        <div className="md:w-1/2">
                             <img src="https://picsum.photos/600/400?random=2" alt="Disease detection tool interface" className="rounded-lg shadow-2xl border-4 border-slate-300 dark:border-slate-700" />
                        </div>
                    </div>
                </Section>
                
                {/* Testimonials Section */}
                <Section>
                    <SectionTitle title="Trusted by Farmers Worldwide" subtitle="Hear what our users have to say about their success with AgriAssist Pro." />
                    <div className="grid md:grid-cols-2 gap-8">
                        <TestimonialCard quote="This platform has been a game-changer. The yield prediction tool was incredibly accurate and helped me optimize my fertilizer use, saving me thousands." name="John D." location="California, USA" />
                        <TestimonialCard quote="As a small-scale farmer, the disease detection feature is invaluable. I can quickly identify issues and treat them before they spread. Highly recommended!" name="Maria S." location="Jalisco, Mexico" />
                    </div>
                </Section>

                {/* CTA Section */}
                <Section className="bg-emerald-900/10 dark:bg-emerald-900/30 text-center">
                     <h2 className="text-4xl font-bold mb-4">Ready to Revolutionize Your Farm?</h2>
                     <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">Join thousands of farmers who are using AI to build a more profitable and sustainable future. Get started for free today.</p>
                     <Button onClick={() => navigate('/tools')} className="text-lg py-3 px-8">Sign Up Now</Button>
                </Section>
            </main>
            <Footer />
        </div>
    );
};
const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
    <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:-translate-y-2">
        <div className="mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
    </div>
);
const HowItWorksStep: React.FC<{number: string, title: string, description: string}> = ({ number, title, description }) => (
    <div className="relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-slate-200 dark:bg-slate-700 text-emerald-400 text-2xl font-bold rounded-full flex items-center justify-center border-4 border-slate-100 dark:border-slate-900">{number}</div>
        <Card className="pt-12 h-full">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </Card>
    </div>
);
const TestimonialCard: React.FC<{quote: string, name: string, location: string}> = ({ quote, name, location }) => (
    <Card className="flex flex-col">
        <IconQuote className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-4" />
        <p className="text-slate-600 dark:text-slate-300 italic flex-1">"{quote}"</p>
        <div className="mt-4 text-right">
            <p className="font-bold text-emerald-500 dark:text-emerald-400">{name}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">{location}</p>
        </div>
    </Card>
);
const Footer: React.FC = () => (
    <footer className="bg-slate-200 dark:bg-slate-950/50 border-t border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400">
        <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
                <div>
                    <div className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white mb-2">
                        <IconLeaf className="text-emerald-400 w-7 h-7" />
                        <span>AgriAssist Pro</span>
                    </div>
                    <p className="max-w-xs">Empowering farmers with AI technology for a sustainable and productive future in agriculture.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h3>
                    <ul>
                        <li className="mb-2"><Link to="/" className="hover:text-emerald-500 dark:hover:text-emerald-400">Home</Link></li>
                        <li className="mb-2"><Link to="/tools" className="hover:text-emerald-500 dark:hover:text-emerald-400">Tools</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400"><IconTwitter /></a>
                        <a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400"><IconLinkedIn /></a>
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Language</h3>
                    <LanguageTranslator />
                </div>
            </div>
            <div className="mt-12 border-t border-slate-300 dark:border-slate-800 pt-6 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} AgriAssist Pro. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);


// --- TOOLS PAGE LAYOUT ---
const tools = [
    { name: 'AI Assistant', path: '/tools/assistant', icon: <IconBot /> },
    { name: 'Disease Detection', path: '/tools/disease-detection', icon: <IconLeaf /> },
    { name: 'Yield Prediction', path: '/tools/yield-prediction', icon: <IconChart /> },
    { name: 'Market Advisor', path: '/tools/market-advisor', icon: <IconTrendingUp /> },
    { name: 'Smart Watering', path: '/tools/watering', icon: <IconDroplet /> },
    { name: 'User Dashboard', path: '/tools/dashboard', icon: <IconDashboard /> },
];
const profileTool = { name: 'Profile', path: '/tools/profile', icon: <IconUser /> };
const allToolsForMobile = [...tools, profileTool];

const ToolsPage: React.FC = () => {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <div className="flex flex-col md:flex-row h-screen bg-transparent overflow-hidden">
            <aside className="bg-white/80 dark:bg-slate-950/50 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 md:w-64 flex-shrink-0 flex flex-col">
                <div className="p-4 hidden md:block">
                    <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <IconLeaf className="text-emerald-400 w-8 h-8" />
                        <span>AgriAssist Pro</span>
                    </Link>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <nav className="md:hidden p-2">
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {allToolsForMobile.map(tool => (
                                <Link key={tool.name} to={tool.path} className={`flex-shrink-0 flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors duration-200 ${location.pathname.startsWith(tool.path) ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                                    {tool.icon}
                                    {tool.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
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
                    </nav>
                    <nav className="hidden md:block p-4">
                         <ul>
                            <li>
                                <Link to={profileTool.path} className={`flex items-center gap-3 py-3 px-4 rounded-lg mb-2 transition-colors duration-200 ${location.pathname.startsWith(profileTool.path) ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                                    {profileTool.icon}
                                    {profileTool.name}
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                     <button onClick={logout} className="flex items-center gap-3 py-2 px-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-800/50 dark:hover:text-red-300 transition-colors duration-200">
                        <IconLogout className="w-5 h-5"/>
                        <span className="text-sm font-medium hidden md:inline">Logout</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <LanguageTranslator />
                        <ThemeToggle />
                    </div>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
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

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSendMessage = async (e?: FormEvent, suggestion?: string) => {
        e?.preventDefault();
        const userMessage = suggestion || input;
        if (userMessage.trim()) {
            sendMessage(userMessage);
            setInput('');
        }
    };

    const suggestionChips = ["Best fertilizer for corn?", "How to treat tomato blight?", "When is the best time to plant soybeans?", "Improve soil quality"];

    const chatBody = (
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center"><IconBot className="w-5 h-5 text-white" /></div>}
                    <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-emerald-600 dark:bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
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
                    <div className={`max-w-xl p-3 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center gap-2`}>
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
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about crops, soil, or anything farming-related..." className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none" disabled={isLoading} />
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
            <ToolHeader icon={<IconBot className="w-10 h-10" />} title="AI Agricultural Assistant" subtitle="Your on-demand farming expert. Ask me anything.">
                 <Button onClick={() => navigate('/tools/assistant/fullscreen')} className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white">
                    <IconExpand /> Fullscreen
                </Button>
            </ToolHeader>
            <ChatInterface isFullScreen={false} />
        </div>
    );
};

const AIAssistantFullScreen: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
             <header className="p-4 bg-white/80 dark:bg-slate-950/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h1 className="text-xl font-bold flex items-center gap-2"><IconBot/> AI Assistant</h1>
                <Button onClick={() => navigate('/tools/assistant')} className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white">
                    <IconCollapse /> Collapse
                </Button>
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
    const [result, setResult] = useState<DiseaseAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addActivity } = useActivity();

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
        } catch (err) {
            console.error(err);
            setError("Failed to analyze image. Please try again.");
        } finally {
            setIsLoading(false);
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
        } catch (err) {
            console.error(err);
            setError("Failed to get prediction. Please try again.");
        } finally {
            setIsLoading(false);
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
            }
        } catch (error) {
            console.error(error);
            setAdvice("Could not retrieve advice at this time.");
        } finally {
            setIsLoadingAdvice(false);
        }
    }, [crop, moisture, threshold, notifications, addActivity]);
    
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
        } catch (err) {
            console.error(err);
            setError("Failed to get market analysis. Please try again.");
        } finally {
            setIsLoading(false);
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
  return (
    <ThemeProvider>
        <AuthProvider>
            <ProfileProvider>
                <ActivityProvider>
                    <ChatProvider>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/" element={<LandingPage />} />
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
        </AuthProvider>
    </ThemeProvider>
  );
}