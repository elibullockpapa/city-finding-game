// components/3DMap/leaderboard-table.tsx
"use client";

import {
    Button,
    Spinner,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    User,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

import { useLeaderboard } from "@/utils/useLeaderboard";
import { formatTime } from "@/utils/formatTime";

export default function LeaderboardTable() {
    const searchParams = useSearchParams();

    // URL parameters for leaderboard
    const minPopulation = Number(searchParams.get("minPop")) || 500_000;
    const maxPopulation = Number(searchParams.get("maxPop")) || 100_000_000;
    const allowedCountries = searchParams.get("allowedCountries")
        ? JSON.parse(searchParams.get("allowedCountries")!)
        : [];
    const excludedCountries = searchParams.get("excludedCountries")
        ? JSON.parse(searchParams.get("excludedCountries")!)
        : [];

    const { leaderboard, hasMore, loadMore, isLoading, isInitialLoading } =
        useLeaderboard({
            min_population: minPopulation,
            max_population: maxPopulation,
            allowed_countries: allowedCountries,
            excluded_countries: excludedCountries,
            pageSize: 10,
        });

    return (
        <Table
            isHeaderSticky
            aria-label="Leaderboard"
            bottomContent={
                hasMore ? (
                    <div className="flex w-full justify-center">
                        <Button
                            isDisabled={isLoading}
                            variant="flat"
                            onPress={loadMore}
                        >
                            {isLoading && <Spinner size="sm" />}
                            Load More
                        </Button>
                    </div>
                ) : null
            }
            classNames={{
                wrapper: "max-h-[400px] overflow-scroll",
                base: "",
                table: "",
            }}
        >
            <TableHeader>
                <TableColumn>#</TableColumn>
                <TableColumn>Player</TableColumn>
                <TableColumn>Time</TableColumn>
                <TableColumn>Date</TableColumn>
            </TableHeader>
            <TableBody
                isLoading={isInitialLoading}
                items={leaderboard.map((entry, index) => ({
                    ...entry,
                    rank: index + 1,
                }))}
                loadingContent={<Spinner label="Loading..." />}
            >
                {(item) => (
                    <TableRow key={item.entry_id}>
                        <TableCell>{item.rank}</TableCell>
                        <TableCell>
                            <User
                                avatarProps={{
                                    radius: "lg",
                                    src: item.profile_picture_url,
                                }}
                                name={item.username}
                            />
                        </TableCell>
                        <TableCell>{formatTime(item.time_seconds)}</TableCell>
                        <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
