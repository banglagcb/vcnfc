import { useEffect, useRef } from "react";
import { useProfileStore } from "@/lib/stores/profile-store";
import type { UserProfile } from "@/lib/types/profile";

export const useRealTimeSync = () => {
  const { profile, setProfile, updateProfile } = useProfileStore();
  const profileRef = useRef(profile);

  // Update ref when profile changes
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // Function to sync any field update instantly across all pages
  const syncUpdate = (field: string, value: any) => {
    const update = { [field]: value };
    updateProfile(update);

    // Dispatch custom event for cross-tab/window sync if needed
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: {
            field,
            value,
            profile: { ...profileRef.current, ...update },
          },
        }),
      );
    }
  };

  // Function to sync entire profile update
  const syncProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);

    // Dispatch custom event for cross-tab/window sync if needed
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: { profile: updatedProfile },
        }),
      );
    }
  };

  // Function to sync multiple fields at once
  const syncMultipleUpdates = (updates: Partial<UserProfile>) => {
    updateProfile(updates);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: { updates, profile: { ...profileRef.current, ...updates } },
        }),
      );
    }
  };

  // Listen for updates from other components/pages
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      const { profile: updatedProfile, field, value, updates } = event.detail;

      if (updatedProfile) {
        setProfile(updatedProfile);
      } else if (updates) {
        updateProfile(updates);
      } else if (field && value !== undefined) {
        updateProfile({ [field]: value });
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "profile-updated",
        handleProfileUpdate as EventListener,
      );

      return () => {
        window.removeEventListener(
          "profile-updated",
          handleProfileUpdate as EventListener,
        );
      };
    }
  }, [setProfile, updateProfile]);

  return {
    profile,
    syncUpdate,
    syncProfileUpdate,
    syncMultipleUpdates,
  };
};

// Hook specifically for real-time profile viewing
export const useRealTimeProfileView = () => {
  const { profile } = useProfileStore();
  const lastUpdateTime = useRef<Date | null>(null);

  useEffect(() => {
    if (profile) {
      lastUpdateTime.current = new Date();
    }
  }, [profile]);

  const getLastUpdateTime = () => {
    return lastUpdateTime.current?.toLocaleTimeString() || null;
  };

  const isRecentlyUpdated = () => {
    if (!lastUpdateTime.current) return false;
    const now = new Date();
    const diffMs = now.getTime() - lastUpdateTime.current.getTime();
    return diffMs < 5000; // Consider "recent" if updated within 5 seconds
  };

  return {
    profile,
    lastUpdateTime: getLastUpdateTime(),
    isRecentlyUpdated: isRecentlyUpdated(),
  };
};
