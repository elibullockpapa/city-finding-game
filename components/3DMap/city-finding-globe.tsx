// components/3DMap/city-finding-globe.tsx
"use client";

import { useCallback, useState } from "react";

import { Marker3D } from "./marker-3d";

import { Map3D, Map3DCameraProps } from "@/components/3DMap/map-3d";

// Begin game far above New York City
const INITIAL_VIEW_PROPS = {
    center: { lat: 40.7079, lng: -74.0132, altitude: 20000000 },
    range: 0,
    heading: 0,
    tilt: 0,
    roll: 0,
};

export default function CityFindingGlobe() {
    const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);
    const [selectedMarker, setSelectedMarker] =
        useState<google.maps.LatLngAltitudeLiteral | null>(null);

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
        <Map3D
            {...viewProps}
            onCameraChange={handleCameraChange}
            onClick={handleMapClick}
        >
            {selectedMarker && <Marker3D position={selectedMarker} />}
        </Map3D>
    );
}
