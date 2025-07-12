export interface ProfileImage {
  id: string;
  url: string;
  alt: string;
  size: number;
  type: string;
  createdAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  displayName?: string;
  isPublic: boolean;
  order: number;
}

export interface ContactField {
  id: string;
  label: string;
  value: string;
  type: "email" | "phone" | "url" | "text";
  icon?: string;
  isPublic: boolean;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
  yearsOfExperience?: number;
  isEndorsed: boolean;
  endorsements: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  issuer: string;
  dateEarned: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  skills: string[];
  achievements: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  repositoryUrl?: string;
  technologies: string[];
  category: string;
  featured: boolean;
  completedDate: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number;
  dateReceived: string;
  isPublic: boolean;
}

export interface ProfileAnalytics {
  id: string;
  profileId: string;
  views: number;
  contacts: number;
  shares: number;
  cardTaps: number;
  date: string;
}

export interface ProfileSettings {
  isPublic: boolean;
  showAnalytics: boolean;
  allowContact: boolean;
  allowDownload: boolean;
  theme: "modern" | "professional" | "creative" | "minimal";
  customCSS?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  // Basic Info
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  department?: string;
  bio: string;
  location: string;
  timezone: string;

  // Contact Info
  email: string;
  phone?: string;
  website?: string;
  address?: string;

  // Media
  profileImage?: ProfileImage;
  coverImage?: ProfileImage;

  // Professional Info
  workExperience: WorkExperience[];
  skills: Skill[];
  achievements: Achievement[];
  portfolio: PortfolioItem[];

  // Social & Contact
  socialLinks: SocialLink[];
  contactFields: ContactField[];

  // Social Proof
  testimonials: Testimonial[];

  // Configuration
  settings: ProfileSettings;
  customUrl: string;

  // Analytics
  analytics: ProfileAnalytics[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isVerified: boolean;
  isPremium: boolean;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  department?: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  customUrl: string;
}

export interface ProfileUpdatePayload extends Partial<ProfileFormData> {
  id: string;
}

export interface CreateProfilePayload extends ProfileFormData {
  userId: string;
}

// API Response types
export interface ProfileResponse {
  profile: UserProfile;
  success: boolean;
  message?: string;
}

export interface ProfilesResponse {
  profiles: UserProfile[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}

export interface ProfileAnalyticsResponse {
  analytics: ProfileAnalytics;
  trends: {
    viewsChange: number;
    contactsChange: number;
    sharesChange: number;
  };
  success: boolean;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ProfileValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// API Error types
export interface APIError {
  code: string;
  message: string;
  field?: string;
}

export interface ProfileError {
  success: false;
  error: APIError;
}

// Utility types
export type ProfileUpdateField = keyof ProfileFormData;
export type ProfileStatus = "loading" | "success" | "error" | "idle";
export type SaveStatus = "saving" | "saved" | "error" | "idle";
