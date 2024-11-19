// utils/formatTime.ts
export function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const deciseconds = Math.floor((time % 1) * 10);

    return `${minutes}:${seconds.toString().padStart(2, "0")}.${deciseconds}`;
}
