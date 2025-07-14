import { useState, useEffect, useCallback, useRef } from "react";
import { useStore } from "@/lib/store";
import { profileAPI, initializeSampleProfile } from "@/lib/api/profile";
import type {
  UserProfile,
  ProfileFormData,
  ProfileUpdatePayload,
  ProfileStatus,
  SaveStatus,
  SocialLink,
  ContactField,
  Skill,
  Achievement,
  WorkExperience,
  PortfolioItem,
  Testimonial,
  ValidationError,
} from "@/lib/types/profile";

export const useProfile = (userId?: string) => {
  const { user } = useStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<ProfileStatus>("idle");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  const currentUserId = userId || user?.id;

  // Load profile
  const loadProfile = useCallback(async () => {
    if (!currentUserId) return;

    setStatus("loading");
    try {
      const response = await profileAPI.getProfileByUserId(currentUserId);

      if ("success" in response && response.success) {
        setProfile(response.profile);
        setStatus("success");
      } else {
        // Create sample profile if none exists
        const sampleProfile = initializeSampleProfile(currentUserId);
        setProfile(sampleProfile);
        setStatus("success");
      }
    } catch (error) {
      setStatus("error");
      setErrors([{ field: "general", message: "Failed to load profile" }]);
    }
  }, [currentUserId]);

  // Auto-save functionality
  const autoSave = useCallback(
    async (data: Partial<ProfileFormData>) => {
      if (!profile) return;

      setSaveStatus("saving");
      try {
        const response = await profileAPI.updateProfile({
          id: profile.id,
          ...data,
        });

        if ("success" in response && response.success) {
          setProfile(response.profile);
          setSaveStatus("saved");
          setIsDirty(false);

          // Clear saved status after 2 seconds
          setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          setSaveStatus("error");
        }
      } catch (error) {
        setSaveStatus("error");
      }
    },
    [profile],
  );

  // Debounced auto-save
  const debouncedAutoSave = useCallback(
    (data: Partial<ProfileFormData>) => {
      setIsDirty(true);

      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave(data);
      }, 1000); // Auto-save after 1 second of inactivity
    },
    [autoSave],
  );

  // Update profile field
  const updateField = useCallback(
    (field: keyof ProfileFormData, value: any) => {
      if (!profile) return;

      // Optimistic update
      setProfile((prev) => (prev ? { ...prev, [field]: value } : null));

      // Trigger auto-save
      debouncedAutoSave({ [field]: value });
    },
    [profile, debouncedAutoSave],
  );

  // Manual save
  const saveProfile = useCallback(
    async (data: Partial<ProfileFormData>) => {
      if (!profile) return;

      setSaveStatus("saving");
      try {
        const response = await profileAPI.updateProfile({
          id: profile.id,
          ...data,
        });

        if ("success" in response && response.success) {
          setProfile(response.profile);
          setSaveStatus("saved");
          setIsDirty(false);
          setErrors([]);

          setTimeout(() => setSaveStatus("idle"), 2000);
          return { success: true };
        } else {
          setSaveStatus("error");
          return { success: false, error: "Failed to save profile" };
        }
      } catch (error) {
        setSaveStatus("error");
        return { success: false, error: "Failed to save profile" };
      }
    },
    [profile],
  );

  // Refresh profile
  const refreshProfile = useCallback(() => {
    loadProfile();
  }, [loadProfile]);

  // Load profile on mount
  useEffect(() => {
    if (currentUserId) {
      loadProfile();
    }
  }, [loadProfile, currentUserId]);

  // Cleanup auto-save timeout
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    profile,
    status,
    saveStatus,
    errors,
    isDirty,
    updateField,
    saveProfile,
    refreshProfile,
    isLoading: status === "loading",
    isError: status === "error",
    isSaving: saveStatus === "saving",
    isSaved: saveStatus === "saved",
  };
};

