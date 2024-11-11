"use client";
import { SignedOut, useUser } from "@clerk/nextjs"; // Updated import
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { isSignedIn } = useUser(); // Access sign-in status

    useEffect(() => {
        if (isSignedIn) {
            const hasRedirected = localStorage.getItem("hasRedirected");

            if (!hasRedirected) {
                router.push("/map");
                localStorage.setItem("hasRedirected", "true");
            }
        } else {
            localStorage.removeItem("hasRedirected");
        }
    }, [isSignedIn, router]);

    return (
        <>
            <SignedOut>
                <p>Sign in to see the content</p>
            </SignedOut>
        </>
    );
}
