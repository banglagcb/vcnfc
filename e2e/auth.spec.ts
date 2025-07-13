import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should allow user to register", async ({ page }) => {
    // Navigate to registration
    await page.click("text=Sign Up");

    // Fill registration form
    await page.fill("[data-testid=name-input]", "Test User");
    await page.fill("[data-testid=email-input]", "test@example.com");
    await page.fill("[data-testid=password-input]", "Password123!");

    // Submit form
    await page.click("[data-testid=register-button]");

    // Should redirect to profile page
    await expect(page).toHaveURL("/profile");

    // Should show success message
    await expect(page.locator("[data-testid=success-message]")).toBeVisible();
  });

  test("should allow user to login", async ({ page }) => {
    // Navigate to login
    await page.click("text=Sign In");

    // Fill login form
    await page.fill("[data-testid=email-input]", "existing@example.com");
    await page.fill("[data-testid=password-input]", "password123");

    // Submit form
    await page.click("[data-testid=login-button]");

    // Should redirect to profile page
    await expect(page).toHaveURL("/profile");
  });

  test("should handle login errors", async ({ page }) => {
    await page.click("text=Sign In");

    // Fill with invalid credentials
    await page.fill("[data-testid=email-input]", "invalid@example.com");
    await page.fill("[data-testid=password-input]", "wrongpassword");

    await page.click("[data-testid=login-button]");

    // Should show error message
    await expect(page.locator("[data-testid=error-message]")).toBeVisible();
    await expect(page.locator("[data-testid=error-message]")).toContainText(
      "Invalid email or password",
    );
  });

  test("should logout user", async ({ page }) => {
    // Login first
    await page.goto("/profile");

    // Logout
    await page.click("[data-testid=logout-button]");

    // Should redirect to home
    await expect(page).toHaveURL("/");
  });
});

test.describe("Profile Management", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route("/api/auth/me", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          user: {
            id: "test-user",
            email: "test@example.com",
            name: "Test User",
            verified: true,
          },
        }),
      });
    });

    await page.goto("/profile");
  });

  test("should allow profile editing", async ({ page }) => {
    // Enter edit mode
    await page.click("[data-testid=edit-button]");

    // Update profile fields
    await page.fill("[data-testid=first-name-input]", "John");
    await page.fill("[data-testid=last-name-input]", "Doe");
    await page.fill("[data-testid=title-input]", "Software Engineer");

    // Save changes
    await page.click("[data-testid=save-button]");

    // Should show success message
    await expect(page.locator("[data-testid=save-success]")).toBeVisible();
  });

  test("should upload profile image", async ({ page }) => {
    // Click upload button
    await page.click("[data-testid=upload-image-button]");

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles("test-assets/profile.jpg");

    // Should show upload progress
    await expect(page.locator("[data-testid=upload-progress]")).toBeVisible();

    // Should update profile image
    await expect(page.locator("[data-testid=profile-image]")).toHaveAttribute(
      "src",
      /cloudinary/,
    );
  });

  test("should manage contact fields", async ({ page }) => {
    // Add new contact field
    await page.click("[data-testid=add-contact-button]");

    await page.fill("[data-testid=contact-label-input]", "LinkedIn");
    await page.fill(
      "[data-testid=contact-value-input]",
      "https://linkedin.com/in/johndoe",
    );
    await page.selectOption("[data-testid=contact-type-select]", "website");

    await page.click("[data-testid=save-contact-button]");

    // Should appear in contact list
    await expect(page.locator("[data-testid=contact-list]")).toContainText(
      "LinkedIn",
    );
  });
});

test.describe("Business Card Preview", () => {
  test("should display public profile", async ({ page }) => {
    await page.goto("/preview");

    // Should show profile information
    await expect(page.locator("[data-testid=profile-name]")).toBeVisible();
    await expect(page.locator("[data-testid=profile-title]")).toBeVisible();
    await expect(page.locator("[data-testid=contact-info]")).toBeVisible();
  });

  test("should download vCard", async ({ page }) => {
    await page.goto("/preview");

    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent("download");

    await page.click("[data-testid=download-vcard-button]");

    const download = await downloadPromise;

    // Verify the download
    expect(download.suggestedFilename()).toMatch(/\.vcf$/);
  });

  test("should share profile", async ({ page }) => {
    await page.goto("/preview");

    // Mock navigator.share
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", {
        value: jest.fn().mockResolvedValue(undefined),
        writable: true,
      });
    });

    await page.click("[data-testid=share-profile-button]");

    // Should show success message or use fallback
    await expect(
      page.locator("[data-testid=share-success], [data-testid=copy-success]"),
    ).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("should work on mobile devices", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Should show mobile navigation
    await expect(
      page.locator("[data-testid=mobile-menu-button]"),
    ).toBeVisible();

    // Navigation should work
    await page.click("[data-testid=mobile-menu-button]");
    await expect(page.locator("[data-testid=mobile-menu]")).toBeVisible();
  });

  test("should work on tablet devices", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/profile");

    // Should adapt layout for tablet
    await expect(page.locator("[data-testid=profile-layout]")).toHaveClass(
      /tablet-layout/,
    );
  });
});

test.describe("Performance", () => {
  test("should load quickly", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("should have good accessibility", async ({ page }) => {
    await page.goto("/");

    // Check for accessibility violations
    const accessibilityResults = await page.accessibility.snapshot();
    expect(accessibilityResults).toBeTruthy();
  });
});
