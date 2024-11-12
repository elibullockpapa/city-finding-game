"use client";
import { Button, Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";

// Add this type definition before DIFFICULTY_SETTINGS
type DifficultySettings = {
    minPop: number;
    maxPop: number;
    cities: number;
    noLabels: boolean;
    allowedCountries?: string[];
};

// Update the const declaration
const DIFFICULTY_SETTINGS: Record<string, DifficultySettings> = {
    easy: {
        minPop: 7_000_000,
        maxPop: 100_000_000,
        cities: 3,
        noLabels: false,
    },
    medium: {
        minPop: 2_000_000,
        maxPop: 100_000_000,
        cities: 5,
        noLabels: false,
    },
    hard: {
        minPop: 1_000_000,
        maxPop: 100_000_000,
        cities: 5,
        noLabels: false,
    },
    extreme: {
        minPop: 100_000,
        maxPop: 100_000_000,
        cities: 5,
        noLabels: false,
    },
    impossible: {
        minPop: 50_000,
        maxPop: 100_000_000,
        cities: 5,
        noLabels: true,
    },
    usa: {
        minPop: 100_000,
        maxPop: 100_000_000,
        cities: 5,
        noLabels: false,
        allowedCountries: ["United States"],
    },
};

export default function Home() {
    const router = useRouter();

    const startGame = (difficulty: keyof typeof DIFFICULTY_SETTINGS) => {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        const params = new URLSearchParams({
            minPop: settings.minPop.toString(),
            maxPop: settings.maxPop.toString(),
            cities: settings.cities.toString(),
            noLabels: settings.noLabels.toString(),
            allowedCountries: settings.allowedCountries
                ? JSON.stringify(settings.allowedCountries)
                : "[]",
        });

        router.push(`/play?${params.toString()}`);
    };

    return (
        <div className="h-dvh flex flex-col items-center justify-center">
            <Card className="p-8 max-w-2xl w-full items-center">
                <h1 className="text-4xl font-bold text-center mb-4">
                    City Finding Game
                </h1>

                <p className="text-center mb-8">
                    Find cities around the world by clicking on their location.
                    If you get stuck, you can use hints, but they come at a
                    cost!
                </p>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <Button
                        color="primary"
                        size="lg"
                        variant="ghost"
                        onPress={() => startGame("easy")}
                    >
                        <span className="text-2xl mr-1">🌟</span>
                        Easy Mode
                    </Button>

                    <Button
                        color="primary"
                        size="lg"
                        variant="ghost"
                        onPress={() => startGame("usa")}
                    >
                        <span className="text-2xl mr-1">🇺🇸</span>
                        USA Mode
                    </Button>

                    <Button
                        color="primary"
                        size="lg"
                        variant="ghost"
                        onPress={() => startGame("medium")}
                    >
                        <span className="text-2xl mr-1">🎯</span>
                        Medium Mode
                    </Button>

                    <Button
                        color="primary"
                        size="lg"
                        variant="ghost"
                        onPress={() => startGame("hard")}
                    >
                        <span className="text-2xl mr-1">💪</span>
                        Hard Mode
                    </Button>

                    <Button
                        color="primary"
                        size="lg"
                        variant="ghost"
                        onPress={() => startGame("extreme")}
                    >
                        <span className="text-2xl mr-1">🔥</span>
                        Extreme Mode
                    </Button>

                    <Button
                        color="primary"
                        size="lg"
                        variant="ghost"
                        onPress={() => startGame("impossible")}
                    >
                        <span className="text-2xl mr-1">💀</span>
                        Impossible Mode
                    </Button>
                </div>
            </Card>
        </div>
    );
}
