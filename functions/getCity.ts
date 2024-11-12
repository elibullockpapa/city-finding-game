// functions/getCity.ts

interface CityCoordinates {
    lon: number;
    lat: number;
}

export interface City {
    name: string;
    countryName: string;
    population: number;
    modificationDate: string;
    timezone: string;
    coordinates: CityCoordinates;
}

export async function getRandomCity(
    minPopulation: number,
    maxPopulation: number,
): Promise<City | null> {
    try {
        // Fetch the cities data
        const response = await fetch("/filteredCities.json");
        const cities: City[] = await response.json();

        // Filter cities based on population criteria
        const filteredCities = cities.filter(
            (city) =>
                city.population >= minPopulation &&
                city.population <= maxPopulation,
        );

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
