import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Play City Finding Game";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({
    searchParams = {
        cities: "3",
        minPop: "7000000",
        noLabels: "false",
    },
}: {
    searchParams: { cities: string; minPop: string; noLabels: string };
}) {
    // Load Poppins font
    const poppinsRegular = fetch(
        new URL("../../public/fonts/Poppins-Regular.ttf", import.meta.url),
    ).then((res) => res.arrayBuffer());

    const citiesCount = searchParams.cities || "3";
    const population = parseInt(searchParams.minPop || "7000000");
    const labels = searchParams.noLabels || "false";

    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(to bottom, #1e293b, #0f172a)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px",
                }}
            >
                <h1
                    style={{
                        fontSize: 60,
                        color: "white",
                        marginBottom: "20px",
                        textAlign: "center",
                    }}
                >
                    City Finding Challenge
                </h1>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        fontSize: 32,
                        color: "#94a3b8",
                    }}
                >
                    <p>🎯 {citiesCount} cities to find</p>
                    <p>👥 Min. population: {population.toLocaleString()}</p>
                    <p>🏷️ Labels: {labels === "true" ? "Hidden" : "Visible"}</p>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: "Poppins",
                    data: await poppinsRegular,
                    style: "normal",
                    weight: 400,
                },
            ],
        },
    );
}