export const useProfileSocialLinks = (profileId?: string) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addSocialLink = useCallback(
    async (socialLink: Omit<SocialLink, "id">) => {
      if (!profileId) return;

      setIsLoading(true);

      // Optimistic update
      const tempSocialLink: SocialLink = {
        ...socialLink,
        id: `temp-${Date.now()}`,
      };
      setSocialLinks((prev) => [...prev, tempSocialLink]);

      try {
        const response = await profileAPI.addSocialLink(profileId, socialLink);

        if ("success" in response && response.success) {
          // Replace temp with real social link
          setSocialLinks((prev) =>
            prev.map((sl) =>
              sl.id === tempSocialLink.id ? response.socialLink : sl,
            ),
          );
        } else {
          // Revert optimistic update
          setSocialLinks((prev) =>
            prev.filter((sl) => sl.id !== tempSocialLink.id),
          );
        }
      } catch (error) {
        setSocialLinks((prev) =>
          prev.filter((sl) => sl.id !== tempSocialLink.id),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [profileId],
  );

  const updateSocialLink = useCallback(
    async (socialLinkId: string, updates: Partial<SocialLink>) => {
      if (!profileId) return;

      // Optimistic update
      setSocialLinks((prev) =>
        prev.map((sl) => (sl.id === socialLinkId ? { ...sl, ...updates } : sl)),
      );

      try {
        const response = await profileAPI.updateSocialLink(
          profileId,
          socialLinkId,
          updates,
        );

        if ("success" in response && response.success) {
          setSocialLinks((prev) =>
            prev.map((sl) =>
              sl.id === socialLinkId ? response.socialLink : sl,
            ),
          );
        }
      } catch (error) {
        // Could implement revert logic here
      }
    },
    [profileId],
  );

  const deleteSocialLink = useCallback(
    async (socialLinkId: string) => {
      if (!profileId) return;

      // Optimistic update
      const originalSocialLinks = socialLinks;
      setSocialLinks((prev) => prev.filter((sl) => sl.id !== socialLinkId));

      try {
        const response = await profileAPI.deleteSocialLink(
          profileId,
          socialLinkId,
        );

        if (!("success" in response && response.success)) {
          // Revert if failed
          setSocialLinks(originalSocialLinks);
        }
      } catch (error) {
        setSocialLinks(originalSocialLinks);
      }
    },
    [profileId, socialLinks],
  );

  return {
    socialLinks,
    setSocialLinks,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    isLoading,
  };
};

export const useProfileAnalytics = (profileId?: string) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(
    async (days = 30) => {
      if (!profileId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await profileAPI.getProfileAnalytics(profileId, days);

        if ("success" in response && response.success) {
          setAnalytics(response);
        } else {
          setError("Failed to load analytics");
        }
      } catch (error) {
        setError("Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    },
    [profileId],
  );

  useEffect(() => {
    if (profileId) {
      loadAnalytics();
    }
  }, [loadAnalytics, profileId]);

  return {
    analytics,
    isLoading,
    error,
    refreshAnalytics: loadAnalytics,
  };
};

export const useProfileImageUpload = (profileId?: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (file: File, type: "profile" | "cover" = "profile") => {
      if (!profileId || !file) return;

      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        const response = await profileAPI.uploadProfileImage(profileId, file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        if ("success" in response && response.success) {
          setTimeout(() => {
            setUploadProgress(0);
            setIsUploading(false);
          }, 500);

          return response.image;
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        setError("Failed to upload image");
        setIsUploading(false);
        setUploadProgress(0);
        return null;
      }
    },
    [profileId],
  );

  return {
    uploadImage,
    isUploading,
    uploadProgress,
    error,
  };
};

// Form validation hook
export const useProfileValidation = () => {
  const validateProfile = useCallback(
    (data: Partial<ProfileFormData>): ValidationError[] => {
      const errors: ValidationError[] = [];

      if (data.firstName !== undefined && !data.firstName.trim()) {
        errors.push({ field: "firstName", message: "First name is required" });
      }

      if (data.lastName !== undefined && !data.lastName.trim()) {
        errors.push({ field: "lastName", message: "Last name is required" });
      }

      if (data.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          errors.push({
            field: "email",
            message: "Please enter a valid email address",
          });
        }
      }

      if (data.phone !== undefined && data.phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ""))) {
          errors.push({
            field: "phone",
            message: "Please enter a valid phone number",
          });
        }
      }

      if (data.website !== undefined && data.website) {
        try {
          new URL(data.website);
        } catch {
          errors.push({
            field: "website",
            message: "Please enter a valid website URL",
          });
        }
      }

      if (data.customUrl !== undefined) {
        const urlRegex = /^[a-z0-9-]+$/;
        if (!urlRegex.test(data.customUrl)) {
          errors.push({
            field: "customUrl",
            message:
              "URL can only contain lowercase letters, numbers, and hyphens",
          });
        }
      }

      return errors;
    },
    [],
  );

  return { validateProfile };
};
