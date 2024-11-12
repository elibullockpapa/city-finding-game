import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
    title: "City Finding Game",
    description: "A game to find cities on a 3D map.",
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
                    {/* <Navbar /> */}
                    <main>{children}</main>
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}
