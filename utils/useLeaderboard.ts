// utils/useLeaderboard.ts

"use client";
import { useMutation } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useAsyncList } from "@react-stately/data";

import { useSupabase } from "./supabase/client";

// -- COMMANDS USED TO SET UP SUPBASE TABLE AND RLS POLCIES -- //

// -- Drop existing objects
// DROP POLICY IF EXISTS "Read leaderboard policy" ON "public"."leaderboard";
// DROP POLICY IF EXISTS "Insert leaderboard policy" ON "public"."leaderboard";
// DROP TABLE IF EXISTS "public"."leaderboard";
// DROP FUNCTION IF EXISTS requesting_user_id();

// -- Create function and table
// CREATE OR REPLACE FUNCTION requesting_user_id()
// RETURNS TEXT AS $$
//     SELECT NULLIF(
//         current_setting('request.jwt.claims', true)::json->>'sub',
//         ''
//     )::text;
// $$ LANGUAGE SQL STABLE;

// CREATE TABLE leaderboard (
//     entry_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//     user_id text not null default requesting_user_id(),
//     username TEXT NOT NULL,
//     profile_picture_url TEXT,
//     time_seconds INTEGER NOT NULL,
//     cities_found INTEGER NOT NULL,
//     found_cities JSONB NOT NULL,  -- Stores the array of city objects
//     min_population INTEGER NOT NULL,
//     max_population INTEGER NOT NULL,
//     allowed_countries TEXT[] NOT NULL,  -- Simple text array
//     excluded_countries TEXT[] NOT NULL,  -- Simple text array
//     labels_disabled BOOLEAN NOT NULL DEFAULT false,
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
// );

// -- Enable RLS and create policies
// ALTER TABLE "public"."leaderboard" ENABLE ROW LEVEL SECURITY;

// CREATE POLICY "Read leaderboard policy" ON "public"."leaderboard"
// FOR SELECT TO public
// USING (true);

// CREATE POLICY "Insert leaderboard policy" ON "public"."leaderboard"
// FOR INSERT TO authenticated
// WITH CHECK (
//     requesting_user_id () = user_id
// );

// Types for the leaderboard entry
export interface FoundCity {
    name: string;
    country_name: string;
    state_code?: string | null;
    seconds_spent_searching: number;
}

export interface LeaderboardEntry {
    entry_id?: string;
    user_id: string;
    username: string;
    profile_picture_url: string;
    time_seconds: number;
    cities_found: number;
    found_cities: FoundCity[];
    min_population: number;
    max_population: number;
    allowed_countries: string[];
    excluded_countries: string[];
    labels_disabled: boolean;
    created_at: Date;
}

export interface LeaderboardFilters {
    min_population?: number;
    max_population?: number;
    cities_count?: number;
    allowed_countries?: string[];
    excluded_countries?: string[];
    labels_disabled?: boolean;
    page?: number;
    pageSize?: number;
}

// Supabase data functions
const fetchLeaderboard = async (
    client: SupabaseClient,
    filters?: LeaderboardFilters,
): Promise<{ data: LeaderboardEntry[]; total: number }> => {
    const pageSize = filters?.pageSize || 10;
    const page = filters?.page || 1;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    console.log(`Fetching leaderboard from ${from} to ${to}`);

    let query = client
        .from("leaderboard")
        .select("*", { count: "exact" })
        .order("time_seconds", { ascending: true })
        .order("created_at", { ascending: true })
        .range(from, to);

    // Apply filters
    if (filters?.min_population) {
        query = query.eq("min_population", filters.min_population);
    }
    if (filters?.max_population) {
        query = query.eq("max_population", filters.max_population);
    }
    if (filters?.cities_count) {
        query = query.eq("cities_found", filters.cities_count);
    }
    if (filters?.labels_disabled !== undefined) {
        query = query.eq("labels_disabled", filters.labels_disabled);
    }
    if (filters?.allowed_countries && filters.allowed_countries.length > 0) {
        query = query.contains("allowed_countries", filters.allowed_countries);
    }
    if (filters?.excluded_countries && filters.excluded_countries.length > 0) {
        query = query.contains(
            "excluded_countries",
            filters.excluded_countries,
        );
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
        data: data ?? [],
        total: count ?? 0,
    };
};

const submitScore = async (
    client: SupabaseClient,
    entry: Omit<
        LeaderboardEntry,
        | "entry_id"
        | "created_at"
        | "user_id"
        | "username"
        | "profile_picture_url"
    >,
    user: { id: string; username: string | null; imageUrl: string },
): Promise<LeaderboardEntry> => {
    // Add user info to entry
    const entryWithUserInfo: Omit<LeaderboardEntry, "user_id" | "created_at"> =
        {
            ...entry,
            username: user.username ?? "",
            profile_picture_url: user.imageUrl,
        };

    const { data, error } = await client
        .from("leaderboard")
        .insert(entryWithUserInfo)
        .select()
        .single();

    if (error) throw error;

    return data;
};

// React Query hook
export function useLeaderboard(filters?: LeaderboardFilters) {
    const client = useSupabase();
    const { user, isLoaded: isUserLoaded } = useUser();
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [total, setTotal] = useState<number>(0);

    const list = useAsyncList<LeaderboardEntry>({
        async load({ cursor }) {
            if (!client) throw new Error("Supabase client not initialized");

            const page = cursor ? parseInt(cursor) : 1;
            const pageSize = filters?.pageSize || 10;

            const result = await fetchLeaderboard(client, {
                ...filters,
                page,
                pageSize,
            });

            setTotal(result.total);

            if (!cursor) {
                setIsInitialLoading(false);
            }

            return {
                items: result.data,
                cursor:
                    result.total > page * pageSize
                        ? String(page + 1)
                        : undefined,
            };
        },
    });

    // Mutation for submitting scores
    const submitScoreMutation = useMutation({
        mutationFn: (
            entry: Omit<
                LeaderboardEntry,
                | "entry_id"
                | "created_at"
                | "user_id"
                | "username"
                | "profile_picture_url"
            >,
        ) => {
            if (!client) throw new Error("Not authenticated");
            if (!user || !isUserLoaded) throw new Error("User Info Not Found");

            return submitScore(client, entry, user);
        },
        onSuccess: () => {
            list.reload();
        },
    });

    return {
        leaderboard: list.items,
        isLoading: list.isLoading,
        isInitialLoading,
        loadMore: list.loadMore,
        hasMore: total > list.items.length,
        submitScore: submitScoreMutation.mutate,
        total,
    };
}
