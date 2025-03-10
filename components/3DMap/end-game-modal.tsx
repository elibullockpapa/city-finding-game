"use client";

import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Tabs,
    Tab,
    Card,
    CardFooter,
} from "@heroui/react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ReactConfetti from "react-confetti";
import { useUser } from "@clerk/nextjs";

import { Wikipedia_W, Google_G, Share } from "../icons";

import LeaderboardTable from "./leaderboard-table";

import { formatTime } from "@/utils/formatTime";

interface CityInfo {
    name: string;
    image?: string;
    description?: string;
    wikiLink?: string;
}

interface CityProgress {
    city: {
        name: string;
        countryName?: string;
        stateCode?: string | null;
        population?: number;
        coordinates: {
            lat: number;
            lon: number;
        };
    };
    startTime: number;
    penalties: number;
    info?: CityInfo;
}

export default function EndGameModal({
    isOpen,
    onClose,
    timer,
    cityProgressList,
}: {
    isOpen: boolean;
    onClose: () => void;
    timer: number;
    cityProgressList: CityProgress[];
}) {
    const router = useRouter();
    const [cityInfo, setCityInfo] = useState<(CityInfo | undefined)[]>([]);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [showConfetti, setShowConfetti] = useState(false);
    const { isSignedIn } = useUser();

    useEffect(() => {
        const fetchCityInfo = async () => {
            if (isOpen && cityProgressList.length > 0) {
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

                            // First try direct page lookup
                            let summaryData;

                            try {
                                const directResponse = await fetch(
                                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`,
                                );

                                if (directResponse.ok) {
                                    summaryData = await directResponse.json();
                                }
                            } catch (error) {
                                // Direct lookup failed, continue to search
                            }

                            // If direct lookup failed, try searching
                            if (
                                !summaryData ||
                                summaryData.type ===
                                    "https://mediawiki.org/wiki/HyperSwitch/errors/not_found"
                            ) {
                                const searchResponse = await fetch(
                                    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*`,
                                );
                                const searchData = await searchResponse.json();

                                if (searchData.query?.search?.length > 0) {
                                    const bestMatch =
                                        searchData.query.search[0].title;
                                    const summaryResponse = await fetch(
                                        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestMatch)}`,
                                    );

                                    summaryData = await summaryResponse.json();
                                }
                            }

                            if (summaryData) {
                                return {
                                    name: cityProgress.city.name,
                                    image: summaryData.thumbnail?.source,
                                    description: summaryData.extract,
                                    wikiLink:
                                        summaryData.content_urls?.desktop?.page,
                                };
                            }

                            return { name: cityProgress.city.name };
                        } catch (error) {
                            // eslint-disable-next-line no-console
                            console.error("Error fetching city info:", error);

                            return { name: cityProgress.city.name };
                        }
                    }),
                );

                setCityInfo(info);
            }
        };

        fetchCityInfo();
    }, [isOpen, cityProgressList]);

    useEffect(() => {
        if (isOpen) {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
            setShowConfetti(true);
            // Optional: Hide confetti after 5 seconds
            const timer = setTimeout(() => setShowConfetti(false), 5000);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `I found ${cityProgressList.length} cities in ${formatTime(timer)}! Can you beat my time?`,
                    url: window.location.href,
                });
            } else {
                // Fallback for devices that don't support Web Share API
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error sharing:", error);
        }
    };

    return (
        <>
            <Modal
                hideCloseButton
                backdrop="blur"
                isDismissable={false}
                isOpen={isOpen}
                scrollBehavior="inside"
                onClose={onClose}
            >
                {showConfetti && (
                    <ReactConfetti
                        gravity={0.3}
                        height={windowSize.height}
                        initialVelocityY={20}
                        numberOfPieces={200}
                        recycle={false}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            zIndex: 99999,
                            pointerEvents: "none",
                        }}
                        width={windowSize.width}
                    />
                )}
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <p className="text-xl text-center">
                            Final Time: {formatTime(timer)}
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <Tabs aria-label="Game Results">
                            {/* Cities Found Tab */}
                            <Tab key="cities" title="Cities Found">
                                <div className="grid grid-cols-1 gap-4">
                                    {cityProgressList.map(
                                        (cityProgress, index) => (
                                            <Card
                                                key={index}
                                                className="w-full"
                                            >
                                                <div className="relative">
                                                    {cityInfo[index]?.image ? (
                                                        <>
                                                            <img
                                                                alt={
                                                                    cityProgress
                                                                        .city
                                                                        .name
                                                                }
                                                                className="w-full h-[200px] object-cover"
                                                                src={
                                                                    cityInfo[
                                                                        index
                                                                    ]?.image
                                                                }
                                                            />
                                                            <div className="absolute flex justify-between bottom-0 w-full bg-black/40 backdrop-blur-sm p-3">
                                                                <h4 className="text-white font-medium text-xl">
                                                                    {
                                                                        cityProgress
                                                                            .city
                                                                            .name
                                                                    }
                                                                </h4>
                                                                <div className="flex gap-2">
                                                                    {cityInfo[
                                                                        index
                                                                    ]
                                                                        ?.wikiLink && (
                                                                        <Button
                                                                            isIconOnly
                                                                            as="a"
                                                                            className="min-w-12 bg-white"
                                                                            href={
                                                                                cityInfo[
                                                                                    index
                                                                                ]
                                                                                    ?.wikiLink
                                                                            }
                                                                            radius="full"
                                                                            size="sm"
                                                                            target="_blank"
                                                                            variant="bordered"
                                                                        >
                                                                            <Wikipedia_W
                                                                                size={
                                                                                    20
                                                                                }
                                                                            />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        isIconOnly
                                                                        as="a"
                                                                        className="min-w-12 bg-white"
                                                                        href={`https://www.google.com/search?q=${encodeURIComponent(`${cityProgress.city.name}, ${cityProgress.city.countryName}`)}`}
                                                                        radius="full"
                                                                        size="sm"
                                                                        target="_blank"
                                                                        variant="bordered"
                                                                    >
                                                                        <Google_G
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex justify-between items-center p-3">
                                                            <h4 className="font-medium text-xl">
                                                                {
                                                                    cityProgress
                                                                        .city
                                                                        .name
                                                                }
                                                            </h4>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    isIconOnly
                                                                    as="a"
                                                                    className="min-w-12 bg-white"
                                                                    href={`https://wikipedia.org/w/index.php?search=${encodeURIComponent(`${cityProgress.city.name}, ${cityProgress.city.countryName}`)}`}
                                                                    radius="full"
                                                                    size="sm"
                                                                    target="_blank"
                                                                    variant="bordered"
                                                                >
                                                                    <Wikipedia_W
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                </Button>
                                                                <Button
                                                                    isIconOnly
                                                                    as="a"
                                                                    className="min-w-12 bg-white"
                                                                    href={`https://www.google.com/search?q=${encodeURIComponent(`${cityProgress.city.name}, ${cityProgress.city.countryName}`)}`}
                                                                    radius="full"
                                                                    size="sm"
                                                                    target="_blank"
                                                                    variant="bordered"
                                                                >
                                                                    <Google_G
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {cityInfo[index]
                                                    ?.description && (
                                                    <CardFooter className="flex justify-between items-center gap-2 px-3 py-2">
                                                        <p className="text-sm text-default-600 line-clamp-3 flex-grow">
                                                            {
                                                                cityInfo[index]
                                                                    ?.description
                                                            }
                                                        </p>
                                                    </CardFooter>
                                                )}
                                            </Card>
                                        ),
                                    )}
                                </div>
                            </Tab>

                            {/* Leaderboard Tab */}
                            <Tab key="leaderboard" title="Leaderboard">
                                <div className="flex flex-col gap-4">
                                    {!isSignedIn && (
                                        <Card className="bg-warning-50 border-warning-200 border-2">
                                            <CardFooter className="flex items-center gap-2 px-4 py-3">
                                                <p className="text-warning-700 font-medium">
                                                    Sign in to save your record
                                                    to the leaderboard!
                                                </p>
                                            </CardFooter>
                                        </Card>
                                    )}
                                    <LeaderboardTable />
                                </div>
                            </Tab>
                        </Tabs>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            fullWidth
                            color="primary"
                            onPress={() => router.push("/")}
                        >
                            Home
                        </Button>
                        <Button
                            fullWidth
                            startContent={<Share size={24} />}
                            variant="bordered"
                            onPress={handleShare}
                        >
                            Share
                        </Button>
                        <Button
                            fullWidth
                            color="success"
                            onPress={() => window.location.reload()}
                        >
                            Play Again
                        </Button>
                    </ModalFooter>
                </ModalContent>
                <ToastContainer
                    draggable
                    hideProgressBar
                    pauseOnHover
                    position="bottom-right"
                    theme="colored"
                    transition={Bounce}
                />
            </Modal>
        </>
    );
}
