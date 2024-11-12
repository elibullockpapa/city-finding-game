// app/page.tsx
"use client";
import { Button, Card, CardHeader, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

// Add this type definition before DIFFICULTY_SETTINGS
type DifficultySettings = {
    name: string;
    minPop: number;
    maxPop?: number;
    cities: number;
    noLabels: boolean;
    coverImage: string;
    allowedCountries?: string[];
    excludedCountries?: string[];
};

// Update the const declaration
const DIFFICULTY_SETTINGS: Record<string, DifficultySettings> = {
    easy: {
        name: "Easy Mode",
        minPop: 7_000_000,
        cities: 3,
        noLabels: false,
        coverImage: "/images/new-york-city.png",
        excludedCountries: ["China"],
    },
    medium: {
        name: "Medium Mode",
        minPop: 2_000_000,
        cities: 5,
        noLabels: false,
        coverImage: "/images/generic-globe.png",
    },
    hard: {
        name: "Hard Mode",
        minPop: 1_000_000,
        cities: 5,
        noLabels: false,
        coverImage: "/images/generic-globe.png",
    },
    extreme: {
        name: "Extreme Mode",
        minPop: 100_000,
        cities: 5,
        noLabels: false,
        coverImage: "/images/generic-globe.png",
    },
    impossible: {
        name: "Impossible Mode",
        minPop: 50_000,
        cities: 5,
        noLabels: true,
        coverImage: "/images/generic-globe.png",
    },
    usa: {
        name: "USA Mode",
        minPop: 200_000,
        cities: 5,
        noLabels: false,
        allowedCountries: ["United States"],
        coverImage: "/images/usa.png",
    },
};

export default function Home() {
    const router = useRouter();

    const startGame = (difficulty: keyof typeof DIFFICULTY_SETTINGS) => {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        const searchParams: {
            minPop: string;
            cities: string;
            noLabels: string;
            allowedCountries?: string;
            excludedCountries?: string;
            maxPop?: string;
        } = {
            minPop: settings.minPop.toString(),
            cities: settings.cities.toString(),
            noLabels: settings.noLabels.toString(),
        };

        if (settings.allowedCountries) {
            searchParams.allowedCountries = JSON.stringify(
                settings.allowedCountries,
            );
        }

        if (settings.excludedCountries) {
            searchParams.excludedCountries = JSON.stringify(
                settings.excludedCountries,
            );
        }

        if (settings.maxPop) {
            searchParams.maxPop = settings.maxPop.toString();
        }

        router.push(`/play?${new URLSearchParams(searchParams).toString()}`);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center bg-orange-900/5 overflow-auto">
            <div className="grid grid-cols-12 gap-4 p-4 w-full max-w-7xl">
                {Object.entries(DIFFICULTY_SETTINGS).map(
                    ([difficulty, settings]) => (
                        <Card
                            key={difficulty}
                            isFooterBlurred
                            className="w-full h-[300px] col-span-12 sm:col-span-6 lg:col-span-4"
                        >
                            <CardHeader className="absolute z-10 top-1 flex-col items-start bg-gray-800/5 backdrop-blur-lg rounded-none -mt-1">
                                <h4 className="text-white font-medium text-2xl">
                                    {settings.name}
                                </h4>
                                <p className="text-white/60 text-small">
                                    {settings.cities} cities,{" "}
                                    {settings.minPop.toLocaleString()}+
                                    population
                                </p>
                            </CardHeader>
                            <Image
                                removeWrapper
                                alt={`${difficulty} mode`}
                                className="z-0 w-full h-full object-cover"
                                src={settings.coverImage}
                            />
                            <CardFooter className="absolute bg-black/40 bottom-0 z-10 justify-between">
                                <div>
                                    <p className="text-white text-tiny">
                                        Labels:{" "}
                                        {settings.noLabels
                                            ? "Hidden"
                                            : "Visible"}
                                    </p>
                                    <p className="text-white text-tiny">
                                        Countries:{" "}
                                        {settings.allowedCountries
                                            ? settings.allowedCountries.join(
                                                  ", ",
                                              )
                                            : settings.excludedCountries
                                              ? `All excluding ${settings.excludedCountries.join(", ")}`
                                              : "No restrictions"}
                                    </p>
                                </div>
                                <Button
                                    className="text-tiny"
                                    color="primary"
                                    radius="full"
                                    size="sm"
                                    onPress={() =>
                                        startGame(
                                            difficulty as keyof typeof DIFFICULTY_SETTINGS,
                                        )
                                    }
                                >
                                    Start Game
                                </Button>
                            </CardFooter>
                        </Card>
                    ),
                )}
            </div>
        </div>
    );
}
