import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/lib/types/profile";
import { initializeSampleProfile } from "@/lib/api/profile";

interface ProfileStore {
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  initializeProfile: () => void;
  setLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,
      loading: false,

      setProfile: (profile: UserProfile) => {
        set({ profile, loading: false });
      },

      updateProfile: (updates: Partial<UserProfile>) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: { ...currentProfile, ...updates },
            loading: false,
          });
        }
      },

      initializeProfile: () => {
        const currentProfile = get().profile;
        if (!currentProfile) {
          const sampleProfile = initializeSampleProfile("default-user");
          set({ profile: sampleProfile, loading: false });
        }
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: "profile-storage",
      partialize: (state) => ({ profile: state.profile }),
    },
  ),
);
