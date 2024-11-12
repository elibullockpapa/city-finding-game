// app/map/page.tsx
import CityFindingGlobe from "@/components/3DMap/city-finding-globe";

export default function MapPage() {
    return (
        <div className="h-screen -mt-12">
            <CityFindingGlobe />
        </div>
    );
}
