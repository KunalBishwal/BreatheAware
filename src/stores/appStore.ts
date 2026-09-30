import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CityData, PollutantKey } from '../types';
import { CITIES } from '../lib/mockData';

type Theme = 'dark' | 'light';

interface AppState {
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  
  // Navigation
  currentPage: 'landing' | 'dashboard' | 'seasonal' | 'compare' | 'story';
  setCurrentPage: (page: AppState['currentPage']) => void;
  
  // Auth
  isAuthenticated: boolean;
  isAnonymous: boolean;
  userName: string;
  login: (name: string, anonymous?: boolean) => void;
  logout: () => void;
  
  // City selection
  selectedCity: CityData;
  setSelectedCity: (city: CityData) => void;
  
  // Pollutant selection
  selectedPollutant: PollutantKey;
  setSelectedPollutant: (pollutant: PollutantKey) => void;
  
  // Scroll
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  currentScene: number;
  setCurrentScene: (scene: number) => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Alerts
  hasSevereAlert: boolean;
  setHasSevereAlert: (has: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
      
      currentPage: 'landing',
      setCurrentPage: (page) => set({ currentPage: page }),
      
      isAuthenticated: false,
      isAnonymous: false,
      userName: '',
      login: (name, anonymous = false) => set({ isAuthenticated: true, isAnonymous: anonymous, userName: name }),
      logout: () => set({ isAuthenticated: false, isAnonymous: false, userName: '', currentPage: 'landing' }),
      
      selectedCity: CITIES[0],
      setSelectedCity: (city) => set({ selectedCity: city }),
      
      selectedPollutant: 'pm25',
      setSelectedPollutant: (pollutant) => set({ selectedPollutant: pollutant }),
      
      scrollProgress: 0,
      setScrollProgress: (progress) => set({ scrollProgress: progress }),
      currentScene: 0,
      setCurrentScene: (scene) => set({ currentScene: scene }),
      
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      hasSevereAlert: true,
      setHasSevereAlert: (has) => set({ hasSevereAlert: has }),
    }),
    {
      name: 'breatheaware-store',
      partialize: (state) => ({ theme: state.theme, selectedCity: state.selectedCity }),
    }
  )
);
