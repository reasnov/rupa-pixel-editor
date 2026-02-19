/**
 * Geometry Logic: Pure mathematical functions for shapes and lines.
 */
export class Geometry {
    /**
     * Clean Bresenham's Line Algorithm (8-connectivity).
     * Produces standard 1-pixel width lines without the "staircase" zigzag.
     */
    static getLinePoints(x0, y0, x1, y1, broadness = 0) {
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);
        const points = [];
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        while (true) {
            points.push({ x: x0, y: y0 });
            // BROADNESS: Only add thickness if stabilization is high (>90)
            // AND it's not a perfect diagonal/axis line.
            const isPerfectDiagonal = dx === dy;
            const isPerfectAxis = dx === 0 || dy === 0;
            if (broadness > 0.9 && !isPerfectDiagonal && !isPerfectAxis) {
                if (dx > dy)
                    points.push({ x: x0, y: y0 + sy });
                else
                    points.push({ x: x0 + sx, y: y0 });
            }
            if (x0 === x1 && y0 === y1)
                break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
        return points;
    }
    /**
     * Midpoint Circle Algorithm: Returns pixel-perfect circle coordinates.
     */
    static getCirclePoints(cx, cy, radius) {
        cx = Math.floor(cx);
        cy = Math.floor(cy);
        radius = Math.round(radius);
        const points = [];
        let x = radius;
        let y = 0;
        let err = 0;
        while (x >= y) {
            const octants = [
                { x: cx + x, y: cy + y },
                { x: cx + y, y: cy + x },
                { x: cx - y, y: cy + x },
                { x: cx - x, y: cy + y },
                { x: cx - x, y: cy - y },
                { x: cx - y, y: cy - x },
                { x: cx + y, y: cy - x },
                { x: cx + x, y: cy - y }
            ];
            octants.forEach((p) => points.push(p));
            if (err <= 0) {
                y += 1;
                err += 2 * y + 1;
            }
            if (err > 0) {
                x -= 1;
                err -= 2 * x + 1;
            }
        }
        return points;
    }
    /**
     * Fits an arc or circle to a set of points.
     */
    static fitArc(points, circularityThreshold) {
        if (points.length < 10)
            return null;
        let sumX = 0, sumY = 0;
        points.forEach((p) => {
            sumX += p.x;
            sumY += p.y;
        });
        const cx = sumX / points.length;
        const cy = sumY / points.length;
        let totalR = 0;
        const radii = points.map((p) => {
            const r = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
            totalR += r;
            return r;
        });
        const avgR = totalR / points.length;
        let variance = 0;
        radii.forEach((r) => {
            variance += (r - avgR) ** 2;
        });
        const stdDev = Math.sqrt(variance / points.length);
        const circularity = stdDev / (avgR || 1);
        if (circularity > circularityThreshold)
            return null;
        const p0 = points[0];
        const pn = points[points.length - 1];
        const distStartEnd = Math.sqrt((p0.x - pn.x) ** 2 + (p0.y - pn.y) ** 2);
        const isFull = distStartEnd < avgR * 1.5 || points.length > avgR * Math.PI * 1.5;
        const refined = [];
        const startAngle = Math.atan2(points[0].y - cy, points[0].x - cx);
        const endAngle = Math.atan2(points[points.length - 1].y - cy, points[points.length - 1].x - cx);
        const steps = Math.max(32, Math.floor(avgR * 10));
        let angleDiff = endAngle - startAngle;
        while (angleDiff > Math.PI)
            angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI)
            angleDiff += Math.PI * 2;
        const totalAngle = isFull ? Math.PI * 2 : angleDiff;
        for (let i = 0; i <= steps; i++) {
            const angle = startAngle + totalAngle * (i / steps);
            refined.push({ x: cx + Math.cos(angle) * avgR, y: cy + Math.sin(angle) * avgR });
        }
        return { cx, cy, r: avgR, isFull, points: refined };
    }
    static perpendicularDistance(p, a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (dx === 0 && dy === 0)
            return Math.sqrt((p.x - a.x) ** 2 + (p.y - a.y) ** 2);
        return Math.abs(dy * p.x - dx * p.y + b.x * a.y - b.y * a.x) / Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Converts internal grid coordinates to artisan Cartesian labels (Center-relative).
     */
    static toCartesianLabel(pos, size, invert = false) {
        const mid = Math.floor(size / 2);
        const val = size % 2 === 0 ? (pos < mid ? pos - mid : pos - mid + 1) : pos - mid;
        return invert ? -val : val;
    }
    /**
     * Calculates the percentage position for canvas grid guides.
     */
    static getGuidePosition(offset, size) {
        return 50 + (offset / size) * 100;
    }
    /**
     * Maps screen coordinates to canvas grid coordinates.
     */
    static mapScreenToGrid(clientX, clientY, rect, canvasWidth, canvasHeight) {
        const xPct = (clientX - rect.left) / rect.width;
        const yPct = (clientY - rect.top) / rect.height;
        return {
            x: xPct * canvasWidth,
            y: yPct * canvasHeight
        };
    }
    /**
     * Calculates the CSS transform string for the camera viewport.
     */
    static calculateCameraTransform(zoomLevel, panOffset, cursorPos, canvasWidth, canvasHeight) {
        const { x: px, y: py } = panOffset;
        if (zoomLevel <= 1) {
            return `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${zoomLevel})`;
        }
        const xPct = ((cursorPos.x + 0.5) / canvasWidth) * 100;
        const yPct = ((cursorPos.y + 0.5) / canvasHeight) * 100;
        return `translate(calc(-${xPct}% + ${px}px), calc(-${yPct}% + ${py}px)) scale(${zoomLevel})`;
    }
    /**
     * Calculates the movement delta for panning.
     */
    static calculatePanDelta(currentX, currentY, lastX, lastY) {
        return {
            dx: currentX - lastX,
            dy: currentY - lastY
        };
    }
}
