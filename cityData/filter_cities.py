import json

# Load the JSON data from the file
with open('./cityData/allCities.json', 'r') as f:
    cities = json.load(f)

# Define country name mappings
country_name_mappings = {
    "Viet Nam": "Vietnam",
    "Moldova, Republic of": "Moldova",
    "Macedonia, The former Yugoslav Rep. of": "North Macedonia",
    "Sudan, The Republic of": "Sudan",
    "Tanzania, United Republic of": "Tanzania",
    "Venezuela, Bolivarian Rep. of": "Venezuela",
    "Congo, Democratic Republic of the": "Democratic Republic of the Congo",
    "Libyan Arab Jamahiriya": "Libya",
    "Taiwan, China": "Taiwan",
    "Korea, Republic of": "South Korea",
    "South Sudan, The Republic of": "South Sudan",
    "Iran, Islamic Rep. of": "Iran",
    "Korea, Dem. People's Rep. of": "North Korea",
    "Lao People's Dem. Rep.": "Laos",
    "Syrian Arab Republic": "Syria",
    "Russian Federation": "Russia",
    "Swaziland": "Eswatini",
    "Hong Kong, China": "Hong Kong",
    "Macau, China": "Macau",
    "West Bank and Gaza Strip": "Palestine",
    "Côte d'Ivoire": "Ivory Coast",
    "Brunei Darussalam": "Brunei",
    "Timor-Leste": "East Timor",
    "Sao Tome and Principe": "São Tomé and Príncipe",
    "Virgin Islands (US)": "U.S. Virgin Islands"
}

# Filter cities and retain only required fields
filtered_cities = [
    {
        "name": city["name"],
        "countryName": country_name_mappings.get(city["cou_name_en"], city["cou_name_en"]),
        "population": city["population"],
        "coordinates": city["coordinates"],
        "stateCode": city["admin1_code"] if city["cou_name_en"] == "United States" else None
    }
    for city in cities
    if city.get('population', 0) >= 10000 
    and 'coordinates' in city 
    and city['coordinates'] is not None 
    and city.get("cou_name_en")  # Ensure country name exists
]

# Calculate the combined population
combined_population = sum(city["population"] for city in filtered_cities)

# Print total number of filtered cities and combined population
print(f"Total filtered cities: {len(filtered_cities)}")
print(f"Combined population of filtered cities: {combined_population}")

# Get unique country names and print them
country_names = sorted(set(city["countryName"] for city in filtered_cities))
print("\nList of countries:")
for country in country_names:
    print(f"{country}")

# Save the filtered data back to a new JSON file without Unicode escaping
with open('./public/filteredCities.json', 'w') as f:
    json.dump(filtered_cities, f, indent=4, ensure_ascii=False)

print("Filtered cities saved to ./public/filteredCities.json")
