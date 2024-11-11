import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata } from "next";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
    title: "GMaps 3D Challenge",
    description: "A challenge to use Google Maps 3D map.",
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
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable,
                )}
            >
                <Providers
                    themeProps={{ attribute: "class", defaultTheme: "light" }}
                >
                    <Navbar />
                    <main>{children}</main>
                </Providers>
            </body>
        </html>
    );
}
