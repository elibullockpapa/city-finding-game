// functions/getCity.ts

interface CityCoordinates {
    lon: number;
    lat: number;
}

export interface City {
    name: string;
    countryName: string;
    population: number;
    coordinates: CityCoordinates;
    stateCode: string | null;
}

// Define an interface for the options object
interface GetRandomCityOptions {
    minPopulation: number;
    maxPopulation: number;
    allowedCountries?: string[];
    excludedCountries?: string[];
}

export async function getRandomCity(
    options: GetRandomCityOptions,
): Promise<City | null> {
    try {
        // Fetch the cities data
        const response = await fetch("/filteredCities.json");
        const cities: City[] = await response.json();

        // Filter cities based on population, allowed, and excluded countries
        const filteredCities = cities.filter((city) => {
            const matchesPopulation =
                city.population >= options.minPopulation &&
                city.population <= options.maxPopulation;

            const matchesAllowed =
                !options.allowedCountries?.length ||
                options.allowedCountries.includes(city.countryName);

            const matchesExcluded =
                !options.excludedCountries?.length ||
                !options.excludedCountries.includes(city.countryName);

            return matchesPopulation && matchesAllowed && matchesExcluded;
        });

        // If no cities match the criteria, return null
        if (filteredCities.length === 0) {
            return null;
        }

        // Return a random city from the filtered list
        const randomIndex = Math.floor(Math.random() * filteredCities.length);

        return filteredCities[randomIndex];
    } catch (error) {
        console.error("Error fetching or processing cities:", error);

        return null;
    }
}
