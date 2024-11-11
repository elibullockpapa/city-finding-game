// components/3DMap/city-finding-globe.tsx
"use client";

import { useCallback, useState } from "react";

import { Map3D, Map3DCameraProps } from "@/components/3DMap/map-3d";

const INITIAL_VIEW_PROPS = {
    center: { lat: 40.7079, lng: -74.0132, altitude: 20000000 },
    range: 0,
    heading: 0,
    tilt: 0,
    roll: 0,
};

export default function CityFindingGlobe() {
    const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);

    const handleCameraChange = useCallback((props: Map3DCameraProps) => {
        setViewProps((oldProps) => ({ ...oldProps, ...props }));
    }, []);

    return (
        <Map3D
            {...viewProps}
            //defaultLabelsDisabled
            onCameraChange={handleCameraChange}
        />
    );
}
