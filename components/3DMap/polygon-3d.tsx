"use client";

import { useEffect } from "react";

import { useCallbackRef } from "./map-utility-hooks";

export interface Polygon3DProps {
    coordinates: google.maps.LatLngAltitudeLiteral[];
    altitudeMode?: "absolute" | "relative-to-ground";
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    extruded?: boolean;
}

export function Polygon3D({
    coordinates,
    altitudeMode = "relative-to-ground",
    fillColor = "rgba(255, 0, 0, 0.5)",
    strokeColor = "#0000ff",
    strokeWidth = 2,
    extruded = true,
}: Polygon3DProps) {
    const [polygonElement, polygonRef] =
        useCallbackRef<google.maps.maps3d.Polygon3DElement>();

    useEffect(() => {
        if (!polygonElement) return;

        customElements.whenDefined("gmp-polygon-3d").then(() => {
            polygonElement.outerCoordinates = coordinates;
        });
    }, [polygonElement, coordinates]);

    return (
        <gmp-polygon-3d
            ref={polygonRef}
            altitude-mode={altitudeMode}
            extruded={extruded}
            fill-color={fillColor}
            stroke-color={strokeColor}
            stroke-width={String(strokeWidth)}
        />
    );
}
