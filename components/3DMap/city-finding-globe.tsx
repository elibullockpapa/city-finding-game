// components/3DMap/city-finding-globe.tsx
"use client";

import { useCallback, useState, useEffect } from "react";
import {
    Button,
    Card,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

import { Marker3D } from "./marker-3d";

import { Map3D, Map3DCameraProps } from "@/components/3DMap/map-3d";
import { City, getRandomCity } from "@/functions/getCity";
import { calculateDistance } from "@/functions/distance";

// Begin game far above New York City
const INITIAL_VIEW_PROPS = {
    center: { lat: 40.7079, lng: -74.0132, altitude: 15000000 },
    range: 0,
    heading: 0,
    tilt: 0,
    roll: 0,
};

interface CityInfo {
    name: string;
    image?: string;
    description?: string;
    wikiLink?: string;
}

export default function CityFindingGlobe() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);
    const [selectedMarker, setSelectedMarker] =
        useState<google.maps.LatLngAltitudeLiteral | null>(null);
    const [currentCity, setCurrentCity] = useState<City | null>(null);
    const [timer, setTimer] = useState(0);
    const [cityCount, setCityCount] = useState(0);
    const [showCountry, setShowCountry] = useState(false);
    const [showPopulation, setShowPopulation] = useState(false);
    const { isOpen, onOpen } = useDisclosure();
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [completedCities, setCompletedCities] = useState<City[]>([]);
    const [cityInfo, setCityInfo] = useState<CityInfo[]>([]);

    // Parse URL parameters with fallback values
    const minPopulation = Number(searchParams.get("minPop")) || 500_000;
    const maxPopulation = Number(searchParams.get("maxPop")) || 100_000_000;
    const disableMapLabels = searchParams.get("noLabels") === "true";
    const citiesToFind = Number(searchParams.get("cities")) || 5;
    const allowedCountries = searchParams.get("allowedCountries")
        ? JSON.parse(searchParams.get("allowedCountries")!)
        : [];

    // useEffect for initial component mount, starts the timer and loads the initial city
    useEffect(() => {
        if (isGameComplete) return; // Stop timer if game is complete

        const interval = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);

        // Load initial city
        const loadInitialCity = async () => {
            const city = await getRandomCity(
                minPopulation,
                maxPopulation,
                allowedCountries,
            );

            setCurrentCity(city);
        };

        loadInitialCity();

        return () => {
            clearInterval(interval);
        };
    }, [isGameComplete]);

    // Helper function to load a new city (not the initial)
    const loadNewCity = async () => {
        let city = null;

        setShowCountry(false);
        setShowPopulation(false);

        while (!city || city.name === currentCity?.name) {
            city = await getRandomCity(
                minPopulation,
                maxPopulation,
                allowedCountries,
            );
        }

        setCurrentCity(city);
        setSelectedMarker(null);
    };

    const handleSubmitGuess = () => {
        if (!selectedMarker || !currentCity) return;

        const distance = calculateDistance(
            selectedMarker.lat,
            selectedMarker.lng,
            currentCity.coordinates.lat,
            currentCity.coordinates.lon,
        );

        if (distance <= 50) {
            const newCityCount = cityCount + 1;

            setCompletedCities((prev) => [...prev, currentCity]);

            setCityCount(newCityCount);

            if (newCityCount >= citiesToFind) {
                setIsGameComplete(true);
                onOpen();
            } else {
                toast.success(
                    <div>
                        <p>Correct!</p>
                        <p className="text-sm">{`Going to city ${newCityCount + 1} of ${citiesToFind}...`}</p>
                    </div>,
                );
                loadNewCity();
            }
        } else {
            setTimer((prev) => prev + 5);
            toast.error(
                <div>
                    <p>{`${Math.round(distance)} miles away from ${currentCity.name}`}</p>
                    <p className="text-sm">+5 second penalty</p>
                </div>,
            );
        }
    };

    const handleCameraChange = useCallback((props: Map3DCameraProps) => {
        setViewProps((oldProps) => ({ ...oldProps, ...props }));
    }, []);

    const handleMapClick = useCallback(
        (position: google.maps.LatLngAltitude) => {
            setSelectedMarker(position);
        },
        [],
    );

    useEffect(() => {
        const fetchCityInfo = async () => {
            if (isGameComplete && completedCities.length > 0) {
                const info = await Promise.all(
                    completedCities.map(async (city) => {
                        try {
                            // Build a more specific search query
                            let searchQuery = city.name;

                            if (city.stateCode) {
                                searchQuery += `, ${city.stateCode}`;
                            }
                            if (city.countryName && !city.stateCode) {
                                searchQuery += `, ${city.countryName}`;
                            }

                            const response = await fetch(
                                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`,
                            );
                            const data = await response.json();

                            return {
                                name: city.name,
                                image: data.thumbnail?.source,
                                description: data.extract,
                                wikiLink: data.content_urls?.desktop?.page,
                            };
                        } catch (error) {
                            return { name: city.name };
                        }
                    }),
                );

                setCityInfo(info);
            }
        };

        fetchCityInfo();
    }, [isGameComplete, completedCities]);

    return (
        <div className="relative w-full h-dvh">
            <ToastContainer
                closeOnClick
                draggable
                hideProgressBar
                newestOnTop
                pauseOnFocusLoss
                pauseOnHover
                autoClose={3000}
                position="bottom-right"
                rtl={false}
                theme="colored"
                transition={Bounce}
            />
            <Map3D
                {...viewProps}
                defaultLabelsDisabled={disableMapLabels}
                onCameraChange={handleCameraChange}
                onClick={handleMapClick}
            >
                {selectedMarker && <Marker3D position={selectedMarker} />}
            </Map3D>

            <Card className="absolute top-16 left-4 p-4 z-10 w-96">
                <div className="text-lg font-bold">
                    {`Search For: ${currentCity?.name}`}
                </div>
                <div className="text-sm">
                    {`Time: ${Math.floor(timer / 60)}:${(timer % 60)
                        .toString()
                        .padStart(2, "0")} (${cityCount + 1}/${citiesToFind})`}
                </div>
                <div className="flex gap-2 mt-4">
                    <Button
                        color="danger"
                        variant="flat"
                        onPress={async () => {
                            setTimer((prev) => prev + 60);
                            await loadNewCity();
                        }}
                    >
                        Skip (+60)
                    </Button>

                    {/* Show state button if only one country is allowed and it's the USA */}
                    {allowedCountries.length === 1 &&
                    allowedCountries[0] === "United States" ? (
                        <Button
                            color={showCountry ? "default" : "danger"}
                            variant="flat"
                            onPress={() => {
                                if (!showCountry) {
                                    setShowCountry(true);
                                    setTimer((prev) => prev + 30);
                                }
                            }}
                        >
                            {showCountry
                                ? `${currentCity?.stateCode}`
                                : "State (+30)"}
                        </Button>
                    ) : (
                        // Show country button
                        <Button
                            color={showCountry ? "default" : "danger"}
                            variant="flat"
                            onPress={() => {
                                if (!showCountry) {
                                    setShowCountry(true);
                                    setTimer((prev) => prev + 30);
                                }
                            }}
                        >
                            {showCountry
                                ? `${currentCity?.countryName}`
                                : "Country (+30)"}
                        </Button>
                    )}

                    {/* Show population */}
                    <Button
                        color={showPopulation ? "default" : "danger"}
                        variant="flat"
                        onPress={() => {
                            if (!showPopulation) {
                                setShowPopulation(true);
                                setTimer((prev) => prev + 10);
                            }
                        }}
                    >
                        {showPopulation
                            ? `${currentCity?.population?.toLocaleString()}`
                            : "Population (+10)"}
                    </Button>
                </div>
                <div className="flex gap-2 mt-2">
                    <Button
                        fullWidth
                        color="success"
                        isDisabled={!selectedMarker}
                        onPress={handleSubmitGuess}
                    >
                        Submit Guess
                    </Button>
                </div>
            </Card>

            <Modal
                hideCloseButton
                backdrop="blur"
                isDismissable={false}
                isOpen={isOpen}
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <p className="text-xl text-center">
                            {`🎉 You've found all ${citiesToFind} cities! 🎉`}
                        </p>
                        <p className="text-2xl font-bold text-center">
                            Final Time: {Math.floor(timer / 60)}:
                            {(timer % 60).toString().padStart(2, "0")}
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <Swiper
                            pagination
                            className="w-full h-screen" // h-screen is needed to keep dots from being cut off, not sure why
                            modules={[Pagination]}
                            spaceBetween={30}
                        >
                            {cityInfo.map((city, index) => (
                                <SwiperSlide key={index}>
                                    <div className="flex flex-col items-center">
                                        <h3 className="text-xl font-bold mb-2">
                                            {city.name}
                                        </h3>
                                        {city.image && (
                                            <img
                                                alt={city.name}
                                                className="w-full h-40 object-cover rounded-lg mb-2"
                                                src={city.image}
                                            />
                                        )}
                                        {city.description && (
                                            <p className="text-sm mb-2 line-clamp-3">
                                                {city.description}
                                            </p>
                                        )}
                                        {city.wikiLink && (
                                            <a
                                                className="text-blue-500 hover:underline pb-4"
                                                href={city.wikiLink}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            >
                                                Learn More
                                            </a>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            fullWidth
                            className=""
                            color="primary"
                            onPress={() => router.push("/")}
                        >
                            Home
                        </Button>
                        <Button
                            fullWidth
                            className=""
                            color="success"
                            onPress={() => window.location.reload()}
                        >
                            Play Again
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
