// app/account/page.tsx
"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const AccountButton = () => {
    return (
        <>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </>
    );
};

export default AccountButton;
