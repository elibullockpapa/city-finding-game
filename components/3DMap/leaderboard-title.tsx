"use client";

import { useSearchParams } from "next/navigation";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";

import { InfoIcon } from "@/components/icons";
import { DIFFICULTY_SETTINGS } from "@/utils/difficultySettings";

export default function LeaderboardTitle() {
    const searchParams = useSearchParams();
    const minPop = Number(searchParams.get("minPop"));
    const maxPop = Number(searchParams.get("maxPop"));
    const allowedCountries = searchParams.get("allowedCountries")
        ? JSON.parse(searchParams.get("allowedCountries")!)
        : [];
    const excludedCountries = searchParams.get("excludedCountries")
        ? JSON.parse(searchParams.get("excludedCountries")!)
        : [];

    // Find matching difficulty setting
    const matchingDifficulty = Object.entries(DIFFICULTY_SETTINGS).find(
        ([_, settings]) =>
            settings.minPop === minPop &&
            JSON.stringify(settings.allowedCountries || []) ===
                JSON.stringify(allowedCountries) &&
            JSON.stringify(settings.excludedCountries || []) ===
                JSON.stringify(excludedCountries),
    );

    const title = matchingDifficulty
        ? matchingDifficulty[1].name
        : "Custom Game";

    return (
        <div className="flex items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold">{title} Leaderboard</h1>
            <Popover placement="right">
                <PopoverTrigger>
                    <Button
                        isIconOnly
                        className="text-default-400"
                        size="sm"
                        variant="light"
                    >
                        <InfoIcon size={20} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="px-1 py-2">
                        <div className="text-small font-bold">
                            Game Settings
                        </div>
                        <div className="text-tiny">
                            <p>
                                Population: {minPop.toLocaleString()}
                                {maxPop ? ` - ${maxPop.toLocaleString()}` : "+"}
                            </p>
                            {allowedCountries.length > 0 && (
                                <p>Countries: {allowedCountries.join(", ")}</p>
                            )}
                            {excludedCountries.length > 0 && (
                                <p>Excluded: {excludedCountries.join(", ")}</p>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
