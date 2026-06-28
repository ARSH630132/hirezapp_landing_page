import type { Metadata, Viewport } from "next";
import "./globals.css";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { ApiBaseUrlInterceptor } from "@/components/ApiBaseUrlInterceptor";

export const metadata: Metadata = {
  ...createPageMetadata(),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  icons: {
    icon: siteConfig.ogImage,
    shortcut: siteConfig.ogImage,
    apple: siteConfig.ogImage,
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans antialiased">
      <body className="min-h-full flex flex-col font-sans antialiased">
        <ApiBaseUrlInterceptor />
        {children}
      </body>
    </html>
  );
}

