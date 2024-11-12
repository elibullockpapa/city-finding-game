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
    allowedCountries?: string[],
): Promise<City | null> {
    try {
        // Fetch the cities data
        const response = await fetch("/filteredCities.json");
        const cities: City[] = await response.json();

        // Filter cities based on population and country criteria
        const filteredCities = cities.filter((city) => {
            const matchesPopulation =
                city.population >= minPopulation &&
                city.population <= maxPopulation;

            // If allowedCountries is empty or undefined, don't filter by country
            const matchesCountry =
                !allowedCountries?.length ||
                allowedCountries.includes(city.countryName);

            return matchesPopulation && matchesCountry;
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
