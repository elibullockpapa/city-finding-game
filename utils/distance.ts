// functions/distance.ts

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export function calculateDistanceInMiles(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const R = 3959; // Earth's radius in miles
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
