// utils/supabase/client.ts
"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single cached client instead of a Map
let cachedSupabaseClient: SupabaseClient | null = null;
let lastToken: string | null | undefined = undefined;

function createOrGetSupabaseClient(supabaseAccessToken: string | null) {
    // Return cached client if token hasn't changed
    if (supabaseAccessToken === lastToken && cachedSupabaseClient !== null) {
        return cachedSupabaseClient;
    }

    lastToken = supabaseAccessToken;

    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                ...(supabaseAccessToken && {
                    Authorization: `Bearer ${supabaseAccessToken}`,
                }),
            },
        },
    });

    cachedSupabaseClient = client;

    return client;
}

export function useSupabase() {
    const { session, isLoaded } = useSession();
    const [client, setClient] = useState<SupabaseClient | null>(null);

    useEffect(() => {
        if (!isLoaded) return;

        let isMounted = true;

        const initClient = async () => {
            let token: string | null = null;

            if (session) {
                token = await session.getToken({ template: "supabase" });
            }

            const supabaseClient = createOrGetSupabaseClient(token);

            if (isMounted) {
                setClient(supabaseClient);
            }
        };

        initClient();

        return () => {
            isMounted = false;
        };
    }, [isLoaded, session]);

    return client;
}
