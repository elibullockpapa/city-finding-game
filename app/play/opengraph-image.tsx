import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Play City Finding Game";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({
    searchParams,
}: {
    searchParams: { cities: string; minPop: string; noLabels: string };
}) {
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
                    <p>🎯 {searchParams.cities} cities to find</p>
                    <p>
                        👥 Min. population:{" "}
                        {parseInt(searchParams.minPop).toLocaleString()}
                    </p>
                    <p>
                        🏷️ Labels:{" "}
                        {searchParams.noLabels === "true"
                            ? "Hidden"
                            : "Visible"}
                    </p>
                </div>
            </div>
        ),
        {
            ...size,
        },
    );
}
