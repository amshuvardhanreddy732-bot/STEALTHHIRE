import { create } from 'zustand';
import { User, Startup, Message, SavedOpportunity } from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface FilterState {
  search: string;
  fundingStage: string;
  industry: string;
  location: string;
  hiringProbability: string;
  remote: boolean | null;
}

interface AppState {
  // Authentication State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  
  // Navigation
  currentPage: 'landing' | 'login' | 'signup' | 'forgot' | 'verify' | 'dashboard' | 'explorer' | 'resume-analyzer' | 'skill-gap' | 'mentor' | 'outreach' | 'profile' | 'admin';
  selectedStartupId: string | null;
  outreachStartupId: string | null;

  // Bookmarks & Opportunities
  bookmarks: SavedOpportunity[];
  isBookmarksLoading: boolean;

  // Alerts/Toasts
  toasts: Toast[];

  // Chat/Mentor Session
  chatMessages: Message[];
  isChatLoading: boolean;

  // Search Filters
  filters: FilterState;

  // Actions
  setPage: (page: AppState['currentPage'], selectedId?: string | null) => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: 'job-seeker' | 'admin') => Promise<boolean>;
  logout: () => void;
  checkSession: () => Promise<void>;
  updateProfile: (data: { name?: string; skills?: string[]; role?: 'job-seeker' | 'admin' }) => Promise<void>;

  // Bookmark Actions
  fetchBookmarks: () => Promise<void>;
  toggleBookmark: (startupId: string) => Promise<void>;
  
  // Chat Actions
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;

  // Filter Actions
  setFilter: (key: keyof FilterState, value: any) => void;
  resetFilters: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial states
  user: null,
  token: localStorage.getItem('sh_token'),
  isAuthenticated: false,
  isAuthLoading: false,
  authError: null,
  currentPage: 'landing',
  selectedStartupId: null,
  outreachStartupId: null,
  bookmarks: [],
  isBookmarksLoading: false,
  toasts: [],
  chatMessages: [
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I am your StealthHire AI Career Mentor. I scan funding rounds, growth metrics, and tech stacks to help you uncover off-market hiring opportunities. Ask me anything, or run your resume through the Analyzer to get started!",
      timestamp: new Date().toISOString()
    }
  ],
  isChatLoading: false,
  filters: {
    search: '',
    fundingStage: '',
    industry: '',
    location: '',
    hiringProbability: '',
    remote: null
  },

  // State manipulation actions
  setPage: (page, selectedId = null) => {
    if (page === 'outreach' && selectedId) {
      set({ currentPage: page, outreachStartupId: selectedId });
    } else if (page === 'explorer' && selectedId) {
      set({ currentPage: page, selectedStartupId: selectedId });
    } else {
      set({ currentPage: page, selectedStartupId: selectedId });
    }
  },

  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 4000);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  // Auth Operations
  login: async (email, password) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('sh_token', data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isAuthLoading: false,
        currentPage: data.user.role === 'admin' ? 'admin' : 'dashboard'
      });
      get().addToast(`Welcome back, ${data.user.name}!`, 'success');
      get().fetchBookmarks();
      return true;
    } catch (err: any) {
      set({ authError: err.message, isAuthLoading: false });
      get().addToast(err.message, 'error');
      return false;
    }
  },

  register: async (name, email, password, role = 'job-seeker') => {
    set({ isAuthLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      localStorage.setItem('sh_token', data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isAuthLoading: false,
        currentPage: 'verify' // Take to email verification page first to follow instructions
      });
      get().addToast('Verification code dispatched to your email!', 'info');
      get().fetchBookmarks();
      return true;
    } catch (err: any) {
      set({ authError: err.message, isAuthLoading: false });
      get().addToast(err.message, 'error');
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('sh_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      currentPage: 'landing',
      bookmarks: []
    });
    get().addToast('You have logged out successfully.', 'info');
  },

  checkSession: async () => {
    const token = get().token;
    if (!token) return;
    set({ isAuthLoading: true });
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Session expired');
      set({ user: data.user, isAuthenticated: true, isAuthLoading: false });
      get().fetchBookmarks();
    } catch {
      localStorage.removeItem('sh_token');
      set({ user: null, token: null, isAuthenticated: false, isAuthLoading: false });
    }
  },

  updateProfile: async (data) => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch('/api/auth/profile/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok) {
        set({ user: resData.user });
        get().addToast('Profile updated successfully', 'success');
      }
    } catch (err: any) {
      get().addToast('Failed to update profile', 'error');
    }
  },

  // Bookmark Management
  fetchBookmarks: async () => {
    set({ isBookmarksLoading: true });
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      if (res.ok) {
        set({ bookmarks: data.opportunities, isBookmarksLoading: false });
      }
    } catch {
      set({ isBookmarksLoading: false });
    }
  },

  toggleBookmark: async (startupId) => {
    const isBookmarked = get().bookmarks.some(b => b.startupId === startupId);
    try {
      if (isBookmarked) {
        const res = await fetch(`/api/opportunities/${startupId}`, { method: 'DELETE' });
        if (res.ok) {
          set((state) => ({ bookmarks: state.bookmarks.filter(b => b.startupId !== startupId) }));
          get().addToast('Bookmark removed', 'info');
        }
      } else {
        const res = await fetch('/api/opportunities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startupId, status: 'Bookmarked' })
        });
        const data = await res.json();
        if (res.ok) {
          set((state) => ({ bookmarks: [...state.bookmarks, data.opportunity] }));
          get().addToast('Added to saved opportunities!', 'success');
        }
      }
    } catch {
      get().addToast('Bookmark update failed', 'error');
    }
  },

  // AI Chat Actions
  sendChatMessage: async (text) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    set((state) => ({ 
      chatMessages: [...state.chatMessages, newMessage],
      isChatLoading: true 
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: get().chatMessages,
          userProfile: get().user
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Mentor is offline');

      const mentorMessage: Message = {
        id: `mentor-${Date.now()}`,
        role: 'assistant',
        text: data.text,
        timestamp: new Date().toISOString()
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, mentorMessage],
        isChatLoading: false
      }));
    } catch (err: any) {
      set({ isChatLoading: false });
      get().addToast(err.message, 'error');
    }
  },

  clearChat: () => {
    set({
      chatMessages: [
        {
          id: 'welcome',
          role: 'assistant',
          text: "Hello! I am your StealthHire AI Career Mentor. I scan funding rounds, growth metrics, and tech stacks to help you uncover off-market hiring opportunities. Ask me anything, or run your resume through the Analyzer to get started!",
          timestamp: new Date().toISOString()
        }
      ]
    });
  },

  // Filters
  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }));
  },

  resetFilters: () => {
    set({
      filters: {
        search: '',
        fundingStage: '',
        industry: '',
        location: '',
        hiringProbability: '',
        remote: null
      }
    });
  }
}));
