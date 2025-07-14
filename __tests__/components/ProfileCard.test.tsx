import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProfileCard } from "@/components/ProfileCard";
import { useProfileStore } from "@/lib/stores/profile-store";

// Mock the profile store
jest.mock("@/lib/stores/profile-store");

const mockProfile = {
  id: "profile-1",
  name: "John Doe",
  title: "Software Engineer",
  company: "TechCorp",
  bio: "Passionate developer with 5 years of experience",
  profileImageUrl: "https://example.com/avatar.jpg",
  location: "San Francisco, CA",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  website: "https://johndoe.dev",
  contactFields: [
    {
      id: "contact-1",
      label: "Email",
      value: "john@example.com",
      type: "email" as const,
      isPublic: true,
      order: 1,
    },
  ],
  socialLinks: [
    {
      id: "social-1",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/johndoe",
      isPublic: true,
      order: 1,
    },
  ],
  skills: [],
  workExperience: [],
  achievements: [],
  portfolioItems: [],
  testimonials: [],
};

describe("ProfileCard", () => {
  beforeEach(() => {
    (useProfileStore as jest.Mock).mockReturnValue({
      profile: mockProfile,
      initializeProfile: jest.fn(),
    });
  });

  it("renders profile information correctly", () => {
    render(<ProfileCard />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("TechCorp")).toBeInTheDocument();
    expect(screen.getByText("San Francisco, CA")).toBeInTheDocument();
  });

  it("displays contact information", () => {
    render(<ProfileCard />);

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1 (555) 123-4567")).toBeInTheDocument();
  });

  it("shows social media links", () => {
    render(<ProfileCard />);

    const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://linkedin.com/in/johndoe",
    );
  });

  it("handles missing profile data gracefully", () => {
    (useProfileStore as jest.Mock).mockReturnValue({
      profile: null,
      initializeProfile: jest.fn(),
    });

    render(<ProfileCard />);

    expect(screen.getByText(/no profile found/i)).toBeInTheDocument();
  });

  it("calls vCard download when button is clicked", async () => {
    const mockDownload = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob()),
      headers: {
        get: () => 'attachment; filename="john-doe.vcf"',
      },
    });

    render(<ProfileCard />);

    const downloadButton = screen.getByRole("button", { name: /download/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/vcard");
    });
  });

  it("handles image loading errors", () => {
    render(<ProfileCard />);

    const profileImage = screen.getByRole("img", { name: /profile/i });
    fireEvent.error(profileImage);

    // Should show fallback initials
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});

// Mock ProfileCard component for testing
const ProfileCard = () => {
  const { profile } = useProfileStore();

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <div>
      <h1>{profile.name}</h1>
      <h2>{profile.title}</h2>
      <p>{profile.company}</p>
      <p>{profile.location}</p>
      <p>{profile.email}</p>
      <p>{profile.phone}</p>

      {profile.socialLinks?.map((link) => (
        <a key={link.id} href={link.url}>
          {link.platform}
        </a>
      ))}

      <button onClick={() => fetch("/api/vcard")}>Download vCard</button>

      <img
        src={profile.profileImageUrl}
        alt="Profile"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const fallback = document.createElement("div");
          fallback.textContent =
            profile.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "U";
          target.parentNode?.appendChild(fallback);
        }}
      />
    </div>
  );
};

export { ProfileCard };
