import type { UserProfile } from "@/lib/types/profile";

export class ProfileService {
  static async getProfile(): Promise<{
    success: boolean;
    profile?: UserProfile;
    error?: string;
  }> {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (data.success) {
        return { success: true, profile: data.profile };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  }

  static async updateProfile(
    updates: Partial<UserProfile>,
  ): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, profile: data.profile };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  }

  static async getPublicProfile(
    identifier: string,
  ): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    try {
      const response = await fetch(`/api/profile/${identifier}`);
      const data = await response.json();

      if (data.success) {
        return { success: true, profile: data.profile };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  }

  static async uploadImage(
    file: File,
    type: "profile" | "cover" | "portfolio",
  ): Promise<{ success: boolean; image?: any; error?: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, image: data.image };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Upload failed" };
    }
  }

  static async deleteImage(
    imageId: string,
    type: "profile" | "cover",
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `/api/upload?imageId=${imageId}&type=${type}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Delete failed" };
    }
  }

  static async updateContactFields(
    contactFields: any[],
  ): Promise<{ success: boolean; contactFields?: any[]; error?: string }> {
    try {
      const response = await fetch("/api/profile/contact-fields", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactFields }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, contactFields: data.contactFields };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Update failed" };
    }
  }

  static async downloadVCard(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/vcard");

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
          response.headers
            .get("content-disposition")
            ?.split("filename=")[1]
            ?.replace(/"/g, "") || "contact.vcf";
        link.click();
        window.URL.revokeObjectURL(url);

        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Download failed" };
    }
  }

  static async generatePublicVCard(
    profileId: string,
  ): Promise<{
    success: boolean;
    vcard?: string;
    filename?: string;
    error?: string;
  }> {
    try {
      const response = await fetch("/api/vcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, vcard: data.vcard, filename: data.filename };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Generation failed" };
    }
  }
}
