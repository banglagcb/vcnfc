import type {
  UserProfile,
  CreateProfilePayload,
  ProfileUpdatePayload,
  ProfileResponse,
  ProfileAnalyticsResponse,
  ProfileError,
  SocialLink,
  ContactField,
  Skill,
  Achievement,
  WorkExperience,
  PortfolioItem,
  Testimonial,
  ProfileImage,
} from "@/lib/types/profile";

// Simulated API delay for development
const API_DELAY = 500;

// Mock database
let mockProfiles: UserProfile[] = [];
let mockAnalytics: any[] = [];

// Utility function to simulate API calls
const simulateAPI = <T>(data: T, delay = API_DELAY): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Profile CRUD operations
export const profileAPI = {
  // Get profile by ID
  async getProfile(id: string): Promise<ProfileResponse | ProfileError> {
    try {
      const profile = mockProfiles.find((p) => p.id === id);
      if (!profile) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Profile not found" },
        };
      }
      return await simulateAPI({ profile, success: true });
    } catch (error) {
      return {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to fetch profile" },
      };
    }
  },

  // Get profile by user ID
  async getProfileByUserId(
    userId: string,
  ): Promise<ProfileResponse | ProfileError> {
    try {
      const profile = mockProfiles.find((p) => p.userId === userId);
      if (!profile) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Profile not found" },
        };
      }
      return await simulateAPI({ profile, success: true });
    } catch (error) {
      return {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to fetch profile" },
      };
    }
  },

  // Create new profile
  async createProfile(
    data: CreateProfilePayload,
  ): Promise<ProfileResponse | ProfileError> {
    try {
      const now = new Date().toISOString();
      const newProfile: UserProfile = {
        id: generateId(),
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        company: data.company,
        department: data.department,
        bio: data.bio,
        location: data.location,
        timezone: "UTC",
        email: data.email,
        phone: data.phone,
        website: data.website,
        address: data.address,
        workExperience: [],
        skills: [],
        achievements: [],
        portfolio: [],
        socialLinks: [],
        contactFields: [],
        testimonials: [],
        settings: {
          isPublic: true,
          showAnalytics: true,
          allowContact: true,
          allowDownload: true,
          theme: "modern",
        },
        customUrl: data.customUrl,
        analytics: [],
        createdAt: now,
        updatedAt: now,
        isVerified: false,
        isPremium: false,
      };

      mockProfiles.push(newProfile);
      return await simulateAPI({ profile: newProfile, success: true });
    } catch (error) {
      return {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to create profile" },
      };
    }
  },

  // Update profile
  async updateProfile(
    data: ProfileUpdatePayload,
  ): Promise<ProfileResponse | ProfileError> {
    try {
      const profileIndex = mockProfiles.findIndex((p) => p.id === data.id);
      if (profileIndex === -1) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Profile not found" },
        };
      }

      const updatedProfile = {
        ...mockProfiles[profileIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockProfiles[profileIndex] = updatedProfile;
      return await simulateAPI({ profile: updatedProfile, success: true });
    } catch (error) {
      return {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to update profile" },
      };
    }
  },

  // Delete profile
  async deleteProfile(
    id: string,
  ): Promise<{ success: boolean } | ProfileError> {
    try {
      const profileIndex = mockProfiles.findIndex((p) => p.id === id);
      if (profileIndex === -1) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Profile not found" },
        };
      }

      mockProfiles.splice(profileIndex, 1);
      return await simulateAPI({ success: true });
    } catch (error) {
      return {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to delete profile" },
      };
    }
  },

  // Upload profile image
  async uploadProfileImage(
    profileId: string,
    file: File,
  ): Promise<{ image: ProfileImage; success: boolean } | ProfileError> {
    try {
      // Simulate image upload
      const imageUrl = URL.createObjectURL(file);
      const image: ProfileImage = {
        id: generateId(),
        url: imageUrl,
        alt: `Profile image for ${profileId}`,
        size: file.size,
        type: file.type,
        createdAt: new Date().toISOString(),
      };

      // Update profile with new image
      const profileIndex = mockProfiles.findIndex((p) => p.id === profileId);
      if (profileIndex !== -1) {
        mockProfiles[profileIndex].profileImage = image;
        mockProfiles[profileIndex].updatedAt = new Date().toISOString();
      }

      return await simulateAPI({ image, success: true });
    } catch (error) {
      return {
        success: false,
        error: { code: "UPLOAD_ERROR", message: "Failed to upload image" },
      };
    }
  },

  // Social Links CRUD
  async addSocialLink(
    profileId: string,
    socialLink: Omit<SocialLink, "id">,
  ): Promise<{ socialLink: SocialLink; success: boolean } | ProfileError> {
    try {
      const newSocialLink: SocialLink = { ...socialLink, id: generateId() };
      const profileIndex = mockProfiles.findIndex((p) => p.id === profileId);

      if (profileIndex === -1) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Profile not found" },
        };
      }

      mockProfiles[profileIndex].socialLinks.push(newSocialLink);
      mockProfiles[profileIndex].updatedAt = new Date().toISOString();

      return await simulateAPI({ socialLink: newSocialLink, success: true });
    } catch (error) {
      return {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to add social link" },
      };
    }
  },

  async updateSocialLink(
    profileId: string,
    socialLinkId: string,
    updates: Partial<SocialLink>,
  ): Promise<{ socialLink: SocialLink; success: boolean } | ProfileError> {
    try {
      const profileIndex = mockProfiles.findIndex((p) => p.id === profileId);
      if (profileIndex === -1) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Profile not found" },
        };
      }

      const socialLinkIndex = mockProfiles[profileIndex].socialLinks.findIndex(
        (sl) => sl.id === socialLinkId,
      );
      if (socialLinkIndex === -1) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Social link not found" },
        };
      }

      const updatedSocialLink = {
        ...mockProfiles[profileIndex].socialLinks[socialLinkIndex],
        ...updates,
      };
      mockProfiles[profileIndex].socialLinks[socialLinkIndex] =
        updatedSocialLink;
      mockProfiles[profileIndex].updatedAt = new Date().toISOString();

      return await simulateAPI({
        socialLink: updatedSocialLink,
        success: true,
      });
    } catch (error) {
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Failed to update social link",
        },
      };
    }
  },

  async deleteSocialLink(
    profileId: string,
    socialLinkId: string,
  ): Promise<{ success: boolean } | ProfileError> {
    try {
      const profileIndex = mockProfiles.findIndex((p) => p.id === profileId);
      if (profileIndex === -1) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Profile not found" },
        };
      }

      mockProfiles[profileIndex].socialLinks = mockProfiles[
        profileIndex
      ].socialLinks.filter((sl) => sl.id !== socialLinkId);
      mockProfiles[profileIndex].updatedAt = new Date().toISOString();

      return await simulateAPI({ success: true });
    } catch (error) {
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Failed to delete social link",
        },
      };
    }
  },

  // Analytics
  async getProfileAnalytics(
    profileId: string,
    days = 30,
  ): Promise<ProfileAnalyticsResponse | ProfileError> {
    try {
      // Generate mock analytics data
      const analytics = {
        id: generateId(),
        profileId,
        views: Math.floor(Math.random() * 1000),
        contacts: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        cardTaps: Math.floor(Math.random() * 200),
        date: new Date().toISOString(),
      };

      const trends = {
        viewsChange: Math.floor(Math.random() * 50) - 25,
        contactsChange: Math.floor(Math.random() * 20) - 10,
        sharesChange: Math.floor(Math.random() * 10) - 5,
      };

      return await simulateAPI({ analytics, trends, success: true });
    } catch (error) {
      return {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to fetch analytics" },
      };
    }
  },
};

