import { UserProfile } from "@/lib/types/profile";

export interface VCardData {
  name: string;
  title?: string;
  organization?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  note?: string;
  photo?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
}

export function generateVCard(profile: UserProfile): string {
  const vcard = [];

  // vCard version
  vcard.push("BEGIN:VCARD");
  vcard.push("VERSION:3.0");

  // Name
  if (profile.name) {
    // Format: Last;First;Middle;Prefix;Suffix
    const nameParts = profile.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName =
      nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    const middleName =
      nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

    vcard.push(`N:${lastName};${firstName};${middleName};;`);
    vcard.push(`FN:${profile.name}`);
  }

  // Title and Organization
  if (profile.title) {
    vcard.push(`TITLE:${profile.title}`);
  }

  if (profile.company) {
    vcard.push(`ORG:${profile.company}`);
  }

  // Contact Information
  const phoneField = profile.contactFields?.find(
    (field) =>
      field.type.toLowerCase() === "phone" ||
      field.type.toLowerCase() === "mobile",
  );
  if (phoneField?.value) {
    vcard.push(`TEL;TYPE=CELL:${phoneField.value}`);
  }

  const emailField = profile.contactFields?.find(
    (field) => field.type.toLowerCase() === "email",
  );
  if (emailField?.value) {
    vcard.push(`EMAIL;TYPE=INTERNET:${emailField.value}`);
  }

  const websiteField = profile.contactFields?.find(
    (field) =>
      field.type.toLowerCase() === "website" ||
      field.type.toLowerCase() === "url",
  );
  if (websiteField?.value) {
    vcard.push(`URL:${websiteField.value}`);
  }

  // Address
  if (profile.location) {
    vcard.push(`ADR;TYPE=WORK:;;${profile.location};;;;`);
  }

  // Note/Bio
  if (profile.bio) {
    vcard.push(`NOTE:${profile.bio}`);
  }

  // Photo
  if (profile.profileImage) {
    vcard.push(`PHOTO;VALUE=URL:${profile.profileImage}`);
  }

  // Social Links as URLs
  profile.socialLinks?.forEach((link) => {
    if (link.url) {
      vcard.push(`URL;TYPE=${link.platform.toUpperCase()}:${link.url}`);
    }
  });

  // End vCard
  vcard.push("END:VCARD");

  return vcard.join("\r\n");
}

export function downloadVCard(profile: UserProfile): void {
  const vcardContent = generateVCard(profile);
  const fileName = `${profile.name?.replace(/\s+/g, "_") || "contact"}.vcf`;

  const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}

export function shareProfile(profile: UserProfile): void {
  const profileUrl = `${window.location.origin}/preview`;
  const shareText = `Check out ${profile.name}'s professional profile: ${profile.title || "Professional"} at ${profile.company || "ShareInfo"}`;

  if (navigator.share) {
    navigator
      .share({
        title: `${profile.name} - Professional Profile`,
        text: shareText,
        url: profileUrl,
      })
      .catch((err) => {
        console.log("Error sharing:", err);
        fallbackShare(profileUrl, shareText);
      });
  } else {
    fallbackShare(profileUrl, shareText);
  }
}

function fallbackShare(url: string, text: string): void {
  // Copy to clipboard as fallback
  const shareContent = `${text}\n${url}`;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(shareContent)
      .then(() => {
        alert("Profile link copied to clipboard!");
      })
      .catch(() => {
        // Fallback to older method
        copyToClipboardFallback(shareContent);
      });
  } else {
    copyToClipboardFallback(shareContent);
  }
}

function copyToClipboardFallback(text: string): void {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    alert("Profile link copied to clipboard!");
  } catch (err) {
    alert("Unable to copy link. Please copy manually: " + text);
  }

  document.body.removeChild(textArea);
}

export function createContactActions(contactInfo: {
  type: string;
  value: string;
}) {
  const actions = {
    phone: (value: string) => {
      // Create individual vCard for just phone
      const phoneVCard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `TEL;TYPE=CELL:${value}`,
        "END:VCARD",
      ].join("\r\n");

      return {
        saveToPhone: () => {
          const blob = new Blob([phoneVCard], {
            type: "text/vcard;charset=utf-8",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `contact_${value.replace(/\D/g, "")}.vcf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        call: () => window.open(`tel:${value}`, "_self"),
        whatsapp: () =>
          window.open(`https://wa.me/${value.replace(/\D/g, "")}`, "_blank"),
        shareToFriend: () => {
          if (navigator.share) {
            navigator.share({
              title: "Contact Information",
              text: `Phone: ${value}`,
            });
          } else {
            navigator.clipboard?.writeText(value);
            alert("Phone number copied to clipboard!");
          }
        },
      };
    },
    email: (value: string) => ({
      saveToPhone: () => {
        const emailVCard = [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `EMAIL;TYPE=INTERNET:${value}`,
          "END:VCARD",
        ].join("\r\n");

        const blob = new Blob([emailVCard], {
          type: "text/vcard;charset=utf-8",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `contact_${value.split("@")[0]}.vcf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      email: () => window.open(`mailto:${value}`, "_self"),
      shareToFriend: () => {
        if (navigator.share) {
          navigator.share({
            title: "Contact Information",
            text: `Email: ${value}`,
          });
        } else {
          navigator.clipboard?.writeText(value);
          alert("Email copied to clipboard!");
        }
      },
    }),
    website: (value: string) => ({
      visit: () =>
        window.open(
          value.startsWith("http") ? value : `https://${value}`,
          "_blank",
        ),
      shareToFriend: () => {
        if (navigator.share) {
          navigator.share({
            title: "Website",
            text: `Visit: ${value}`,
            url: value.startsWith("http") ? value : `https://${value}`,
          });
        } else {
          navigator.clipboard?.writeText(value);
          alert("Website URL copied to clipboard!");
        }
      },
    }),
  };

  return (
    actions[contactInfo.type as keyof typeof actions]?.(contactInfo.value) || {}
  );
}
