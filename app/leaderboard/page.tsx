// app/leaderboard/page.tsx

import { Suspense } from "react";

import LeaderboardTable from "@/components/3DMap/leaderboard-table";

export default function Leaderboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LeaderboardTable />
        </Suspense>
    );
}
