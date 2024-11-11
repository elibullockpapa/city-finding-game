// components/3DMap/map-3d-types.ts

import { DOMAttributes, RefAttributes } from "react";

// add an overload signature for the useMapsLibrary hook, so typescript
// knows what the 'maps3d' library is.
import {} from "@vis.gl/react-google-maps"; // empty import necessary to prevent error when overloading
declare module "@vis.gl/react-google-maps" {
    export function useMapsLibrary(
        name: "maps3d",
    ): typeof google.maps.maps3d | null;
}

// This interface is needed because google maps library doesn't have google.maps.maps3d.Marker3DElement
// Documentation: https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DElement
export interface Marker3DElement extends HTMLElement {
    altitudeMode?: string;
    collisionBehavior?: string;
    drawsWhenOccluded?: boolean;
    extruded?: boolean;
    label?: string;
    position?: google.maps.LatLngLiteral | google.maps.LatLngAltitude;
    sizePreserved?: boolean;
    zIndex?: number;
}

// add the <gmp-map-3d> custom-element to the JSX.IntrinsicElements
// interface, so it can be used in jsx
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            ["gmp-map-3d"]: CustomElement<
                google.maps.maps3d.Map3DElement,
                {
                    [key in GmpMap3DAttributeNames]?: string;
                }
            >;
            "gmp-polygon-3d": CustomElement<
                google.maps.maps3d.Polygon3DElement,
                {
                    "altitude-mode"?: string;
                    "fill-color"?: string;
                    "stroke-color"?: string;
                    "stroke-width"?: string;
                    extruded?: boolean;
                }
            >;
            "gmp-marker-3d": CustomElement<
                Marker3DElement,
                {
                    "altitude-mode"?: string;
                    "collision-behavior"?: string;
                    "draws-when-occluded"?: boolean;
                    extruded?: boolean;
                    label?: string;
                    "size-preserved"?: boolean;
                    "z-index"?: string;
                }
            >;
        }
    }
}

type GmpMap3DAttributeNames = keyof Omit<
    google.maps.maps3d.Map3DElementOptions,
    "bounds"
>;

export interface Map3DCustomEvents {
    "gmp-click": google.maps.maps3d.LocationClickEvent;
}

// a helper type for CustomElement definitions
type CustomElement<TElem, TAttr> = Partial<
    TAttr &
        DOMAttributes<TElem> &
        RefAttributes<TElem> & {
            // for whatever reason, anything else doesn't work as children
            // of a custom element, so we allow `any` here
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            children: any;
        } & {
            [K in keyof Map3DCustomEvents]?: (
                event: Map3DCustomEvents[K],
            ) => void;
        }
>;
