// components/3DMap/map-3d-types.ts

import { DOMAttributes, RefAttributes } from "react";

// add an overload signature for the useMapsLibrary hook, so typescript
// knows what the 'maps3d' library is.
import { } from "@vis.gl/react-google-maps"; // empty import necessary to prevent error when overloading
declare module "@vis.gl/react-google-maps" {
    export function useMapsLibrary(
        name: "maps3d",
    ): typeof google.maps.maps3d | null;
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
        }
    }
}

type GmpMap3DAttributeNames = keyof Omit<
    google.maps.maps3d.Map3DElementOptions,
    "bounds"
>;

// a helper type for CustomElement definitions
type CustomElement<TElem, TAttr> = Partial<
    TAttr &
    DOMAttributes<TElem> &
    RefAttributes<TElem> & {
        // for whatever reason, anything else doesn't work as children
        // of a custom element, so we allow `any` here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: any;
    }
>;
