"use client";
import { Button, Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";

// Difficulty presets
const DIFFICULTY_SETTINGS = {
    easy: {
        minPop: 5_000_000,
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
                        color="success"
                        size="lg"
                        onPress={() => startGame("easy")}
                    >
                        Easy Mode
                    </Button>

                    <Button
                        color="primary"
                        size="lg"
                        onPress={() => startGame("medium")}
                    >
                        Medium Mode
                    </Button>

                    <Button
                        color="secondary"
                        size="lg"
                        onPress={() => startGame("hard")}
                    >
                        Hard Mode
                    </Button>

                    <Button
                        color="danger"
                        size="lg"
                        onPress={() => startGame("extreme")}
                    >
                        Extreme Mode
                    </Button>
                    <Button
                        color="default"
                        size="lg"
                        onPress={() => startGame("impossible")}
                    >
                        Impossible Mode
                    </Button>
                </div>
            </Card>
        </div>
    );
}
