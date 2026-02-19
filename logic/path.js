import { Geometry } from './geometry.js';
/**
 * Path Logic: Algorithms for path simplification and smoothing.
 */
export class Path {
    /**
     * Ramer-Douglas-Peucker Algorithm
     */
    static simplify(points, epsilon) {
        if (points.length <= 2 || epsilon <= 0)
            return points;
        let maxDistance = 0;
        let index = 0;
        const start = points[0];
        const end = points[points.length - 1];
        for (let i = 1; i < points.length - 1; i++) {
            const d = Geometry.perpendicularDistance(points[i], start, end);
            if (d > maxDistance) {
                index = i;
                maxDistance = d;
            }
        }
        if (maxDistance > epsilon) {
            const left = this.simplify(points.slice(0, index + 1), epsilon);
            const right = this.simplify(points.slice(index), epsilon);
            return [...left.slice(0, -1), ...right];
        }
        else {
            return [start, end];
        }
    }
    /**
     * Path Smoothing (Moving Average)
     */
    static smooth(points, strength) {
        if (points.length <= 2 || strength <= 0)
            return points;
        const result = [...points];
        const window = Math.floor(strength / 10) + 1;
        for (let i = 1; i < points.length - 1; i++) {
            let sx = 0, sy = 0, count = 0;
            for (let j = i - window; j <= i + window; j++) {
                if (j >= 0 && j < points.length) {
                    sx += points[j].x;
                    sy += points[j].y;
                    count++;
                }
            }
            result[i] = { x: sx / count, y: sy / count };
        }
        return result;
    }
    /**
     * Trace the perimeter of a color cluster to create a single SVG path.
     * (Pure mathematical algorithm for the Logic Layer)
     */
    static traceCluster(indices, width) {
        const edges = new Set();
        // 1. Identify all boundary edges
        for (const idx of indices) {
            const x = idx % width;
            const y = Math.floor(idx / width);
            const neighbors = [
                { x: x, y: y - 1, id: 'top' },
                { x: x + 1, y: y, id: 'right' },
                { x: x, y: y + 1, id: 'bottom' },
                { x: x - 1, y: y, id: 'left' }
            ];
            neighbors.forEach((n) => {
                const nIdx = n.y * width + n.x;
                const isBoundary = n.x < 0 || n.x >= width || n.y < 0 || !indices.has(nIdx);
                if (isBoundary) {
                    // Edge represented as (x1,y1)-(x2,y2)
                    let edge;
                    if (n.id === 'top')
                        edge = `${x},${y}-${x + 1},${y}`;
                    else if (n.id === 'right')
                        edge = `${x + 1},${y}-${x + 1},${y + 1}`;
                    else if (n.id === 'bottom')
                        edge = `${x + 1},${y + 1}-${x},${y + 1}`;
                    else
                        edge = `${x},${y + 1}-${x},${y}`;
                    edges.add(edge);
                }
            });
        }
        // 2. Chain edges into loops
        const pathParts = [];
        while (edges.size > 0) {
            const startEdge = edges.values().next().value;
            if (!startEdge)
                break;
            edges.delete(startEdge);
            const [start, end] = startEdge.split('-');
            let current = end;
            let path = `M ${start.replace(',', ' ')} L ${end.replace(',', ' ')}`;
            let found = true;
            while (found) {
                found = false;
                for (const edge of edges) {
                    if (edge.startsWith(current + '-')) {
                        const [_, nextEnd] = edge.split('-');
                        path += ` L ${nextEnd.replace(',', ' ')}`;
                        current = nextEnd;
                        edges.delete(edge);
                        found = true;
                        break;
                    }
                }
            }
            path += ' Z';
            pathParts.push(path);
        }
        return pathParts.join(' ');
    }
}
