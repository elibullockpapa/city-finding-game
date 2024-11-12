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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Navbar } from "../navbar";

import { Marker3D } from "./marker-3d";

import { Map3D, Map3DCameraProps } from "@/components/3DMap/map-3d";
import { City, getRandomCity } from "@/functions/getCity";
import { calculateDistance } from "@/functions/distance";

// Begin game far above New York City
const INITIAL_VIEW_PROPS = {
    center: { lat: 40.7079, lng: -74.0132, altitude: 20000000 },
    range: 0,
    heading: 0,
    tilt: 0,
    roll: 0,
};

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

    // Parse URL parameters with fallback values
    const minPopulation = Number(searchParams.get("minPop")) || 500_000;
    const maxPopulation = Number(searchParams.get("maxPop")) || 100_000_000;
    const disableMapLabels = searchParams.get("noLabels") === "true";
    const citiesToFind = Number(searchParams.get("cities")) || 5;

    // useEffect for initial component mount, starts the timer and loads the initial city
    useEffect(() => {
        if (isGameComplete) return; // Stop timer if game is complete

        const interval = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);

        // Load initial city
        const loadInitialCity = async () => {
            const city = await getRandomCity(minPopulation, maxPopulation);

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
            city = await getRandomCity(minPopulation, maxPopulation);
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
                        position: "bottom-right",
                        autoClose: 2000,
                    },
                );
                loadNewCity();
            }
        } else {
            setTimer((prev) => prev + 5);
            toast.error(
                <div>
                    <p>{`You're ${Math.round(distance)} miles away from ${currentCity.name}`}</p>
                    <p className="text-sm">+5 second penalty</p>
                </div>,
                {
                    position: "bottom-right",
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

    return (
        <div className="relative w-full h-dvh">
            <ToastContainer />
            <Navbar />
            <Map3D
                {...viewProps}
                defaultLabelsDisabled={disableMapLabels}
                onCameraChange={handleCameraChange}
                onClick={handleMapClick}
            >
                {selectedMarker && <Marker3D position={selectedMarker} />}
            </Map3D>

            <Card className="absolute top-28 left-4 p-4 z-10 w-96">
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

            <Modal hideCloseButton isDismissable={false} isOpen={isOpen}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1" />
                    <ModalBody className="text-center">
                        <p className="text-xl mb-4">
                            {`🎉 You've found all ${citiesToFind} cities! 🎉`}
                        </p>
                        <p className="text-2xl font-bold">
                            Final Time: {Math.floor(timer / 60)}:
                            {(timer % 60).toString().padStart(2, "0")}
                        </p>

                        {/* Play Again / Home buttons */}
                        <div className="flex gap-2 mt-4">
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
                        </div>
                    </ModalBody>
                    <ModalFooter />
                </ModalContent>
            </Modal>
        </div>
    );
}
