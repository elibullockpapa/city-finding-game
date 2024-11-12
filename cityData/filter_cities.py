import json

# Load the JSON data from the file
with open('allCities.json', 'r') as f:
    cities = json.load(f)

# Filter cities and retain only required fields
filtered_cities = [
    {
        "name": city["name"],
        "countryName": city["cou_name_en"],
        "population": city["population"],
        "modificationDate": city["modification_date"],
        "timezone": city["timezone"],
        "coordinates": city["coordinates"]
    }
    for city in cities
    if city.get('population', 0) >= 10000 and 'coordinates' in city and city['coordinates'] is not None
]

# Calculate the combined population
combined_population = sum(city["population"] for city in filtered_cities)

# Print total number of filtered cities and combined population
print(f"Total filtered cities: {len(filtered_cities)}")
print(f"Combined population of filtered cities: {combined_population}")

# Save the filtered data back to a new JSON file without Unicode escaping
with open('filteredCities.json', 'w') as f:
    json.dump(filtered_cities, f, indent=4, ensure_ascii=False)

print("Filtered cities saved to filteredCities.json")
