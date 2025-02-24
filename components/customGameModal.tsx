// components/customGameModal.tsx
"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Checkbox,
    Select,
    SelectItem,
} from "@heroui/react";
import { useState } from "react";

type CustomGameModalProps = {
    isOpen: boolean;
    onOpenChange: () => void;
    onStartGame: (settings: {
        minPop: number;
        maxPop?: number;
        cities: number;
        noLabels: boolean;
        allowedCountries?: string[];
        excludedCountries?: string[];
    }) => void;
};

export function CustomGameModal({
    isOpen,
    onOpenChange,
    onStartGame,
}: CustomGameModalProps) {
    const [minPop, setMinPop] = useState("100000");
    const [maxPop, setMaxPop] = useState("");
    const [cities, setCities] = useState("5");
    const [noLabels, setNoLabels] = useState(false);
    const [allowedCountries, setAllowedCountries] = useState<string[]>([]);
    const [excludedCountries, setExcludedCountries] = useState<string[]>([]);
    const [countryMode, setCountryMode] = useState<
        "all" | "allowed" | "excluded"
    >("all");

    const handleSubmit = () => {
        onStartGame({
            minPop: parseInt(minPop),
            maxPop: maxPop ? parseInt(maxPop) : undefined,
            cities: parseInt(cities),
            noLabels,
            allowedCountries:
                allowedCountries.length > 0 ? allowedCountries : undefined,
            excludedCountries:
                excludedCountries.length > 0 ? excludedCountries : undefined,
        });
    };

    return (
        <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Custom Game Settings</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <Input
                                        label="Minimum Population"
                                        type="number"
                                        value={minPop}
                                        onChange={(e) =>
                                            setMinPop(e.target.value)
                                        }
                                    />
                                    <Input
                                        label="Maximum Population (optional)"
                                        type="number"
                                        value={maxPop}
                                        onChange={(e) =>
                                            setMaxPop(e.target.value)
                                        }
                                    />
                                </div>
                                <Input
                                    label="Number of Cities"
                                    type="number"
                                    value={cities}
                                    onChange={(e) => setCities(e.target.value)}
                                />
                                <div className="flex gap-4">
                                    <Select
                                        fullWidth
                                        label="Country Selection"
                                        selectedKeys={new Set([countryMode])}
                                        onChange={(e) => {
                                            setCountryMode(
                                                e.target.value as
                                                | "all"
                                                | "allowed"
                                                | "excluded",
                                            );
                                            setAllowedCountries([]);
                                            setExcludedCountries([]);
                                        }}
                                    >
                                        <SelectItem key="all">
                                            Include all countries
                                        </SelectItem>
                                        <SelectItem key="allowed">
                                            Only include selected countries
                                        </SelectItem>
                                        <SelectItem key="excluded">
                                            Include all except selected
                                            countries
                                        </SelectItem>
                                    </Select>

                                    {countryMode !== "all" && (
                                        <Select
                                            label={
                                                countryMode === "allowed"
                                                    ? "Countries to Include"
                                                    : "Countries to Exclude"
                                            }
                                            selectedKeys={
                                                countryMode === "allowed"
                                                    ? new Set(allowedCountries)
                                                    : new Set(excludedCountries)
                                            }
                                            selectionMode="multiple"
                                            onSelectionChange={(keys) => {
                                                const countries = Array.from(
                                                    keys,
                                                ) as string[];

                                                if (countryMode === "allowed") {
                                                    setAllowedCountries(
                                                        countries,
                                                    );
                                                } else {
                                                    setExcludedCountries(
                                                        countries,
                                                    );
                                                }
                                            }}
                                        >
                                            {countryNames.map((country) => (
                                                <SelectItem key={country}>
                                                    {country}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                </div>
                                <Checkbox
                                    isSelected={noLabels}
                                    onValueChange={setNoLabels}
                                >
                                    Hide Labels
                                </Checkbox>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="bordered"
                                onPress={() => {
                                    const params = new URLSearchParams({
                                        minPop,
                                        ...(maxPop && { maxPop }),
                                        cities,
                                        ...(noLabels && { noLabels: "true" }),
                                        ...(allowedCountries.length > 0 && {
                                            allowedCountries:
                                                allowedCountries.join(","),
                                        }),
                                        ...(excludedCountries.length > 0 && {
                                            excludedCountries:
                                                excludedCountries.join(","),
                                        }),
                                    });

                                    navigator.clipboard.writeText(
                                        `${window.location.origin}?${params.toString()}`,
                                    );
                                }}
                            >
                                Copy Link
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => {
                                    handleSubmit();
                                    onClose();
                                }}
                            >
                                Start Game
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

const countryNames = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Faeroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Réunion",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "São Tomé and Príncipe",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "U.S. Virgin Islands",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
];
