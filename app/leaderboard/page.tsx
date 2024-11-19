// app/leaderboard/page.tsx

import { Suspense } from "react";

import LeaderboardTitle from "@/components/3DMap/leaderboard-title";
import LeaderboardTable from "@/components/3DMap/leaderboard-table";

export default function Leaderboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="p-4">
                <LeaderboardTitle />
                <LeaderboardTable />
            </div>
        </Suspense>
    );
}