// Initialize with sample data
export const initializeSampleProfile = (userId: string) => {
  const sampleProfile: UserProfile = {
    id: generateId(),
    userId,
    firstName: "WR",
    lastName: "Biswas",
    name: "WR Biswas",
    title: "Managing Director & CEO",
    company: "SHAREINFO",
    department: "Executive",
    bio: "Hello, I am the Managing Director & CEO of SHAREINFO. Working with new technology NFC smart business card.",
    location:
      "764, 5th Floor, West Shewrapara, Mirpur, Dhaka-1216 (Metro Rail Pillar No 304)",
    timezone: "Asia/Dhaka",
    email: "wr.biswas21@gmail.com",
    phone: "+8801723-128440",
    website: "https://www.sales.shareinfobd.com",
    address:
      "764, 5th Floor, West Shewrapara, Mirpur, Dhaka-1216 (Metro Rail Pillar No 304)",
    workExperience: [
      {
        id: generateId(),
        company: "SHAREINFO",
        position: "Managing Director & CEO",
        startDate: "2020-01-01",
        isCurrent: true,
        description:
          "Leading innovative NFC smart business card technology solutions, transforming traditional networking with cutting-edge digital business cards.",
        skills: [
          "NFC Technology",
          "Business Strategy",
          "Digital Innovation",
          "Team Leadership",
        ],
        achievements: [
          "Pioneered NFC smart business card technology in Bangladesh",
          "Built successful tech startup from ground up",
          "Established market leadership in digital business solutions",
        ],
      },
    ],
    skills: [
      {
        id: generateId(),
        name: "NFC Technology",
        level: "Expert",
        category: "Technology",
        yearsOfExperience: 8,
        isEndorsed: true,
        endorsements: 25,
      },
      {
        id: generateId(),
        name: "Business Development",
        level: "Expert",
        category: "Business",
        yearsOfExperience: 12,
        isEndorsed: true,
        endorsements: 30,
      },
      {
        id: generateId(),
        name: "Digital Marketing",
        level: "Advanced",
        category: "Marketing",
        yearsOfExperience: 10,
        isEndorsed: true,
        endorsements: 22,
      },
      {
        id: generateId(),
        name: "Smart Cards",
        level: "Expert",
        category: "Technology",
        yearsOfExperience: 6,
        isEndorsed: true,
        endorsements: 18,
      },
    ],
    achievements: [
      {
        id: generateId(),
        title: "AWS Certified Solutions Architect",
        description:
          "Professional level certification for designing distributed systems on AWS",
        issuer: "Amazon Web Services",
        dateEarned: "2023-06-15",
        credentialId: "AWS-SA-12345",
      },
    ],
    portfolioItems: [
      {
        id: generateId(),
        title: "NFC Smart Business Cards",
        description:
          "Revolutionary NFC-enabled business cards that instantly share contact information and social profiles with a simple tap.",
        technologies: ["NFC", "IoT", "Mobile Apps", "QR Codes"],
        category: "Hardware + Software",
        featured: true,
        completedDate: "2023-12-01",
      },
      {
        id: generateId(),
        title: "ShareInfo Platform",
        description:
          "Complete digital business card platform with analytics, contact management, and social integration.",
        technologies: ["React", "Node.js", "Mobile Apps", "Analytics"],
        category: "Web Platform",
        featured: true,
        completedDate: "2024-01-15",
      },
      {
        id: generateId(),
        title: "Digital Networking Solutions",
        description:
          "Suite of professional networking tools including virtual business cards, QR code generators, and contact management.",
        technologies: ["QR Technology", "Cloud Platform", "Mobile Integration"],
        category: "Business Solutions",
        featured: false,
        completedDate: "2023-08-20",
      },
    ],
    socialLinks: [
      {
        id: generateId(),
        platform: "Facebook",
        url: "https://facebook.com/shareinfo",
        icon: "facebook",
        displayName: "ShareInfo FB Page",
        isPublic: true,
        order: 1,
      },
      {
        id: generateId(),
        platform: "Instagram",
        url: "https://instagram.com/shareinfo",
        icon: "instagram",
        displayName: "Follow Instagram",
        isPublic: true,
        order: 2,
      },
      {
        id: generateId(),
        platform: "TikTok",
        url: "https://tiktok.com/@shareinfo",
        icon: "tiktok",
        displayName: "Follow TikTok",
        isPublic: true,
        order: 3,
      },
    ],
    contactFields: [
      {
        id: generateId(),
        label: "Phone",
        value: "+8801723-128440",
        type: "phone",
        icon: "phone",
        isPublic: true,
        order: 1,
      },
      {
        id: generateId(),
        label: "Email",
        value: "wr.biswas21@gmail.com",
        type: "email",
        icon: "email",
        isPublic: true,
        order: 2,
      },
      {
        id: generateId(),
        label: "Website",
        value: "www.sales.shareinfobd.com",
        type: "website",
        icon: "website",
        isPublic: true,
        order: 3,
      },
    ],
    testimonials: [
      {
        id: generateId(),
        name: "Sarah Johnson",
        position: "Product Manager",
        company: "TechCorp Inc.",
        content:
          "John is an exceptional developer who consistently delivers high-quality code and innovative solutions.",
        rating: 5,
        dateReceived: "2023-11-15",
        isPublic: true,
      },
    ],
    settings: {
      isPublic: true,
      showAnalytics: true,
      allowContact: true,
      allowDownload: true,
      theme: "modern",
    },
    customUrl: "john-doe-engineer",
    analytics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: true,
    isPremium: true,
  };

  mockProfiles.push(sampleProfile);
  return sampleProfile;
};
