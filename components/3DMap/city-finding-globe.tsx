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
    Tabs,
    Tab,
    CardFooter,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    User,
    Spinner,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Marker3D } from "./marker-3d";

import { Map3D, Map3DCameraProps } from "@/components/3DMap/map-3d";
import { City, getRandomCity } from "@/utils/getCity";
import { calculateDistance } from "@/utils/distance";
import { useLeaderboard } from "@/utils/useLeaderboard";

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

interface CityProgress {
    city: City;
    startTime: number;
    penalties: number;
    info?: CityInfo;
}

export default function CityFindingGlobe() {
    const router = useRouter();
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

    // Leaderboard
    const {
        leaderboard,
        submitScore,
        hasMore,
        loadMore,
        isLoading,
        isInitialLoading,
    } = useLeaderboard({
        min_population: minPopulation,
        max_population: maxPopulation,
        allowed_countries: allowedCountries,
        excluded_countries: excludedCountries,
        pageSize: 10,
    });

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

    useEffect(() => {
        const fetchCityInfo = async () => {
            if (isGameComplete && cityProgressList.length > 0) {
                const info = await Promise.all(
                    cityProgressList.map(async (cityProgress) => {
                        try {
                            // Build a more specific search query
                            let searchQuery = cityProgress.city.name;

                            if (cityProgress.city.stateCode) {
                                searchQuery += `, ${cityProgress.city.stateCode}`;
                            }
                            if (
                                cityProgress.city.countryName &&
                                !cityProgress.city.stateCode
                            ) {
                                searchQuery += `, ${cityProgress.city.countryName}`;
                            }

                            const response = await fetch(
                                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`,
                            );
                            const data = await response.json();

                            return {
                                name: cityProgress.city.name,
                                image: data.thumbnail?.source,
                                description: data.extract,
                                wikiLink: data.content_urls?.desktop?.page,
                            };
                        } catch (error) {
                            return { name: cityProgress.city.name };
                        }
                    }),
                );

                setCityProgressList((prevList) =>
                    prevList.map((cityProgress, index) => ({
                        ...cityProgress,
                        info: info[index],
                    })),
                );
            }
        };

        fetchCityInfo();
    }, [isGameComplete]);

    // Add this new effect to handle game completion and score submission
    useEffect(() => {
        if (isGameComplete && cityProgressList.length > 0) {
            const foundCitiesData = cityProgressList.map(
                (cityProgress, index) => {
                    const { city, startTime, penalties } = cityProgress;
                    const endTime =
                        cityProgressList[index + 1]?.startTime || timer;

                    return {
                        name: city.name,
                        country_name: city.countryName || "",
                        state_code: city.stateCode,
                        seconds_spent_searching:
                            endTime - startTime + penalties,
                    };
                },
            );

            // Submit the score
            submitScore({
                time_seconds: timer,
                cities_found: cityProgressList.length,
                found_cities: foundCitiesData,
                min_population: minPopulation,
                max_population: maxPopulation,
                allowed_countries: allowedCountries,
                excluded_countries: excludedCountries,
                labels_disabled: disableMapLabels,
            });
        }
    }, [isGameComplete]);

    const handleSkip = async () => {
        setTimer((prev) => prev + 60);
        setCityProgressList((prevList) => {
            const updatedList = [...prevList];

            updatedList[currentCityIndex].penalties += 60;

            return updatedList;
        });
        await loadNewCity();
    };

    // Assuming a time value in seconds, format it with leading zeros
    function formatTime(time: number) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const deciseconds = Math.floor((time % 1) * 10);

        return `${minutes}:${seconds.toString().padStart(2, "0")}.${deciseconds}`;
    }

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
                            Final Time: {formatTime(timer)}
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <Tabs aria-label="Game Results">
                            {/* Cities Found Tab*/}
                            <Tab key="cities" title="Cities Found">
                                <div className="grid grid-cols-1 gap-4">
                                    {cityProgressList.map(
                                        (cityProgress, index) => (
                                            <Card
                                                key={index}
                                                className="w-full"
                                            >
                                                <div className="relative">
                                                    {/* City Image */}
                                                    {cityProgress.info
                                                        ?.image ? (
                                                        <img
                                                            alt={
                                                                cityProgress
                                                                    .city.name
                                                            }
                                                            className="w-full h-[200px] object-cover"
                                                            src={
                                                                cityProgress
                                                                    .info.image
                                                            }
                                                        />
                                                    ) : (
                                                        <div className="w-full h-[200px] bg-gray-300" />
                                                    )}

                                                    {/* Title overlay at bottom of image */}
                                                    <div className="absolute flex justify-between bottom-0 w-full bg-black/40 backdrop-blur-sm p-3">
                                                        <h4 className="text-white font-medium text-xl">
                                                            {
                                                                cityProgress
                                                                    .city.name
                                                            }
                                                        </h4>
                                                        {cityProgress.info
                                                            ?.wikiLink && (
                                                            <Button
                                                                as="a"
                                                                className="text-tiny min-w-20"
                                                                color="primary"
                                                                href={
                                                                    cityProgress
                                                                        .info
                                                                        .wikiLink
                                                                }
                                                                radius="full"
                                                                size="sm"
                                                                target="_blank"
                                                            >
                                                                Learn More
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <CardFooter className="flex justify-between items-center gap-2 px-3 py-2">
                                                    <p className="text-sm text-default-600 line-clamp-3 flex-grow">
                                                        {
                                                            cityProgress.info
                                                                ?.description
                                                        }
                                                    </p>
                                                </CardFooter>
                                            </Card>
                                        ),
                                    )}
                                </div>
                            </Tab>

                            {/* Leaderboard Tab */}
                            <Tab key="leaderboard" title="Leaderboard">
                                <Table
                                    isHeaderSticky
                                    aria-label="Leaderboard"
                                    bottomContent={
                                        hasMore ? (
                                            <div className="flex w-full justify-center">
                                                <Button
                                                    isDisabled={isLoading}
                                                    variant="flat"
                                                    onPress={loadMore}
                                                >
                                                    {isLoading && (
                                                        <Spinner
                                                            color="white"
                                                            size="sm"
                                                        />
                                                    )}
                                                    Load More
                                                </Button>
                                            </div>
                                        ) : null
                                    }
                                    classNames={{
                                        wrapper:
                                            "max-h-[400px] overflow-scroll",
                                        base: "",
                                        table: "",
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn>#</TableColumn>
                                        <TableColumn>Player</TableColumn>
                                        <TableColumn>Time</TableColumn>
                                        <TableColumn>Date</TableColumn>
                                    </TableHeader>
                                    <TableBody
                                        isLoading={isInitialLoading}
                                        items={leaderboard.map(
                                            (entry, index) => ({
                                                ...entry,
                                                rank: index + 1,
                                            }),
                                        )}
                                        loadingContent={
                                            <Spinner label="Loading..." />
                                        }
                                    >
                                        {(item) => (
                                            <TableRow key={item.entry_id}>
                                                <TableCell>
                                                    {item.rank}
                                                </TableCell>
                                                <TableCell>
                                                    <User
                                                        avatarProps={{
                                                            radius: "lg",
                                                            src: item.profile_picture_url,
                                                        }}
                                                        name={item.username}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {formatTime(
                                                        item.time_seconds,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        item.created_at,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Tab>
                        </Tabs>
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
