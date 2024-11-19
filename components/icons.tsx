import * as React from "react";

import { IconSvgProps } from "@/types";

export const Logo: React.FC<IconSvgProps> = ({
    size = 36,
    width,
    height,
    ...props
}) => (
    <svg
        fill="none"
        height={size || height}
        viewBox="0 0 32 32"
        width={size || width}
        {...props}
    >
        <path
            clipRule="evenodd"
            d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
            fill="currentColor"
            fillRule="evenodd"
        />
    </svg>
);

export const GithubIcon: React.FC<IconSvgProps> = ({
    size = 24,
    width,
    height,
    ...props
}) => {
    return (
        <svg
            height={size || height}
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <path
                clipRule="evenodd"
                d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};

export const MoonFilledIcon = ({
    size = 24,
    width,
    height,
    ...props
}: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
            fill="currentColor"
        />
    </svg>
);

export const SunFilledIcon = ({
    size = 24,
    width,
    height,
    ...props
}: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <g fill="currentColor">
            <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
            <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
        </g>
    </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
    >
        <path
            d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <path
            d="M22 22L20 20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
);

export const Wikipedia_W = ({
    size = 24,
    width,
    height,
    ...props
}: IconSvgProps) => (
    <svg
        height={size || height}
        viewBox="0 0 128 128"
        width={size || width}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <linearGradient id="j">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 0,
                    }}
                />
                <stop
                    offset={0.5}
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 0,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 1,
                    }}
                />
            </linearGradient>
            <linearGradient id="i">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#0e7309",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#70d13e",
                        stopOpacity: 1,
                    }}
                />
            </linearGradient>
            <linearGradient id="h">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#2c8300",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={0.25}
                    style={{
                        stopColor: "#3db800",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={0.5}
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#69cf35",
                        stopOpacity: 1,
                    }}
                />
            </linearGradient>
            <linearGradient id="g">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#002f32",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#045b04",
                        stopOpacity: 1,
                    }}
                />
            </linearGradient>
            <linearGradient id="f">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#e8e8e8",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={0.5}
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#e8e8e8",
                        stopOpacity: 1,
                    }}
                />
            </linearGradient>
            <linearGradient id="e">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={0.5}
                    style={{
                        stopColor: "#fdd99a",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#c39539",
                        stopOpacity: 1,
                    }}
                />
            </linearGradient>
            <linearGradient id="d">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#7d491f",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#926600",
                        stopOpacity: 1,
                    }}
                />
            </linearGradient>
            <linearGradient id="c">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 0,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 1,
                    }}
                />
            </linearGradient>
            <linearGradient id="b">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#fff",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#5eb2ff",
                        stopOpacity: 1,
                    }}
                />
            </linearGradient>
            <linearGradient id="a">
                <stop
                    offset={0}
                    style={{
                        stopColor: "#0917a0",
                        stopOpacity: 1,
                    }}
                />
                <stop
                    offset={1}
                    style={{
                        stopColor: "#0345f4",
                        stopOpacity: 1,
                    }}
                />
            </linearGradient>
        </defs>
        <path
            d="M95.869 23.91v2.138c-2.822.501-4.957 1.388-6.407 2.66-2.077 1.888-4.525 4.778-6.132 8.67l-32.685 66.713H48.47L15.657 36.51c-1.528-3.468-3.606-5.588-4.233-6.358a10.28 10.28 0 0 0-3.614-2.804c-1.43-.675-3.36-1.108-5.79-1.3v-2.14h31.928v2.14c-3.683.346-5.44.963-6.537 1.849-1.097.886-1.645 2.023-1.645 3.41 0 1.928.9 4.934 2.703 9.019l24.233 45.959 23.692-45.38c1.842-4.471 3.37-7.574 3.37-9.308 0-1.118-.568-2.187-1.705-3.209-1.136-1.02-2.422-1.744-5.125-2.168a37.477 37.477 0 0 0-1-.173V23.91H95.87z"
            style={{
                fontSize: "178.22499084px",
                fontStyle: "normal",
                fontWeight: 400,
                fill: "#000",
                fillOpacity: 1,
                stroke: "none",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeOpacity: 1,
                fontFamily: "Times New Roman",
            }}
            transform="translate(1)"
        />
        <path
            d="M123.98 23.91v2.138c-2.821.501-4.957 1.388-6.407 2.66-2.076 1.888-4.525 4.778-6.132 8.67l-28.685 66.713H80.58L50.268 36.51c-1.528-3.468-3.606-5.588-4.232-6.358a10.28 10.28 0 0 0-3.615-2.804c-1.43-.675-2.726-1.108-5.156-1.3v-2.14H68.56v2.14c-3.683.346-5.44.963-6.536 1.849-1.098.886-1.646 2.023-1.646 3.41 0 1.928.901 4.934 2.704 9.019l21.732 45.959 19.693-45.38c1.841-4.471 3.37-7.574 3.37-9.308 0-1.118-.569-2.187-1.705-3.209-1.137-1.02-3.057-1.744-5.76-2.168a37.474 37.474 0 0 0-1-.173V23.91h24.569z"
            style={{
                fontSize: "178.22499084px",
                fontStyle: "normal",
                fontWeight: 400,
                fill: "#000",
                fillOpacity: 1,
                stroke: "none",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeOpacity: 1,
                fontFamily: "Times New Roman",
            }}
            transform="translate(1)"
        />
    </svg>
);

export const Google_G = ({ size = 24, ...props }: IconSvgProps) => (
    <svg
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
        <path d="M1 1h22v22H1z" fill="none" />
    </svg>
);

export const Share = ({ size = 24, ...props }: IconSvgProps) => (
    <svg
        height={size}
        viewBox="0 0 50 50"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M30.3 13.7 25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z" />
        <path d="M24 7h2v21h-2z" />
        <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z" />
    </svg>
);

export const ThreeDots = ({ size = 24, ...props }: IconSvgProps) => (
    <svg
        height={size}
        viewBox="0 0 16 16"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </svg>
);

export const InfoIcon = ({ size = 24, ...props }: IconSvgProps) => (
    <svg
        height={size}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
);
