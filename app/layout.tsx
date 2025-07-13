import type { Metadata } from "next";
import { ToastContainer } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShareInfo - NFC Smart Business Cards",
  description: "Professional NFC business cards for modern networking",
  generator: "ShareInfo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
          <ToastContainer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
