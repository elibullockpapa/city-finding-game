// app/account/page.tsx
"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";

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
