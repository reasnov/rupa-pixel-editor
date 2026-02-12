/**
 * SelectionState: Manages block selection boundaries.
 */
export class SelectionState {
    start = $state<{ x: number; y: number } | null>(null);
    end = $state<{ x: number; y: number } | null>(null);

    get isActive(): boolean {
        return this.start !== null;
    }

    begin(x: number, y: number) {
        this.start = { x, y };
        this.end = { x, y };
    }

    update(x: number, y: number) {
        if (this.start) {
            this.end = { x, y };
        }
    }

    clear() {
        this.start = null;
        this.end = null;
    }

    get bounds() {
        if (!this.start || !this.end) return null;
        return {
            x1: Math.min(this.start.x, this.end.x),
            x2: Math.max(this.start.x, this.end.x),
            y1: Math.min(this.start.y, this.end.y),
            y2: Math.max(this.start.y, this.end.y)
        };
    }
}
