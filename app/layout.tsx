import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
    title: "City Finding Game",
    description: "Your description here",
    icons: {
        icon: [
            {
                url: "favicons/favicon.ico",
                sizes: "any",
            },
            {
                url: "favicons/favicon-16x16.png",
                sizes: "16x16",
                type: "image/png",
            },
            {
                url: "favicons/favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
        ],
        apple: [
            {
                url: "favicons/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
        other: [
            {
                rel: "android-chrome-192x192",
                url: "favicons/android-chrome-192x192.png",
            },
            {
                rel: "android-chrome-512x512",
                url: "/favicons/android-chrome-512x512.png",
            },
        ],
    },
    manifest: "/site.webmanifest",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body
                suppressHydrationWarning
                className={clsx(
                    "min-h-dvh bg-background font-sans antialiased",
                    fontSans.variable,
                )}
            >
                <Providers
                    themeProps={{ attribute: "class", defaultTheme: "light" }}
                >
                    <Navbar />
                    <main>{children}</main>
                </Providers>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
