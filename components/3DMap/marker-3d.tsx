"use client";

import { useEffect } from "react";

import { useCallbackRef } from "./map-utility-hooks";
import { Marker3DElement } from "./map-3d-types";

export interface Marker3DProps {
    position: google.maps.LatLngAltitudeLiteral;
    altitudeMode?:
        | "absolute"
        | "clamp-to-ground"
        | "relative-to-ground"
        | "relative-to-mesh";
    collisionBehavior?:
        | "optional-and-hides-lower-priority"
        | "required"
        | "required-and-hides-optional";
    drawsWhenOccluded?: boolean;
    extruded?: boolean;
    label?: string;
    sizePreserved?: boolean;
    zIndex?: number;
    children?: React.ReactNode;
}

export function Marker3D({
    position,
    altitudeMode = "relative-to-ground",
    collisionBehavior = "required",
    drawsWhenOccluded = false,
    extruded = false,
    label,
    sizePreserved = false,
    zIndex,
    children,
}: Marker3DProps) {
    const [markerElement, markerRef] = useCallbackRef<Marker3DElement>();

    useEffect(() => {
        if (!markerElement) return;

        customElements.whenDefined("gmp-marker-3d").then(() => {
            markerElement.position = position;
        });
    }, [markerElement, position]);

    return (
        <gmp-marker-3d
            ref={markerRef}
            altitude-mode={altitudeMode}
            collision-behavior={collisionBehavior}
            draws-when-occluded={drawsWhenOccluded}
            extruded={extruded}
            label={label}
            size-preserved={sizePreserved}
            z-index={zIndex?.toString()}
        >
            {children}
        </gmp-marker-3d>
    );
}
