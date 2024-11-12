// app/map/page.tsx
import { Suspense } from "react";

import CityFindingGlobe from "@/components/3DMap/city-finding-globe";

export default function MapPage() {
    return (
        <div className="h-dvh -mt-12">
            <Suspense fallback={<div>Loading...</div>}>
                <CityFindingGlobe />
            </Suspense>
        </div>
    );
}
