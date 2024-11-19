// components/3DMap/city-finding-globe.tsx
"use client";

import { useCallback, useState, useEffect } from "react";
import { Button, Card, useDisclosure } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Marker3D } from "./marker-3d";
import EndGameModal from "./end-game-modal";

import { Map3D, Map3DCameraProps } from "@/components/3DMap/map-3d";
import { City, getRandomCity } from "@/utils/getCity";
import { calculateDistance } from "@/utils/distance";
import { formatTime } from "@/utils/formatTime";

// Begin game far above New York City
const INITIAL_VIEW_PROPS = {
    center: { lat: 40.7079, lng: -74.0132, altitude: 15000000 },
    range: 0,
    heading: 0,
    tilt: 0,
    roll: 0,
};

interface CityProgress {
    city: City;
    startTime: number;
    penalties: number;
}

export default function CityFindingGlobe() {
    const searchParams = useSearchParams();

    // States
    const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);
    const [selectedMarker, setSelectedMarker] =
        useState<google.maps.LatLngAltitudeLiteral | null>(null);
    const [timer, setTimer] = useState(0);
    const [cityCount, setCityCount] = useState(0);
    const [showCountry, setShowCountry] = useState(false);
    const [showPopulation, setShowPopulation] = useState(false);
    const { isOpen, onOpen } = useDisclosure();
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [cityProgressList, setCityProgressList] = useState<CityProgress[]>(
        [],
    );
    const [currentCityIndex, setCurrentCityIndex] = useState<number>(0);

    // URL parameters with fallback values
    const minPopulation = Number(searchParams.get("minPop")) || 500_000;
    const maxPopulation = Number(searchParams.get("maxPop")) || 100_000_000;
    const disableMapLabels = searchParams.get("noLabels") === "true";
    const citiesToFind = Number(searchParams.get("cities")) || 5;
    const allowedCountries = searchParams.get("allowedCountries")
        ? JSON.parse(searchParams.get("allowedCountries")!)
        : [];
    const excludedCountries = searchParams.get("excludedCountries")
        ? JSON.parse(searchParams.get("excludedCountries")!)
        : [];

    // useEffect for initial component mount, starts the timer and loads the initial city
    useEffect(() => {
        if (isGameComplete) return; // Stop timer if game is complete

        const interval = setInterval(() => {
            setTimer((prev) => prev + 0.1);
        }, 100);

        // Load initial city with updated options
        const loadInitialCity = async () => {
            const city = await getRandomCity({
                minPopulation,
                maxPopulation,
                allowedCountries,
                excludedCountries,
            });

            if (!city) return; // null check

            setCityProgressList([
                {
                    city: city,
                    startTime: timer,
                    penalties: 0,
                },
            ]);
            setCurrentCityIndex(0);
        };

        loadInitialCity();

        return () => {
            clearInterval(interval);
        };
    }, [isGameComplete]);

    // Helper function to load a new city (not the initial)
    const loadNewCity = async () => {
        let city: City | null = null;
        let tryCount = 0;

        setShowCountry(false);
        setShowPopulation(false);

        while (
            tryCount < 5 &&
            (!city ||
                city.name === cityProgressList[currentCityIndex]?.city.name)
        ) {
            city = await getRandomCity({
                minPopulation,
                maxPopulation,
                allowedCountries,
                excludedCountries,
            });
            tryCount++;
        }

        if (city) {
            setCityProgressList((prevList) => [
                ...prevList,
                {
                    city: city!,
                    startTime: timer,
                    penalties: 0,
                },
            ]);
            setCurrentCityIndex((prevIndex) => prevIndex + 1);
            setSelectedMarker(null);
        }
    };

    const handleSubmitGuess = () => {
        if (!selectedMarker || !cityProgressList[currentCityIndex]?.city)
            return;

        const distance = calculateDistance(
            selectedMarker.lat,
            selectedMarker.lng,
            cityProgressList[currentCityIndex].city.coordinates.lat,
            cityProgressList[currentCityIndex].city.coordinates.lon,
        );

        if (distance <= 50) {
            const newCityCount = cityCount + 1;

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
                    {
                        toastId: `correct-${newCityCount}`,
                        autoClose: 1000,
                    },
                );
                loadNewCity();
            }
        } else {
            // Minimum penalty of 1, maximum of 60, otherwise distance/100
            const penalty = Math.round(
                Math.min(60, Math.max(1, distance / 100)),
            );

            setTimer((prev) => prev + penalty);
            setCityProgressList((prevList) => {
                const updatedList = [...prevList];

                updatedList[currentCityIndex].penalties += penalty;

                return updatedList;
            });
            toast.error(
                <div>
                    <p>{`${Math.round(distance)} miles away from ${cityProgressList[currentCityIndex].city.name}`}</p>
                    <p className="text-sm">+${penalty} second penalty</p>
                </div>,
                {
                    toastId: `error-${Math.round(distance)}`,
                    autoClose: 3000,
                },
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

    const handleSkip = async () => {
        setTimer((prev) => prev + 60);
        setCityProgressList((prevList) => {
            const updatedList = [...prevList];

            updatedList[currentCityIndex].penalties += 60;

            return updatedList;
        });
        await loadNewCity();
    };

    return (
        <div className="relative w-full h-dvh">
            <ToastContainer
                draggable
                hideProgressBar
                pauseOnHover
                position="bottom-right"
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

            <Card className="absolute left-4 right-4 top-16 md:left-4 md:right-auto md:w-96 p-4 z-10">
                <div className="text-lg font-bold break-words">
                    {!cityProgressList[currentCityIndex]?.city
                        ? "Loading..."
                        : `Search For: ${cityProgressList[currentCityIndex]?.city.name}`}
                </div>
                <div className="text-sm">
                    {`Time: ${formatTime(timer)} (${cityCount + 1}/${citiesToFind})`}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                        className="flex-1 min-w-[100px]"
                        color="danger"
                        size="sm"
                        variant="flat"
                        onPress={handleSkip}
                    >
                        Skip (+60)
                    </Button>

                    {/* Show state button if only one country is allowed and it's the USA */}
                    {allowedCountries.length === 1 &&
                    allowedCountries[0] === "United States" ? (
                        <Button
                            className="flex-1 min-w-[100px]"
                            color={showCountry ? "default" : "danger"}
                            size="sm"
                            variant="flat"
                            onPress={() => {
                                if (!showCountry) {
                                    setShowCountry(true);
                                    setTimer((prev) => prev + 30);
                                    setCityProgressList((prevList) => {
                                        const updatedList = [...prevList];

                                        updatedList[
                                            currentCityIndex
                                        ].penalties += 30;

                                        return updatedList;
                                    });
                                }
                            }}
                        >
                            {showCountry
                                ? `${cityProgressList[currentCityIndex]?.city.countryName}`
                                : "Country (+30)"}
                        </Button>
                    ) : (
                        // Show country button
                        <Button
                            className="flex-1 min-w-[100px]"
                            color={showCountry ? "default" : "danger"}
                            size="sm"
                            variant="flat"
                            onPress={() => {
                                if (!showCountry) {
                                    setShowCountry(true);
                                    setTimer((prev) => prev + 30);
                                    setCityProgressList((prevList) => {
                                        const updatedList = [...prevList];

                                        updatedList[
                                            currentCityIndex
                                        ].penalties += 30;

                                        return updatedList;
                                    });
                                }
                            }}
                        >
                            {showCountry
                                ? `${cityProgressList[currentCityIndex]?.city.countryName}`
                                : "Country (+30)"}
                        </Button>
                    )}

                    {/* Show population */}
                    <Button
                        className="flex-1 min-w-[100px]"
                        color={showPopulation ? "default" : "danger"}
                        size="sm"
                        variant="flat"
                        onPress={() => {
                            if (!showPopulation) {
                                setShowPopulation(true);
                                setTimer((prev) => prev + 2);
                                setCityProgressList((prevList) => {
                                    const updatedList = [...prevList];

                                    updatedList[currentCityIndex].penalties +=
                                        2;

                                    return updatedList;
                                });
                            }
                        }}
                    >
                        {showPopulation
                            ? `${cityProgressList[currentCityIndex]?.city.population?.toLocaleString()}`
                            : "Population (+2)"}
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

            <EndGameModal
                cityProgressList={cityProgressList}
                isOpen={isOpen}
                timer={timer}
                onClose={onOpen}
            />
        </div>
    );
}
