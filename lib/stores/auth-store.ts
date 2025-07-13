import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  debugAuthService as authService,
  type AuthUser,
  type LoginRequest,
  type RegisterRequest,
} from "@/lib/services/debug-auth-service";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

interface AuthActions {
  login: (
    credentials: LoginRequest,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: RegisterRequest,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
  isAuthenticated: () => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);

          if (response.success && response.user) {
            set({
              user: response.user,
              isLoading: false,
              error: null,
            });
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.error || response.message || "Login failed",
            });
            return {
              success: false,
              error: response.error || response.message || "Login failed",
            };
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(userData);

          if (response.success && response.user) {
            set({
              user: response.user,
              isLoading: false,
              error: null,
            });
            return { success: true };
          } else {
            set({
              isLoading: false,
              error:
                response.error || response.message || "Registration failed",
            });
            return {
              success: false,
              error:
                response.error || response.message || "Registration failed",
            };
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Registration failed";
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
          set({
            user: null,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Even if logout fails on server, clear local state
          set({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true });

        try {
          const response = await authService.getCurrentUser();

          if (response.success && response.user) {
            set({
              user: response.user,
              isLoading: false,
              error: null,
              isInitialized: true,
            });
          } else {
            set({
              user: null,
              isLoading: false,
              error: null,
              isInitialized: true,
            });
          }
        } catch (error) {
          set({
            user: null,
            isLoading: false,
            error: null,
            isInitialized: true,
          });
        }
      },

      initializeAuth: async () => {
        if (get().isInitialized) return;

        await get().getCurrentUser();
      },

      isAuthenticated: () => {
        return !!get().user;
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);
