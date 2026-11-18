import type { Metadata } from "next";
import Script from "next/script";
import { display, body, mono } from "@/lib/fonts";
import { siteConfig } from "@/lib/seo";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { UIProvider } from "@/components/providers/UIProvider";
import { Loader } from "@/components/chrome/Loader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Loader />
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}
