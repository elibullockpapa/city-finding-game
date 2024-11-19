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
export const DIFFICULTY_SETTINGS: Record<string, DifficultySettings> = {
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
        coverImage: "/images/quebec.png",
    },
    hard: {
        name: "Hard Mode",
        minPop: 1_000_000,
        cities: 5,
        noLabels: false,
        coverImage: "/images/gqeberha.png",
    },
    extreme: {
        name: "Extreme Mode",
        minPop: 100_000,
        cities: 5,
        noLabels: false,
        coverImage: "/images/alcalá-de-henares.png",
    },
    impossible: {
        name: "Impossible Mode",
        minPop: 50_000,
        maxPop: 1_000_000,
        cities: 5,
        noLabels: true,
        coverImage: "/images/warwick.png",
    },
    usa: {
        name: "USA Mode",
        minPop: 200_000,
        cities: 5,
        noLabels: false,
        allowedCountries: ["United States"],
        coverImage: "/images/usa.png",
    },
    custom: {
        name: "Custom Mode",
        minPop: 0,
        cities: 5,
        noLabels: false,
        coverImage: "/images/generic-globe.png",
    },
};
