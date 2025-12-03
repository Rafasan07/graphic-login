import { ClickPoint } from "../register/page";


// --- 1. Snap value to nearest grid ---
export function roundDown(value: number) {
    return Math.floor(value * 10) / 10;
}

// --- 2. Process clicks: snap, sort, serialize ---
export function processClicks(clicks: ClickPoint[]) {
    return clicks
        .map(c => ({ x: roundDown(c.x), y: roundDown(c.y) }))
        .sort((a, b) => a.x - b.x || a.y - b.y)
        .map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`)
        .join(';');
}
